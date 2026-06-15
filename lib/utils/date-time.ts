/**
 * 🕒 Date & Time Utilities (Splashdeals V4)
 * Shared logic for 24h notation, durations, and localization.
 * Focus: Serbian Language (Primary)
 */

export const DAYS_SR = [
  "Nedelja",
  "Ponedeljak",
  "Utorak",
  "Sreda",
  "Četvrtak",
  "Petak",
  "Subota"
];

/**
 * Serbian Day Objects for Form Selectors
 */
export const DAYS_SR_OBJECTS = [
  { label: "Ponedeljak", value: 1 },
  { label: "Utorak", value: 2 },
  { label: "Sreda", value: 3 },
  { label: "Četvrtak", value: 4 },
  { label: "Petak", value: 5 },
  { label: "Subota", value: 6 },
  { label: "Nedelja", value: 0 },
];

/**
 * Enforces 24h notation (HH:mm)
 */
export function formatTime24h(time: string | null | undefined): string {
  if (!time) return "--:--";
  
  // Handle cases where time might already include seconds or be malformed
  const parts = time.split(':');
  if (parts.length < 2) return time;
  
  const h = parts[0].padStart(2, '0');
  const m = parts[1].padStart(2, '0');
  
  return `${h}:${m}`;
}

/**
 * Calculates duration between two 24h time strings
 */
export function calculateDuration(openTime: string, closeTime: string) {
  const [oH, oM] = (openTime || "00:00").split(':').map(Number);
  const [cH, cM] = (closeTime || "00:00").split(':').map(Number);
  
  const totalMinutes = (cH * 60 + cM) - (oH * 60 + oM);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  
  return {
    totalMinutes,
    hours,
    minutes,
    display: `${hours}h${minutes > 0 ? ` ${minutes}m` : ""}`
  };
}
