import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";

const s3 =  new S3Client({
  region: "auto",
  endpoint: process.env.CF_R2_BUCKET,
  credentials: {
    accessKeyId: process.env.CF_ACCESS_KEY || '',
    secretAccessKey: process.env.CF_SECRET_ACCESS_KEY || '',
  },
});

/**
 * Put object to Cloudflare R2 verification bucket
 * @param key String
 * @param body Buffer | Unit8Array | Blob | string | File
 * @returns 
 */
export const addVerificationObjectToR2 = async (key: string, body: Buffer | Uint8Array | Blob | string | File) => {
  const putCommand = new PutObjectCommand({
    Bucket: 'verification',
    Key: key,
    Body: body,
  });

  try {
    return await s3.send(putCommand);
  } catch (error) {
    console.error(`Error uploading object ${key} to R2:`, error);
    throw error;
  }
};

/**
 * Get object from Cloudflare R2 verification bucket
 * @param key String
 * @returns 
 */
export const getVerificationObjectFromR2 = async (key: string) => {
  const getCommand = new GetObjectCommand({
    Bucket: 'verification',
    Key: key,
  });

  try {
    const response = await s3.send(getCommand);
    return response.Body;
  } catch (error) {
    console.error(`Error retrieving object ${key} from R2:`, error);
    throw error;
  }
}