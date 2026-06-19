import "server-only";
import { Jimp } from "jimp";

/**
 * Converts an image buffer to JPEG format (max 2000px wide).
 * Optimized for facility gallery images.
 */
export async function processImageToWebP(buffer: Buffer): Promise<Buffer> {
  const image = await Jimp.read(buffer);
  const { width } = image.bitmap;
  if (width > 2000) {
    image.resize({ w: 2000 });
  }
  return await image.getBuffer("image/jpeg");
}

/**
 * Generates a 400x400 JPEG thumbnail (cover crop).
 * For quick previews in admin dashboards.
 */
export async function generateThumbnail(buffer: Buffer): Promise<Buffer> {
  const image = await Jimp.read(buffer);
  image.cover({ w: 400, h: 400 });
  return await image.getBuffer("image/jpeg");
}

/**
 * Processes a ticket image to strict 1.91:1 aspect ratio (1200x630).
 * Required for Open Graph / social preview compatibility.
 */
export async function processTicketImage(buffer: Buffer): Promise<Buffer> {
  const image = await Jimp.read(buffer);
  image.cover({ w: 1200, h: 630 });
  return await image.getBuffer("image/jpeg");
}
