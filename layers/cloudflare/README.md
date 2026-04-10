# Cloudflare Layer

## Overview

The Cloudflare layer handles all integrations with Cloudflare services: Images (for listing photos), R2 (for user-uploaded files with moderation), and Turnstile (CAPTCHA). Two distinct upload patterns are used depending on whether server-side moderation is required.

## Directory Structure

```
layers/cloudflare/
├── app/
│   └── composables/
│       ├── useCloudflareImages.ts      # Listing photo upload/delete via direct upload
│       └── useCloudflareR2.ts          # User file upload/delete via server-proxied upload
├── server/
│   ├── api/
│   │   ├── cloudflare/
│   │   │   ├── index.post.ts           # POST /api/cloudflare — get one-time upload URL
│   │   │   └── [id]/
│   │   │       └── index.delete.ts     # DELETE /api/cloudflare/:id — delete image
│   │   └── r2/
│   │       ├── upload/
│   │       │   └── index.post.ts       # POST /api/r2/upload — validate + moderate + upload
│   │       └── [id]/
│   │           └── index.delete.ts     # DELETE /api/r2/:id — delete file
│   └── utils/
│       └── r2Client.ts                 # S3Client configured for Cloudflare R2 endpoint
└── nuxt.config.ts
```

## Upload Patterns

### Cloudflare Images — Direct Upload (listing photos)

Used for listing images. Files go directly from the browser to Cloudflare, bypassing the server to avoid bandwidth costs.

```
Client → POST /api/cloudflare → server returns one-time upload URL
Client → PUT <one-time URL> (direct to Cloudflare Images)
```

**Composable: `useCloudflareImages()`**

```ts
const { uploadImage, uploadImages, deleteImage, getImageUrl, getImageUrls } = useCloudflareImages()

// Upload
const imageId = await uploadImage(file)            // returns Cloudflare image ID
const imageIds = await uploadImages(files)         // batch upload

// Delete
await deleteImage(imageId)

// Display
const url = getImageUrl(imageId, 'public')         // get CDN URL for a variant
const urls = getImageUrls(imageIds, 'public')      // batch get CDN URLs
```

Image IDs are UUIDs matching `/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i`. Use `isCloudflareId()` utility to detect them.

### Cloudflare R2 — Server-Proxied Upload (user files)

Used for user-uploaded files (e.g. profile documents). Files pass through the Nuxt server so they can be validated and moderation-scanned before storage. A `UserMedia` database record is created on successful upload.

```
Client → POST /api/r2/upload (multipart) → server validates MIME + moderates → uploads to R2 → creates DB record
```

**Composable: `useCloudflareR2()`**

```ts
const { uploadFile, deleteFile, getFileUrl } = useCloudflareR2()

const media = await uploadFile(file)               // returns UserMedia record
await deleteFile(mediaId)                          // deletes from R2 + removes DB record
const url = getFileUrl(key)                        // constructs R2 CDN URL from file key
```

**`r2Client.ts`** — creates an `S3Client` pointed at `https://<CF_ACCOUNT_ID>.r2.cloudflarestorage.com` using R2-specific access credentials.

## Cloudflare Turnstile (CAPTCHA)

Turnstile is integrated via the `useTurnstile()` composable (in the main app layer) for protecting auth forms (login, signup, password reset). The `CF_SECRET_KEY` is used server-side to verify tokens.

## Environment Variables

```bash
# Server-side (secret)
CF_SECRET_KEY=...                  # Turnstile secret for CAPTCHA verification
CF_IMAGES_API_KEY=...              # Cloudflare Images API token
CF_ACCOUNT_ID=...                  # Cloudflare account ID
CF_SERVICE_TOKEN_ID=...            # Service token (used by seed layer)
CF_SERVICE_TOKEN_SECRET=...        # Service token secret
CF_R2_TOKEN=...                    # R2 API token
CF_R2_BUCKET=...                   # R2 bucket name
CF_ACCESS_KEY=...                  # R2 S3-compat access key
CF_SECRET_ACCESS_KEY=...           # R2 S3-compat secret key

# Client-side / public (runtimeConfig.public)
CF_SITE_KEY=...                    # Turnstile site key (used in browser)
CF_R2_URL=...                      # R2 public URL base for getFileUrl()
CF_ACCOUNT_HASH=...                # Cloudflare account hash for Images CDN URLs
```
