import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LegalContent } from "@/components/legal/LegalContent";

type PageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  if (locale !== "en" && locale !== "el") return {};
  const greek = locale === "el";
  return {
    title: greek ? "Πολιτική Απορρήτου — ENCOMM" : "Privacy Notice — ENCOMM",
    description: greek
      ? "Πώς η ENCOMM επεξεργάζεται προσωπικά δεδομένα μέσω της εταιρικής ιστοσελίδας."
      : "How ENCOMM processes personal data through its corporate website.",
    alternates: {
      canonical: `/${locale}/privacy`,
      languages: { en: "/en/privacy", el: "/el/privacy", "x-default": "/en/privacy" },
    },
    other: { "content-language": locale },
  };
}

export default async function LocalizedPrivacy({ params }: PageProps) {
  const { locale } = await params;
  if (locale !== "en" && locale !== "el") notFound();
  return <LegalContent type="privacy" />;
}
