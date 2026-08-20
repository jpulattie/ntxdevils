import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import sharp from 'sharp';
const { query } = require('../../adminData/db');
const { rekognition, COLLECTION_ID } = require('../client');
const { DetectFacesCommand, SearchFacesByImageCommand } = require('@aws-sdk/client-rekognition');

export const runtime = 'nodejs';

const region = process.env.AWS_REGION;
const bucketName = process.env.AWS_BUCKET_NAME;
const accessKeyId = process.env.AWS_ACC_KEY;
const secretAccessKey = process.env.AWS_SEC_KEY;

// Similarity >= AUTO_THRESHOLD auto-tags straight into photo_intersection. Between LOWER_THRESHOLD
// and AUTO_THRESHOLD (or no match at all, or a detected face below LOWER_THRESHOLD) goes to the
// photo_face_match review queue instead -- see database.sql for why.
const AUTO_THRESHOLD = 96;
const LOWER_THRESHOLD = 80;
// Discard faces DetectFaces isn't confident about, or that are too small to be a real subject
// (background/crowd faces in a team photo) -- not worth spending a SearchFacesByImage call on.
const MIN_FACE_CONFIDENCE = 90;
const MIN_FACE_RATIO = 0.05;
// Rekognition's face-search only compares the single largest face per call, so each detected face
// is cropped out (with this margin around the bounding box for context) and searched individually.
const CROP_MARGIN = 0.2;

function parseRosterId(externalImageId) {
    const match = /^roster-(\d+)$/.exec(externalImageId || '');
    return match ? Number(match[1]) : null;
}

async function uploadToS3(buffer, contentType, originalName) {
    const cleanFileName = originalName.replace(/[^a-zA-Z0-9._-]/g, '_').replace(/_{2,}/g, '_');
    const uniqueFileName = `${uuidv4()}-${cleanFileName}`;
    const url = `https://${bucketName}.s3.${region}.amazonaws.com/photos/${uniqueFileName}`;
    const s3 = new S3Client({ region, credentials: { accessKeyId, secretAccessKey } });
    await s3.send(new PutObjectCommand({
        Bucket: bucketName,
        Key: `photos/${uniqueFileName}`,
        Body: buffer,
        ContentType: contentType,
        ContentLength: buffer.length,
        ACL: 'public-read',
    }));
    return url;
}

async function processPhoto(buffer, teamId, eventId) {
    const detectResult = await rekognition.send(new DetectFacesCommand({
        Image: { Bytes: buffer },
        Attributes: ['DEFAULT'],
    }));
    const { width: imgWidth = 0, height: imgHeight = 0 } = await sharp(buffer).metadata();

    const faces = (detectResult.FaceDetails || []).filter((f) => {
        const box = f.BoundingBox;
        return box && (f.Confidence || 0) >= MIN_FACE_CONFIDENCE && box.Width >= MIN_FACE_RATIO && box.Height >= MIN_FACE_RATIO;
    });

    const autoTagged = [];
    const reviewRows = [];

    for (const face of faces) {
        const box = face.BoundingBox;
        const left = Math.max(0, Math.round((box.Left - box.Width * CROP_MARGIN) * imgWidth));
        const top = Math.max(0, Math.round((box.Top - box.Height * CROP_MARGIN) * imgHeight));
        const width = Math.min(imgWidth - left, Math.round(box.Width * (1 + 2 * CROP_MARGIN) * imgWidth));
        const height = Math.min(imgHeight - top, Math.round(box.Height * (1 + 2 * CROP_MARGIN) * imgHeight));
        if (width <= 0 || height <= 0) continue;

        const cropBuffer = await sharp(buffer).extract({ left, top, width, height }).toBuffer();

        let faceMatches = [];
        try {
            const searchResult = await rekognition.send(new SearchFacesByImageCommand({
                CollectionId: COLLECTION_ID,
                Image: { Bytes: cropBuffer },
                FaceMatchThreshold: LOWER_THRESHOLD,
                MaxFaces: 1,
            }));
            faceMatches = searchResult.FaceMatches || [];
        } catch (err) {
            // InvalidParameterException etc. if Rekognition can't find a face in the crop itself --
            // treat as "no match" rather than failing the whole photo.
            faceMatches = [];
        }

        const best = faceMatches[0];
        const rosterId = best ? parseRosterId(best.Face.ExternalImageId) : null;
        const similarity = best ? best.Similarity : null;
        const boxPixels = {
            left: Math.round(box.Left * imgWidth),
            top: Math.round(box.Top * imgHeight),
            width: Math.round(box.Width * imgWidth),
            height: Math.round(box.Height * imgHeight),
        };

        if (rosterId && similarity >= AUTO_THRESHOLD) {
            autoTagged.push({ rosterId });
        } else {
            reviewRows.push({ rosterId, similarity, ...boxPixels });
        }
    }

    return { autoTagged, reviewRows };
}

export async function POST(request) {
    try {
        const formData = await request.formData();
        const files = formData.getAll('files');
        const teamId = formData.get('team_id') ? Number(formData.get('team_id')) : null;
        const eventId = formData.get('event_id') ? Number(formData.get('event_id')) : null;

        if (!files.length) {
            return NextResponse.json({ error: 'No files uploaded' }, { status: 400 });
        }

        const results = [];

        for (const file of files) {
            const buffer = Buffer.from(await file.arrayBuffer());
            const url = await uploadToS3(buffer, file.type, file.name);

            const insertResult = await query('insert into photo (photo_url) values (?)', [url]);
            const photoId = insertResult.insertId;

            let autoTagged = [];
            let flaggedForReview = 0;

            try {
                const { autoTagged: tagged, reviewRows } = await processPhoto(buffer, teamId, eventId);
                for (const { rosterId } of tagged) {
                    await query(
                        'insert into photo_intersection (photo_id, team_id, roster_id, event_id) values (?, ?, ?, ?)',
                        [photoId, teamId, rosterId, eventId]
                    );
                }
                for (const row of reviewRows) {
                    await query(
                        `insert into photo_face_match
                            (photo_id, roster_id, similarity, face_left, face_top, face_width, face_height)
                         values (?, ?, ?, ?, ?, ?, ?)`,
                        [photoId, row.rosterId, row.similarity, row.left, row.top, row.width, row.height]
                    );
                }
                autoTagged = tagged.map((t) => t.rosterId);
                flaggedForReview = reviewRows.length;
            } catch (err) {
                console.error('face recognition error for photo', photoId, err);
            }

            results.push({ photoId, url, autoTagged, flaggedForReview });
        }

        return NextResponse.json({ results });
    } catch (error) {
        console.error('bulkUploadPhotos error:', error);
        return NextResponse.json({ error: error.message || 'Upload failed' }, { status: 500 });
    }
}
