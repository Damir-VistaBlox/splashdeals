import { ZodError } from "zod"
import { Prisma } from "@prisma/client"

interface ActionResult<T = void> {
  success: boolean
  data?: T
  error?: string
  fieldErrors?: Record<string, string[]>
}

/**
 * 🌊 Standardized Server Action Error Handler
 * Maps low-level exceptions to user-friendly Serbian messages and field-level feedback.
 */
export function handleServerActionError(error: unknown): ActionResult<any> {
  if (error instanceof ZodError) {
    // Field-level validation errors (Zod)
    const fieldErrors: Record<string, string[]> = {}
    for (const issue of error.issues) {
      const path = issue.path.join(".")
      if (!fieldErrors[path]) fieldErrors[path] = []
      fieldErrors[path].push(issue.message)
    }
    return { 
      success: false, 
      fieldErrors,
      error: "Proverite unete podatke." 
    }
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    // Database constraint violations (Prisma)
    if (error.code === "P2002") {
      const target = (error.meta?.target as string[])?.join(", ")
      return { 
        success: false, 
        error: `Unos sa istom vrednošću već postoji (${target || "jedinstveni ključ"}).` 
      }
    }
    if (error.code === "P2025") {
      return { 
        success: false, 
        error: "Traženi zapis nije pronađen." 
      }
    }
    return { 
      success: false, 
      error: "Došlo je do greške u bazi podataka." 
    }
  }

  if (error instanceof Error) {
    if (error.message === "Authentication required") {
      return { success: false, error: "Niste prijavljeni." }
    }
    if (error.message?.startsWith("Unauthorized")) {
      return { success: false, error: "Nemate dozvolu za ovu akciju." }
    }
    
    // Custom domain errors
    return { success: false, error: error.message }
  }

  // Generic fallback for unknown types
  console.error("Unhandled server action error:", error)
  return { success: false, error: "Došlo je do neočekivane greške." }
}
