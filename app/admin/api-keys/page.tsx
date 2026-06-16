import { prisma } from "@/server/lib/prisma"
import { requireSuperAdmin } from "@/server/lib/auth-guards"
import { serialize } from "@/lib/serialize"
import { connection } from "next/server"
import { ApiKeysClient } from "./api-keys-client"

type ApiKey = {
  id: string
  name: string
  prefix: string
  createdAt: string
  lastUsedAt: string | null
  expiresAt: string | null
}

export default async function ApiKeysPage() {
  await connection()
  await requireSuperAdmin()

  const keys = await prisma.apiKey.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      prefix: true,
      createdAt: true,
      lastUsedAt: true,
      expiresAt: true,
    },
  })

  return <ApiKeysClient initialKeys={serialize(keys) as unknown as ApiKey[]} />
}
