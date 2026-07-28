import type { MetadataRoute } from "next";
import { company } from "@/content/site-content";
import { serviceSlugs } from "@/content/marketing-pages";

const languages = ["en", "el"] as const;

function languageAlternates(path = "") {
  return {
    en: `${company.url}/en${path}`,
    el: `${company.url}/el${path}`,
  };
}

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const pages: MetadataRoute.Sitemap = [
    {
      url: company.url,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];

  for (const language of languages) {
    pages.push(
      {
        url: `${company.url}/${language}`,
        lastModified: now,
        changeFrequency: "monthly",
        priority: 1,
        alternates: { languages: languageAlternates() },
      },
      {
        url: `${company.url}/${language}/about`,
        lastModified: now,
        changeFrequency: "monthly",
        priority: 0.8,
        alternates: { languages: languageAlternates("/about") },
      },
      {
        url: `${company.url}/${language}/privacy`,
        lastModified: now,
        changeFrequency: "yearly",
        priority: 0.3,
        alternates: { languages: languageAlternates("/privacy") },
      },
      {
        url: `${company.url}/${language}/terms`,
        lastModified: now,
        changeFrequency: "yearly",
        priority: 0.3,
        alternates: { languages: languageAlternates("/terms") },
      },
      {
        url: `${company.url}/${language}/cookies`,
        lastModified: now,
        changeFrequency: "yearly",
        priority: 0.3,
        alternates: { languages: languageAlternates("/cookies") },
      },
    );

    for (const slug of serviceSlugs) {
      pages.push({
        url: `${company.url}/${language}/services/${slug}`,
        lastModified: now,
        changeFrequency: "monthly",
        priority: 0.75,
        alternates: {
          languages: languageAlternates(`/services/${slug}`),
        },
      });
    }
  }

  return pages;
}
