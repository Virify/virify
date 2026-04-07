import { PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getR2BucketName } from '../../../utils/r2Client';
import { randomUUID } from 'node:crypto';
import { PDFParse } from 'pdf-parse';

/**
 * Accepted MIME types for R2 file uploads and their mapped UserMediaType
 */
const ALLOWED_MIME_TYPES: Record<string, string> = {
  'image/jpeg': 'IMAGE',
  'image/png': 'IMAGE',
  'image/gif': 'IMAGE',
  'image/webp': 'IMAGE',
  'application/pdf': 'PDF',
  'application/msword': 'DOCUMENT',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'DOCUMENT',
  'application/vnd.ms-excel': 'SPREADSHEET',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'SPREADSHEET',
};

const EXTENSION_MAP: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/gif': 'gif',
  'image/webp': 'webp',
  'application/pdf': 'pdf',
  'application/msword': 'doc',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
  'application/vnd.ms-excel': 'xls',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'xlsx',
};

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

/**
 * POST /api/r2/upload
 * Upload a file to Cloudflare R2 via multipart form data.
 * Moderates images (via OpenAI URL check) and PDFs (via text extraction).
 * Creates a UserMedia DB record on success.
 */
export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event);

  const config = useRuntimeConfig();
  const r2 = createR2Client();
  const bucket = getR2BucketName();

  // Read multipart form data
  const parts = await readMultipartFormData(event);
  const filePart = parts?.find(p => p.name === 'file');

  if (!filePart?.data) {
    throw createError({ statusCode: 400, statusMessage: 'No file provided' });
  }

  const mimeType = filePart.type ?? 'application/octet-stream';
  const originalName = filePart.filename ?? 'file';
  const fileBuffer = filePart.data;
  const size = fileBuffer.length;

  // Validate MIME type
  const mediaType = ALLOWED_MIME_TYPES[mimeType];
  if (!mediaType) {
    throw createError({
      statusCode: 422,
      statusMessage: `File type "${mimeType}" is not supported. Allowed: images (jpeg, png, gif, webp), PDF, Word documents, Excel spreadsheets.`,
    });
  }

  // Validate file size
  if (size > MAX_FILE_SIZE) {
    throw createError({
      statusCode: 422,
      statusMessage: `File exceeds the 10 MB size limit.`,
    });
  }

  const ext = EXTENSION_MAP[mimeType];
  const key = `user-media/${user.id}/${randomUUID()}.${ext}`;
  const publicUrl = `${config.public.CF_R2_URL}/${key}`;

  // For PDFs: extract text and moderate BEFORE uploading (avoids orphan cleanup on fail)
  if (mediaType === 'PDF') {
    try {
      const parser = new PDFParse({ data: fileBuffer });
      const result = await parser.getText();
      const textToCheck = result.text?.slice(0, 1000) ?? '';

      if (textToCheck.trim().length > 0) {
        const moderationResult = await $fetch<{ flagged: boolean; categories: string[] }>('/api/moderation', {
          method: 'POST',
          body: { text: textToCheck },
        });

        if (moderationResult.flagged) {
          throw createError({
            statusCode: 422,
            statusMessage: 'The PDF contains inappropriate content and cannot be uploaded.',
          });
        }
      }
    } catch (error: unknown) {
      // Re-throw moderation failures (422) immediately
      if (typeof error === 'object' && error !== null && 'statusCode' in error && (error as { statusCode: number }).statusCode === 422) {
        throw error;
      }
      // For PDF parse errors (e.g. malformed file), let the upload continue (fail-open)
      console.warn('PDF text extraction failed — skipping text moderation:', error);
    }
  }

  // Upload to R2
  await r2.send(new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    Body: fileBuffer,
    ContentType: mimeType,
    ContentDisposition: `inline; filename="${originalName.replace(/"/g, '')}"`,
  }));

  // For images: moderate AFTER upload using the public URL, then delete if flagged
  if (mediaType === 'IMAGE') {
    try {
      const moderationResult = await $fetch<{ flagged: boolean; categories: string[] }>('/api/moderation', {
        method: 'POST',
        body: { images: [publicUrl] },
      });

      if (moderationResult.flagged) {
        // Delete the just-uploaded flagged image from R2
        await r2.send(new DeleteObjectCommand({
          Bucket: bucket,
          Key: key,
        }));

        throw createError({
          statusCode: 422,
          statusMessage: 'The image contains inappropriate content and has been removed.',
        });
      }
    } catch (error: unknown) {
      // Re-throw 422 moderation failures
      if (typeof error === 'object' && error !== null && 'statusCode' in error && (error as { statusCode: number }).statusCode === 422) {
        throw error;
      }
      // Fail-open on moderation API errors (same policy as existing moderation endpoint)
      console.warn('Image moderation failed — allowing upload:', error);
    }
  }

  // Persist record to DB
  const userMedia = await prisma.userMedia.create({
    data: {
      userId: user.id,
      key,
      mediaType: mediaType as 'IMAGE' | 'PDF' | 'DOCUMENT' | 'SPREADSHEET' | 'OTHER',
      mimeType,
      originalName,
      size,
    },
    select: {
      id: true,
      key: true,
      mediaType: true,
      mimeType: true,
      originalName: true,
      size: true,
      createdAt: true,
    },
  });

  return {
    ...userMedia,
    url: publicUrl,
  };
});
