import { prisma } from "./prisma"
import { createHash, randomBytes } from "crypto"

/**
 * Hashing function for API keys (SHA-256)
 */
export function hashApiKey(plainKey: string): string {
  return createHash("sha256").update(plainKey).digest("hex")
}

/**
 * Generates a new random API key with 'sd_' prefix
 */
export function generateApiKey() {
  const plainKey = `sd_${randomBytes(24).toString("hex")}` // 48 chars total
  const prefix = plainKey.slice(0, 11) // 'sd_' + 8 chars
  const hashedKey = hashApiKey(plainKey)
  
  return {
    plainKey,
    prefix,
    hashedKey
  }
}

/**
 * Authenticates a request using the x-api-key header.
 * Returns the User if valid, otherwise throws an Error.
 */
export async function authenticateRequest(request: Request) {
  const apiKey = request.headers.get("x-api-key")
  
  if (!apiKey) {
    throw new Error("API key missing")
  }

  const hashedKey = hashApiKey(apiKey)

  const keyRecord = await prisma.apiKey.findUnique({
    where: { key: hashedKey },
    include: { user: true }
  })

  if (!keyRecord) {
    throw new Error("Invalid API key")
  }

  if (keyRecord.expiresAt && keyRecord.expiresAt < new Date()) {
    throw new Error("API key expired")
  }

  // Update last used timestamp asynchronously
  prisma.apiKey.update({
    where: { id: keyRecord.id },
    data: { lastUsedAt: new Date() }
  }).catch(err => console.error("Failed to update lastUsedAt for API key:", err))

  return keyRecord.user
}
