import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MarketingPage } from "@/components/marketing/MarketingPage";
import {
  marketingPages,
  serviceSlugs,
  type ServiceSlug,
} from "@/content/marketing-pages";

type PageProps = { params: Promise<{ slug: string }> };

function isServiceSlug(slug: string): slug is ServiceSlug {
  return serviceSlugs.includes(slug as ServiceSlug);
}

export function generateStaticParams() {
  return serviceSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  if (!isServiceSlug(slug)) return {};
  const service = marketingPages.en.services[slug];

  return {
    title: `${service.eyebrow} — ENCOMM`,
    description: service.summary,
    alternates: {
      canonical: `/en/services/${slug}`,
      languages: {
        en: `/en/services/${slug}`,
        el: `/el/services/${slug}`,
        "x-default": `/en/services/${slug}`,
      },
    },
  };
}

export default async function ServicePage({ params }: PageProps) {
  const { slug } = await params;
  if (!isServiceSlug(slug)) notFound();

  return <MarketingPage type="service" slug={slug} />;
}
