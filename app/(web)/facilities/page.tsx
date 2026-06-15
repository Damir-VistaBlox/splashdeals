import { permanentRedirect } from "next/navigation";
import { connection } from "next/server";

export default async function LegacyFacilitiesPage() {
  await connection();
  permanentRedirect("/");
}

export async function generateMetadata() {
  await connection();
  permanentRedirect("/");
}
