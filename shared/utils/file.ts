export const allowedMimes = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'image/bmp',
  'image/tiff',
  'image/svg+xml',
  'image/heic',
  'application/pdf'
];

/**
 * Generate a unique filename based on timestamp and random UUID
 * @param originalName String
 * @returns string
 */
export const generateUniqueFilename = (originalName: string, bucketName: string): string => {
  const timestamp = Date.now();
  const randomString = crypto.randomUUID().replace(/-/g, '');
  const extension = originalName.split('.').pop();
  return `${bucketName}-${timestamp}-${randomString}.${extension}`;
};

/**
 * Convert File to Buffer
 * @param file File
 * @returns Buffer
 */
export const convertFileToBuffer = async (file: File): Promise<Buffer> => {
  const arrayBuffer = await file.arrayBuffer();
  return Buffer.from(arrayBuffer);
};