import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Home from "@/app/page";

type PageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  if (locale !== "en" && locale !== "el") return {};
  const greek = locale === "el";

  return {
    title: greek ? "ENCOMM — AI με πρόθεση" : "ENCOMM — AI With Intent",
    description: greek
      ? "Η ENCOMM σχεδιάζει πρακτικά συστήματα AI, πράκτορες, αυτοματισμούς, διασυνδέσεις και εξατομικευμένα προϊόντα με έδρα τη Θεσσαλονίκη."
      : "ENCOMM designs practical AI systems, agents, automation, integrations and custom products from Thessaloniki, Greece.",
    alternates: {
      canonical: `/${locale}`,
      languages: { en: "/en", el: "/el", "x-default": "/en" },
    },
    openGraph: {
      title: greek ? "ENCOMM — AI με πρόθεση" : "ENCOMM — AI With Intent",
      description: greek
        ? "Πρακτική επιχειρησιακή νοημοσύνη, σχεδιασμένη στη Θεσσαλονίκη."
        : "Practical enterprise intelligence, engineered in Thessaloniki.",
      url: `/${locale}`,
      locale: greek ? "el_GR" : "en_US",
      alternateLocale: greek ? ["en_US"] : ["el_GR"],
      type: "website",
      images: [{ url: "/og.png", width: 1536, height: 1024, alt: "ENCOMM — AI With Intent" }],
    },
    other: { "content-language": locale },
  };
}

export default async function LocalizedHome({ params }: PageProps) {
  const { locale } = await params;
  if (locale !== "en" && locale !== "el") notFound();
  return <Home />;
}
