import crypto from "node:crypto";

/**
 * 🌊 Generate a stable idempotency key for Stripe operations.
 * Valid for a 24h window if based on payload alone, 
 * but we add a 1-hour window precision to allow retries 
 * while blocking accidental double-clicks.
 */
export function generateIdempotencyKey(payload: unknown): string {
  const window = Math.floor(Date.now() / (60 * 60 * 1000)); // 1-hour window
  const data = JSON.stringify({ payload, window });
  return crypto.createHash("sha256").update(data).digest("hex");
}

/**
 * ⚡ Retry wrapper for Stripe API calls with exponential backoff.
 */
export async function withStripeRetry<T>(
  fn: () => Promise<T>,
  retries = 3,
  delay = 500
): Promise<T> {
  let lastError: unknown;
  
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      
      // Don't retry on certain errors (e.g., validation)
      if (error && typeof error === 'object' && 'type' in error && error.type === 'StripeInvalidRequestError') {
        throw error;
      }

      console.warn(`[STRIPE RETRY] Attempt ${i + 1} failed. Retrying in ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
      delay *= 2; // Exponential backoff
    }
  }

  throw lastError;
}
