import { z } from "zod"

export const mediaUploadSchema = z.object({
  url: z.string().url("Invalid image URL format").optional().or(z.literal("")),
  base64: z.string().optional(),
  fileName: z.string().optional(),
  type: z.enum(["PHOTO", "VIDEO"]).default("PHOTO"),
  purpose: z.enum(["GALLERY", "HERO_ONLY", "TICKET", "AERIAL"]).default("GALLERY"),
  caption: z.string().max(300, "Caption is too long").nullish(),
  isHero: z.boolean().default(false),
  isCardBackground: z.boolean().default(false),
})

export type MediaUploadValues = z.infer<typeof mediaUploadSchema>
