import * as z from 'zod';

const verificationSchema = z.object({
  file: z.file().min(2).max(10 * 1024 * 1024).mime(allowedMimes),
  address: z.string().transform((str) => JSON.parse(str)).pipe(z.object({
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
  })),
  tier: z.string().transform((str) => JSON.parse(str)).pipe(z.object({
    tier: z.string(),
    price: z.number(),
    rank: z.number(),
  })),
});

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event);
  try {
    const formData = await readFormData(event);
    
    const { file, address, tier } = verificationSchema.parse({
      file: formData.get('file'),
      address: formData.get('address'),
      tier: formData.get('tier'),
    });

    // Generate unique filename
    const key = generateUniqueFilename(file.name, 'verification');

    // Convert file to buffer
    const buffer = await convertFileToBuffer(file);

    // Upload to R2
    const response = await addVerificationObjectToR2(key, buffer);

    // Create UserOwnership record with pending documents
    const userOwnership = await createUserOwnershipRecord(user.id, [response.key]);
    
    
    // TODO: Send the signed url to OpenAI for verification processing

    /**
     * TODO: If verification passes, update user's verification and move documents into acceptedDocuments and reviewed to accepted.
     * 
     * We also need to create/update the Address record and link it to the UserOwnership
     * 
     * If fails, move to rejectedDocuments with reason and delete the address record if created.
     * 
     * If accepted, create the draft listing and link the address to it.
     */
    

    return {
      message: 'File uploaded successfully',
      tier,
      address,
      response,
      userOwnership,
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
