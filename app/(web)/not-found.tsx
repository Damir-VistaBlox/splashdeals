import { Metadata } from "next";
import { NotFoundClient } from "./_components/NotFoundClient";

/**
 * 🌊 404 Recovery Hub (Server Component for SEO metadata compliance)
 */
export const metadata: Metadata = {
  title: "Stranica Nije Pronađena | Splashdeals",
  description: "Stranica koju tražite ne postoji ili je premeštena. Vratite se na početnu stranicu da istražite najbolje akva parkove u Srbiji.",
  robots: {
    index: false,
    follow: true,
  },
  alternates: {
    canonical: null,
  },
};

export default function NotFound() {
  return <NotFoundClient />;
}
