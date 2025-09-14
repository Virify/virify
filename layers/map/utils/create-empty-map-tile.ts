/**
 *  Create a minimal transparent image Uint8Array to fix missing images
 *  for map tiles
 */
export function createEmptyMapTile(size = 1) {
  const data = new Uint8Array(size * size * 4);

  // Fill with transparent pixels (RGBA: 0,0,0,0)
  for (let i = 0; i < data.length; i += 4) {
    data[i] = 0;     // R
    data[i + 1] = 0; // G
    data[i + 2] = 0; // B
    data[i + 3] = 0; // A (transparent)
  }

  return data
}