import type { MetadataRoute } from "next";
import { company } from "@/content/site-content";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: company.url,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
