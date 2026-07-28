import type { Metadata } from "next";
import { MarketingPage } from "@/components/marketing/MarketingPage";

export const metadata: Metadata = {
  title: "About ENCOMM — Enterprise AI from Thessaloniki",
  description:
    "Meet ENCOMM, its founding team, technology philosophy, Elevate Greece profile and approach to practical AI systems.",
  alternates: {
    canonical: "/en/about",
    languages: { en: "/en/about", el: "/el/about", "x-default": "/en/about" },
  },
};

export default function AboutPage() {
  return <MarketingPage type="about" />;
}
