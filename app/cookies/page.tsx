import type { Metadata } from "next";
import { LegalContent } from "@/components/legal/LegalContent";

export const metadata: Metadata = {
  title: "Cookie Policy — ENCOMM",
  description: "Cookies and similar browser technologies currently used by the ENCOMM website.",
  alternates: {
    canonical: "/en/cookies",
    languages: { en: "/en/cookies", el: "/el/cookies", "x-default": "/en/cookies" },
  },
};

export default function CookiesPage() {
  return <LegalContent type="cookies" />;
}
