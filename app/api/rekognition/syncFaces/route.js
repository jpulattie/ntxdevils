import { NextResponse } from 'next/server';
const { query } = require('../../adminData/db');
const { rekognition, COLLECTION_ID } = require('../client');
const {
    IndexFacesCommand,
    DeleteFacesCommand,
    CreateCollectionCommand,
} = require('@aws-sdk/client-rekognition');

export const runtime = 'nodejs';

async function ensureCollectionExists() {
    try {
        await rekognition.send(new CreateCollectionCommand({ CollectionId: COLLECTION_ID }));
    } catch (err) {
        if (err.name !== 'ResourceAlreadyExistsException') throw err;
    }
}

// One-time-per-player enrollment: indexes a player's profile picture into the shared Rekognition
// collection so bulk-uploaded team photos can later be matched against it. Re-syncing a player who
// already has a rekognition_face_id deletes the old face first -- otherwise a re-uploaded profile
// photo would leave two FaceIds pointing at the same player in the collection.
export async function POST(request) {
    try {
        const body = await request.json().catch(() => ({}));
        await ensureCollectionExists();

        const players = body.rosterId
            ? await query('select id, picture, rekognition_face_id from roster where id = ?', [body.rosterId])
            : await query('select id, picture, rekognition_face_id from roster where picture is not null');

        const synced = [];
        const skipped = [];
        const errors = [];

        for (const player of players) {
            if (!player.picture) {
                skipped.push(player.id);
                continue;
            }
            try {
                if (player.rekognition_face_id) {
                    await rekognition
                        .send(new DeleteFacesCommand({ CollectionId: COLLECTION_ID, FaceIds: [player.rekognition_face_id] }))
                        .catch(() => {});
                }

                const imageRes = await fetch(player.picture);
                const buffer = Buffer.from(await imageRes.arrayBuffer());

                const indexResult = await rekognition.send(new IndexFacesCommand({
                    CollectionId: COLLECTION_ID,
                    Image: { Bytes: buffer },
                    ExternalImageId: `roster-${player.id}`,
                    MaxFaces: 1,
                    QualityFilter: 'AUTO',
                }));

                const face = indexResult.FaceRecords?.[0]?.Face;
                if (!face) {
                    skipped.push(player.id);
                    continue;
                }

                await query('update roster set rekognition_face_id = ?, face_enrolled_at = NOW() where id = ?', [face.FaceId, player.id]);
                synced.push(player.id);
            } catch (err) {
                errors.push({ rosterId: player.id, message: err.message });
            }
        }

        return NextResponse.json({ synced, skipped, errors });
    } catch (error) {
        console.error('syncFaces error:', error);
        return NextResponse.json({ error: error.message || 'Sync failed' }, { status: 500 });
    }
}
