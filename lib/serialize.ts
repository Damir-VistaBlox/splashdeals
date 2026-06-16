/**
 * 🌊 Serialization Utility
 * Next.js RSCs cannot pass Decimal types or complex Dates to Client Islands 
 * without serialization. This utility converts them to plain strings/numbers.
 * 
 * ⚠️ Precision note: Decimal values are converted to JavaScript Number,
 * which may lose precision for high-precision decimal values.
 * This is safe for display purposes (prices, percentages) but NOT for
 * exact monetary calculations.
 */
export function serialize<T>(data: T): T {
  return JSON.parse(JSON.stringify(data, (key, value) => {
    // Convert BigInt to string (Prisma sometimes uses this)
    if (typeof value === 'bigint') return value.toString();
    
    // Convert Decimal to Number (Prisma Decimal.js)
    if (value && typeof value === 'object' && value.constructor?.name === 'Decimal') {
      return Number(value);
    }
    
    return value;
  }));
}
