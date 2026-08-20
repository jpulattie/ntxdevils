const { RekognitionClient } = require('@aws-sdk/client-rekognition');

const region = process.env.AWS_REGION;
const accessKeyId = process.env.AWS_ACC_KEY;
const secretAccessKey = process.env.AWS_SEC_KEY;

const rekognition = new RekognitionClient({
    region,
    credentials: { accessKeyId, secretAccessKey },
});

const COLLECTION_ID = process.env.AWS_REKOGNITION_COLLECTION_ID;

module.exports = { rekognition, COLLECTION_ID };
