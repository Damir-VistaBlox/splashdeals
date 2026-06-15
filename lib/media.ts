import sharp from "sharp";

/**
 * Converts an image buffer to WebP format.
 * Optimized for facility gallery images.
 */
export async function processImageToWebP(buffer: Buffer): Promise<Buffer> {
  return await sharp(buffer)
    .resize(2000, undefined, { 
      withoutEnlargement: true,
      fit: 'inside'
    })
    .webp({ quality: 80 })
    .toBuffer();
}

/**
 * Generates a small WebP thumbnail for videos or photos.
 */
export async function generateThumbnail(buffer: Buffer): Promise<Buffer> {
  return await sharp(buffer)
    .resize(400, 400, {
      fit: 'cover',
    })
    .webp({ quality: 70 })
    .toBuffer();
}

/**
 * 🌊 Ticket Processor
 * Enforces strict 1.91:1 aspect ratio (1200x630) for OG compatibility.
 */
export async function processTicketImage(buffer: Buffer): Promise<Buffer> {
  return await sharp(buffer)
    .resize(1200, 630, {
      fit: 'cover',
      position: 'center'
    })
    .webp({ quality: 85 })
    .toBuffer();
}
