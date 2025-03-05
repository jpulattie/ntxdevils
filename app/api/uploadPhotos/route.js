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

export async function POST(request) {
    try {
        const formData = await request.formData();
        const folder = formData.get("folder");
        const file = formData.get("file");
        console.log("File:", file);
        console.log("folder name", folder);
        if (!file) {
            return new Response(JSON.stringify({ error: "no file uploaded" }), { status: 400 })
        }
        console.log('filename:', file.name)
        console.log('file type', file.type)
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        console.log('buffer', buffer);
        const cleanFileName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_")
        const cleanerFileName = cleanFileName.replace(/_{2,}/g, "_");
        const uniqueFileName = `${uuidv4()}-${cleanerFileName}`;
        console.log('unique name', uniqueFileName);
        const uniqueURL = `https://${bucketName}.s3.${region}.amazonaws.com/${folder}/${uniqueFileName}`


        const s3 = new S3Client({
            region,
            credentials: {
                accessKeyId: accessKeyId,
                secretAccessKey: secretAccessKey,
            },
        });
        const params = {
            Bucket: bucketName,
            Key: `${folder}/${uniqueFileName}`,
            Body: buffer,
            ContentType: file.type,
            ContentLength: buffer.length,
            ACL: 'public-read',
        };
        console.log('params', params)
        try {
            await s3.send(new PutObjectCommand(params));

        }

        catch (error) {
            console.error("S3 Upload Error:", error);
            return NextResponse.json({ error: "Failed to upload to S3" });
        }

        return new Response(JSON.stringify({ url: uniqueURL, key: uniqueFileName }), {
            status: 201,
            headers: {
                "Content-Type": "application/json",
            },
        });
    } catch (error) {
        console.log('error', error)
        return new Response(JSON.stringify({ message: "Error" }), {
            status: 500,
            headers: {
                "Content-Type": "application/json",
            },
        });
    }
}