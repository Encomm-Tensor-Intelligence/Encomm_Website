import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LegalContent } from "@/components/legal/LegalContent";

type PageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  if (locale !== "en" && locale !== "el") return {};
  const greek = locale === "el";
  return {
    title: greek ? "Πολιτική Cookies — ENCOMM" : "Cookie Policy — ENCOMM",
    description: greek
      ? "Τα cookies και οι παρόμοιες τεχνολογίες που χρησιμοποιεί η ιστοσελίδα της ENCOMM."
      : "Cookies and similar technologies used by the ENCOMM website.",
    alternates: {
      canonical: `/${locale}/cookies`,
      languages: { en: "/en/cookies", el: "/el/cookies", "x-default": "/en/cookies" },
    },
    other: { "content-language": locale },
  };
}

export default async function LocalizedCookies({ params }: PageProps) {
  const { locale } = await params;
  if (locale !== "en" && locale !== "el") notFound();
  return <LegalContent type="cookies" />;
}
