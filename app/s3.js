import dotenv from 'dotenv'

import aws from 'aws-sdk'

const region = "us-east-2"
const bucketName = "ntxdevils"
const accessKeyId = process.env.AWS_ACC_KEY
const secretAccessKey = process.env.AWS_SEC_KEY

const s3 = new aws.S3({
    region,
    acccessKeyId,
    secretAccessKey,
    signatureVersion: 'v4'
})