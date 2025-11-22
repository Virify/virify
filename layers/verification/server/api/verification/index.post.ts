import * as z from 'zod';

const allowedMimes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];

const verificationSchema = z.object({
  files: z.array(z.instanceof(File).refine(
    (file) => file.size >= 2 && file.size <= 10 * 1024 * 1024,
    { message: 'File size must be between 2 bytes and 10MB' }
  ).refine(
    (file) => allowedMimes.includes(file.type),
    { message: 'Invalid file type' }
  )).length(2),
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
    
    const { files, address, tier } = verificationSchema.parse({
      files: formData.getAll('files'),
      address: formData.get('address'),
      tier: formData.get('tier'),
    });

    // Generate unique filenames and upload all files
    const uploadedFiles = await Promise.all(
      files.map(async (file) => {
        const key = generateUniqueFilename(file.name, 'verification');
        const buffer = await convertFileToBuffer(file);
        const response = await addVerificationObjectToR2(key, buffer);
        return response; // Returns { key, url }
      })
    );

    const fileKeys = uploadedFiles.map(f => f.key);
    const fileUrls = uploadedFiles.map(f => f.url);

    // Create UserOwnership record with pending documents
    const userOwnership = await createUserOwnershipRecord(user.id, fileKeys);
    
    const verificationResult = await getAiVerificationCompletion(address as any, fileUrls);

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
      message: 'Files uploaded successfully',
      tier,
      address,
      files: uploadedFiles,
      userOwnership,
      verificationResult,
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
