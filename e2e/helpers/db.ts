import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

/**
 * 🌊 Database Test Helpers (Hardened ESM)
 */

function loadEnv() {
  try {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const envPath = path.resolve(__dirname, "../../.env");
    
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, "utf-8");
      for (const line of content.split("\n")) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith("#")) continue;
        const eqIdx = trimmed.indexOf("=");
        if (eqIdx === -1) continue;
        const key = trimmed.slice(0, eqIdx).trim();
        const val = trimmed.slice(eqIdx + 1).trim().replace(/^["']|["']$/g, "");
        if (!process.env[key]) {
          process.env[key] = val;
        }
      }
    }
  } catch {
    // .env not found
  }
}

if (!process.env.DATABASE_URL) {
  loadEnv();
}

const connectionString = process.env.DATABASE_URL;
const adapter = new PrismaNeon({ connectionString: connectionString || "" });
export const prisma = new PrismaClient({ adapter });

export async function cleanupTestSession(sessionId: string) {
  try {
    await prisma.issuedTicket.deleteMany({
      where: { transaction: { stripeSession: sessionId } },
    });
    await prisma.transaction.deleteMany({
      where: { stripeSession: sessionId },
    });
  } catch (error) {
    console.warn(`[TEST CLEANUP] Failed to clean session ${sessionId}:`, error);
  }
}

export async function disconnect() {
  await prisma.$disconnect();
}
