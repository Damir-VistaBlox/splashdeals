-- AlterTable: add width, height, collection to CmsMedia
ALTER TABLE "marketing"."cms_media" ADD COLUMN IF NOT EXISTS "width" INTEGER;
ALTER TABLE "marketing"."cms_media" ADD COLUMN IF NOT EXISTS "height" INTEGER;
ALTER TABLE "marketing"."cms_media" ADD COLUMN IF NOT EXISTS "collection" TEXT;
