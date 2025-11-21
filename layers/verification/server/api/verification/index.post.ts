import * as z from 'zod';

const verificationFileSchema = z.object({
  file: z.instanceof(File).refine((file) => file.size > 0, {
    message: 'File must not be empty',
  }),
  address: z.object({
    number: z.string().nullable(),
    flat: z.string().nullable(),
    name: z.string().nullable(),
    locality: z.string().nullable(),
    district: z.string().nullable(),
    street: z.string(),
    city: z.string(),
    county: z.string().nullable(),
    postcode: z.string(),
    country: z.string().nullable(),
    fullAddress: z.string().nullable(),
    lat: z.number(),
    lon: z.number(),
  }),
});

export default defineEventHandler(async (event) => {
  try {
    const { file, address } = await readValidatedBody(event, verificationFileSchema.parse);

    // Generate unique filename
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(7);
    const extension = file.name.split('.').pop();
    const key = `verification-${timestamp}-${randomString}.${extension}`;

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload to R2
    const response = await addVerificationObjectToR2(key, buffer);

    // TODO: Store the key / url in the ownership verification database record
    
    // TODO: Send confirmation email to user and review team

    return {
      message: 'File uploaded successfully',
      key,
      response,
    }
  } catch (error) {
    console.error('Error uploading verification file:', error);
    throw createError({
      statusCode: 500,
      message: 'Failed to upload verification file',
      data: error,
    });
  }
});
