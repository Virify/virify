import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";

import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

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
export const addVerificationObjectToR2 = async (key: string, body: Buffer | Uint8Array | Blob | string | File): Promise<{ key: string; url: string }> => {
  const putCommand = new PutObjectCommand({
    Bucket: 'verification',
    Key: key,
    Body: body,
  });

  try {
    // upload
    await s3.send(putCommand);
    // Generate presigned URL
    const url = await getSignedUrlForVerificationObject(key);
    return {
      key,
      url,
    }
  } catch (error) {
    console.error(`Error uploading object ${key} to R2:`, error);
    throw error;
  }
};

/**
 * Get a signed URL for accessing a verification object from Cloudflare R2
 * @param key name of file in bucket
 * @returns string - signed URL valid for 1 week
 */
export const getSignedUrlForVerificationObject = async (key: string): Promise<string> => {
  try {
    const signedUrl = await getSignedUrl(s3, new GetObjectCommand({
      Bucket: 'verification',
      Key: key,
    }), { expiresIn: 604800 }); // 1 week (7 days * 24 hours * 60 minutes * 60 seconds)

    return signedUrl;
  } catch (error) {
    console.error(`Error generating signed URL for object ${key} from R2:`, error);
    throw error;
  }
};