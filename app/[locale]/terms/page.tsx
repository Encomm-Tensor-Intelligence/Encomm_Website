import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LegalContent } from "@/components/legal/LegalContent";

type PageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  if (locale !== "en" && locale !== "el") return {};
  const greek = locale === "el";
  return {
    title: greek ? "Όροι Χρήσης — ENCOMM" : "Terms of Use — ENCOMM",
    description: greek
      ? "Οι όροι πρόσβασης και χρήσης της εταιρικής ιστοσελίδας ENCOMM."
      : "Terms governing access to and use of the ENCOMM corporate website.",
    alternates: {
      canonical: `/${locale}/terms`,
      languages: { en: "/en/terms", el: "/el/terms", "x-default": "/en/terms" },
    },
    other: { "content-language": locale },
  };
}

export default async function LocalizedTerms({ params }: PageProps) {
  const { locale } = await params;
  if (locale !== "en" && locale !== "el") notFound();
  return <LegalContent type="terms" />;
}
