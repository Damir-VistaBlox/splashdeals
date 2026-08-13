import { NextResponse } from "next/server";
import { generateTicketQrBuffer } from "@/app/(server)/lib/ticket-assets";

export async function GET(_request: Request, { params }: { params: Promise<{ hash: string }> }) {
  const { hash } = await params;
  const qrBuffer = await generateTicketQrBuffer(hash);
  return new NextResponse(qrBuffer as unknown as BodyInit, {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
