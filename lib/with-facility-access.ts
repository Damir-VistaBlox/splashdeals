import { validateFacilityAccess } from "@/lib/auth-guards"

/**
 * 🌊 Action Authorization Wrapper
 * Encapsulates RBAC and facility ownership checks for Server Actions.
 * Reduces boilerplate and ensures consistent security enforcement.
 */
type ActionHandler<TInput, TOutput> = (
  input: TInput,
  user: Awaited<ReturnType<typeof validateFacilityAccess>>
) => Promise<TOutput>

export function withFacilityAccess<TInput extends { facilityId: string }, TOutput>(
  handler: ActionHandler<TInput, TOutput>
) {
  return async (input: TInput): Promise<TOutput> => {
    const user = await validateFacilityAccess(input.facilityId)
    return handler(input, user)
  }
}
