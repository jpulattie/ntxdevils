import AWS from 'aws-sdk';
import { S3Client, ListObjectsV2Command } from "@aws-sdk/client-s3";

import multer from 'multer';
import {NextResponse} from 'next/server';
import dotenv from 'dotenv';



const region = process.env.AWS_REGION
const bucketName = process.env.AWS_BUCKET_NAME
const accessKeyId = process.env.AWS_ACC_KEY
const secretAccessKey = process.env.AWS_SEC_KEY

const s3 = new S3Client({
    region,
    credentials: {
        accessKeyId: accessKeyId,
        secretAccessKey: secretAccessKey,
    },
});


export async function GET() {
    console.log("PHOTOS GET REQUEST MADE");
    try {
        const params = {
        Bucket: bucketName,
        };
        const command = new ListObjectsV2Command(params);
        const data = await s3.send(command);    
        console.log('photos data ', data)

    return new Response(JSON.stringify({
        photos: data.Contents,
        bucketName: process.env.AWS_BUCKET_NAME,
        region: process.env.AWS_REGION,
        }), 
        {status: 200});
}
    catch (error) {
        console.log('error msg', error)
        return new Response(JSON.stringify({error: error.message}, {status: 500}));
    }

    }