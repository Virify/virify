import { vi } from "vitest";

// Mock window APIs required by maplibre-gl (loaded by Nuxt plugins)
if (typeof window !== "undefined") {
  window.URL.createObjectURL = vi.fn(() => "mock-object-url");
  window.URL.revokeObjectURL = vi.fn();
}

// Mock ImageData for maplibre-gl
global.ImageData = class ImageData {
  width: number;
  height: number;
  data: Uint8ClampedArray;

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
    this.data = new Uint8ClampedArray(width * height * 4);
  }
} as any;

// Mock Worker which is required by maplibre-gl
global.Worker = class Worker {
  constructor(public url: string) {}
  postMessage() {}
  terminate() {}
  addEventListener() {}
  removeEventListener() {}
  dispatchEvent() {
    return true;
  }
  onmessage = null;
  onerror = null;
} as any;

// Mock createImageBitmap for maplibre-gl
global.createImageBitmap = vi.fn().mockResolvedValue({});
