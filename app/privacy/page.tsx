import type { Metadata } from "next";
import { LegalContent } from "@/components/legal/LegalContent";

export const metadata: Metadata = {
  title: "Privacy Notice — ENCOMM",
  description: "How ENCOMM processes personal data when you visit encomm.ai or contact the company.",
  alternates: {
    canonical: "/en/privacy",
    languages: { en: "/en/privacy", el: "/el/privacy", "x-default": "/en/privacy" },
  },
};

export default function PrivacyPage() {
  return <LegalContent type="privacy" />;
}
