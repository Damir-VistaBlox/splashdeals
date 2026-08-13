import { NextResponse } from "next/server";
import { generateCode128Buffer } from "@/app/(server)/lib/ticket-assets";

export async function GET(_request: Request, { params }: { params: Promise<{ value: string }> }) {
  const { value } = await params;
  const barcodeBuffer = await generateCode128Buffer(value);

  return new NextResponse(barcodeBuffer as unknown as BodyInit, {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
