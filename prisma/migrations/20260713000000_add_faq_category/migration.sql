-- AlterTable: Add category field to facility_faqs
ALTER TABLE "partners"."facility_faqs" ADD COLUMN IF NOT EXISTS "category" TEXT NOT NULL DEFAULT 'opšte';
