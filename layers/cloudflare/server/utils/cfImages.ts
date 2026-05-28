/**
 * Delete a single image from Cloudflare Images.
 * Returns true on success or if the image was already gone (404 / "not found").
 * Logs a warning (but does NOT throw) for any other failure so callers can
 * fire-and-forget or collect results without aborting a broader operation.
 */
export async function deleteCloudflareImage(imageId: string): Promise<boolean> {
  const { CF_ACCOUNT_ID, CF_IMAGES_API_KEY } = useRuntimeConfig();
  try {
    const res = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${CF_ACCOUNT_ID}/images/v1/${encodeURIComponent(imageId)}`,
      {
        method: "DELETE",
        headers: { Authorization: `Bearer ${CF_IMAGES_API_KEY}` },
      },
    );
    const data = await res.json();

    if (!data.success) {
      const msg: string = data.errors?.[0]?.message ?? "";
      if (!msg.toLowerCase().includes("not found") && res.status !== 404) {
        console.warn(
          `Failed to delete Cloudflare image ${imageId}:`,
          data.errors,
        );
        return false;
      }
    }
    return true;
  } catch (err) {
    console.warn(`Error deleting Cloudflare image ${imageId}:`, err);
    return false;
  }
}

/**
 * Delete multiple Cloudflare images in parallel.
 * Never throws — failures are logged as warnings.
 */
export async function deleteCloudflareImages(
  imageIds: string[],
): Promise<void> {
  if (imageIds.length === 0) return;
  await Promise.all(imageIds.map(deleteCloudflareImage));
}
