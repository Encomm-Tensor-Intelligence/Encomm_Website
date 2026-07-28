import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MarketingPage } from "@/components/marketing/MarketingPage";
import {
  marketingPages,
  serviceSlugs,
  type ServiceSlug,
} from "@/content/marketing-pages";

type PageProps = { params: Promise<{ locale: string; slug: string }> };

function isServiceSlug(slug: string): slug is ServiceSlug {
  return serviceSlugs.includes(slug as ServiceSlug);
}

export function generateStaticParams() {
  return (["en", "el"] as const).flatMap((locale) =>
    serviceSlugs.map((slug) => ({ locale, slug })),
  );
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  if ((locale !== "en" && locale !== "el") || !isServiceSlug(slug)) return {};
  const service = marketingPages[locale].services[slug];

  return {
    title: `${service.eyebrow} — ENCOMM`,
    description: service.summary,
    alternates: {
      canonical: `/${locale}/services/${slug}`,
      languages: {
        en: `/en/services/${slug}`,
        el: `/el/services/${slug}`,
        "x-default": `/en/services/${slug}`,
      },
    },
    openGraph: {
      title: `${service.eyebrow} — ENCOMM`,
      description: service.summary,
      url: `/${locale}/services/${slug}`,
      locale: locale === "el" ? "el_GR" : "en_US",
      alternateLocale: locale === "el" ? ["en_US"] : ["el_GR"],
      type: "website",
    },
    other: { "content-language": locale },
  };
}

export default async function LocalizedService({ params }: PageProps) {
  const { locale, slug } = await params;
  if ((locale !== "en" && locale !== "el") || !isServiceSlug(slug)) notFound();
  return <MarketingPage type="service" slug={slug} />;
}
