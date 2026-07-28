import type { Metadata } from "next";
import { LegalContent } from "@/components/legal/LegalContent";

export const metadata: Metadata = {
  title: "Terms of Use — ENCOMM",
  description: "Terms governing access to and use of the ENCOMM corporate website.",
  alternates: {
    canonical: "/en/terms",
    languages: { en: "/en/terms", el: "/el/terms", "x-default": "/en/terms" },
  },
};

export default function TermsPage() {
  return <LegalContent type="terms" />;
}
