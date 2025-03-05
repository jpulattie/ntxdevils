import AWS from 'aws-sdk';
import { S3Client, ListObjectsV2Command, PutObjectCommand } from "@aws-sdk/client-s3";
import { IncomingForm } from 'formidable';
import { NextResponse } from 'next/server';
import dotenv from 'dotenv';
import { promisify } from 'util';
import path from "path";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";
import { Readable } from 'stream';




const region = process.env.AWS_REGION
const bucketName = process.env.AWS_BUCKET_NAME
const accessKeyId = process.env.AWS_ACC_KEY
const secretAccessKey = process.env.AWS_SEC_KEY


export const config = {
    api: {
        bodyParser: false,
    }
};

//// NEED TO SEND -> files AND folder name

export async function POST(req) {
    console.log('req', req)
    return new Promise((resolve, reject) => {
        const form = new IncomingForm();
        form.multiples = true;

        const reqStream = Readable.from(req.body);
       
        form.parse(reqStream, async (error, fields, files) => {
            if (error) {
                return resolve(NextResponse.json({ error: 'Error uploading file' }, { status: 500 }));
            }
            console.log('fields', fields);
            console.log('files', files);
    
            const folder = fields.folder ? fields.folder.trim() : "uploads"

            const s3 = new S3Client({
                region,
                credentials: {
                    accessKeyId: accessKeyId,
                    secretAccessKey: secretAccessKey,
                },
            });

            const uploadedFiles = [];

            const fileArray = Array.isArray(files.photos) ? files.photos : [files.photos];

            for (const file of fileArray) {
                const fileStream = fs.createReadStream(file.filepath);
                const uniqueFileName = `${uuidv4()}-${file.originalFilename}`;
                const uniqueURL = `https://${bucketName}.s3.${region}.amazonaws.com/${folder}/${uniqueFileName}`


                const params = {
                    Bucket: bucketName,
                    Key: `${folder}/${uniqueFileName}`,
                    Body: file.fileStream,
                    ContentType: file.mimetype,
                };

                try {
                    await s3.send(new PutObjectCommand(params));
                    uploadedFiles.push(uniqueURL);

                }

                catch (error) {
                    console.error("S3 Upload Error:", error);
                    return resolve(NextResponse.json({ error: "Failed to upload to S3" }));
                }
            }

            return resolve(NextResponse.json({ message: "file upload success", urls: uploadedFiles }));
        });
    })
}


//Maybe we scrap this approach and loop through uploads and send one to the api at a time?????