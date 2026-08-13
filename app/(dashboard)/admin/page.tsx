import { redirect } from "next/navigation";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Administracija | Splashdeals",
  description: "Splashdeals admin panel za upravljanje objektima, cenama i sadržajem.",
};

export default function AdminPage() {
  redirect("/admin/dashboard");
}
