import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";

// Polyfill WebSocket in Node.js for Neon serverless adapter
// eslint-disable-next-line @typescript-eslint/no-require-imports
globalThis.WebSocket = require("ws");

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// To avoid static generation failures on Netlify/Vercel without an env string, fallback to dummy
const connectionString = process.env.DATABASE_URL || "postgresql://dummy:dummy@localhost:5432/dummy";
const adapter = new PrismaNeon({ connectionString });

export const prisma = globalForPrisma.prisma || new PrismaClient({ adapter });

// In development, handle hot-reloading when new models are added to schema
if (process.env.NODE_ENV !== "production") {
  // If we have a global instance but it's missing the new models, 
  // force a refresh to pick up the new generated client structure.
  if (globalForPrisma.prisma && !(globalForPrisma.prisma as unknown as Record<string, unknown>).amenity) {
    globalForPrisma.prisma = new PrismaClient({ adapter });
  } else {
    globalForPrisma.prisma = prisma;
  }
}
