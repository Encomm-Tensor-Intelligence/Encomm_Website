import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MarketingPage } from "@/components/marketing/MarketingPage";

type PageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  if (locale !== "en" && locale !== "el") return {};
  const greek = locale === "el";

  return {
    title: greek ? "Η ENCOMM — Επιχειρησιακό AI από τη Θεσσαλονίκη" : "About ENCOMM — Enterprise AI from Thessaloniki",
    description: greek
      ? "Γνωρίστε την ENCOMM, την ιδρυτική ομάδα, την τεχνολογική φιλοσοφία και την επίσημη καταχώριση στο Elevate Greece."
      : "Meet ENCOMM, its founding team, technology philosophy and official Elevate Greece profile.",
    alternates: {
      canonical: `/${locale}/about`,
      languages: { en: "/en/about", el: "/el/about", "x-default": "/en/about" },
    },
    openGraph: {
      title: greek ? "Η ENCOMM — Επιχειρησιακό AI από τη Θεσσαλονίκη" : "About ENCOMM",
      description: greek
        ? "Πρακτικά συστήματα AI για πραγματικές λειτουργικές ροές."
        : "Practical AI systems for real operational workflows.",
      url: `/${locale}/about`,
      locale: greek ? "el_GR" : "en_US",
      alternateLocale: greek ? ["en_US"] : ["el_GR"],
      type: "website",
    },
    other: { "content-language": locale },
  };
}

export default async function LocalizedAbout({ params }: PageProps) {
  const { locale } = await params;
  if (locale !== "en" && locale !== "el") notFound();
  return <MarketingPage type="about" />;
}
