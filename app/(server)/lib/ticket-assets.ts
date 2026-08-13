import bwipjs from "bwip-js";
import QRCode from "qrcode";

function trimTrailingSlash(value: string): string {
  return value.replace(/\/+$/, "");
}

export function getPublicSiteUrl(): string {
  return trimTrailingSlash(
    process.env.NEXT_PUBLIC_SITE_URL ||
      process.env.NEXT_PUBLIC_BASE_URL ||
      "https://www.splashdeals.rs",
  );
}

export function buildPublicTicketUrl(qrHash: string): string {
  return `${getPublicSiteUrl()}/verify/${encodeURIComponent(qrHash)}`;
}

export function buildSuccessPageUrl(sessionId: string): string {
  return `${getPublicSiteUrl()}/success?session_id=${encodeURIComponent(sessionId)}`;
}

export function buildCartUrl(): string {
  return `${getPublicSiteUrl()}/cart`;
}

export function buildTicketQrImageUrl(qrHash: string): string {
  return `${getPublicSiteUrl()}/api/qr/${encodeURIComponent(qrHash)}`;
}

export function buildTicketBarcodeImageUrl(ticketId: string): string {
  return `${getPublicSiteUrl()}/api/barcode/${encodeURIComponent(ticketId)}`;
}

export async function generateTicketQrBuffer(qrHash: string): Promise<Buffer> {
  return QRCode.toBuffer(buildPublicTicketUrl(qrHash), {
    type: "png",
    width: 300,
    margin: 2,
    color: { dark: "#1a1a1a", light: "#ffffff" },
  });
}

export async function generateTicketQrDataUrl(qrHash: string): Promise<string> {
  return QRCode.toDataURL(buildPublicTicketUrl(qrHash), {
    width: 300,
    margin: 2,
    color: { dark: "#1a1a1a", light: "#ffffff" },
  });
}

export async function generateCode128Buffer(value: string): Promise<Buffer> {
  return bwipjs.toBuffer({
    bcid: "code128",
    text: value,
    scale: 3,
    height: 10,
    includetext: true,
    textxalign: "center",
    backgroundcolor: "FFFFFF",
  });
}

export async function generateCode128DataUrl(value: string): Promise<string> {
  const buffer = await generateCode128Buffer(value);
  return `data:image/png;base64,${buffer.toString("base64")}`;
}
