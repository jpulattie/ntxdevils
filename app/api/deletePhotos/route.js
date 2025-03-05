import { S3Client, ListObjectsV2Command, DeleteObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";

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
        const key = formData.get("key");
        console.log("key", key);
        console.log("folder name", folder);
    
        //const uniqueURL = `https://${bucketName}.s3.${region}.amazonaws.com/${folder}/${uniqueFileName}`

        const s3 = new S3Client({
            region,
            credentials: {
                accessKeyId: accessKeyId,
                secretAccessKey: secretAccessKey,
            },
        });
        const params = {
            Bucket: bucketName,
            Key: `${folder}/${key}`,
            
        };
        console.log('params', params)
        try {
            await s3.send(new DeleteObjectCommand(params));

        }

        catch (error) {
            console.error("S3 Upload Error:", error);
            return NextResponse.json({ error: "Failed to upload to S3" });
        }

        return new Response(JSON.stringify({ message: "delete ran without error" }), {
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