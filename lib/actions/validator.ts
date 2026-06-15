import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { z } from "zod"

/**
 * 🛡️ Server Action Validator
 * Ensures that every server action is authenticated and its input is strictly validated.
 * Aligns with Next.js 16 and Splashdeals Agent Protocol.
 */
export async function validateAction<T extends z.ZodTypeAny>(
  schema: T,
  data: unknown
): Promise<{ 
  success: true; 
  data: z.infer<T>; 
  userId: string;
} | { 
  success: false; 
  error: string; 
}> {
  try {
    // 1. Authorization Gate
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session?.user?.id) {
      return { success: false, error: "UNAUTHORIZED: You must be logged in to perform this action." }
    }

    // 2. Input Validation Gate
    const validatedData = await schema.parseAsync(data)

    return {
      success: true,
      data: validatedData,
      userId: session.user.id
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      const issues = error.issues.map(i => `${i.path.join('.')}: ${i.message}`).join(', ')
      return { success: false, error: `VALIDATION_ERROR: ${issues}` }
    }
    return { success: false, error: "INTERNAL_ERROR: An unexpected error occurred during action validation." }
  }
}
