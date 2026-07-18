import type { Metadata } from "next";
import Link from "next/link";
import { BrandMark } from "@/components/brand/BrandMark";
import { company } from "@/content/site-content";

export const metadata: Metadata = {
  title: "Terms",
  description: `Terms of service for ${company.name}.`,
  robots: { index: false, follow: true },
};

export default function TermsPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 pb-24 pt-32 md:pt-40">
      <Link
        href="/"
        className="mb-10 inline-flex items-center gap-2.5"
        aria-label="Back to home"
      >
        <BrandMark className="h-7 w-7" />
        <span className="font-display text-[15px] font-semibold tracking-[0.18em]">
          ENCOMM
        </span>
      </Link>
      <p className="eyebrow mb-4">Legal</p>
      <h1 className="display-1 text-[clamp(2rem,5vw,3rem)] text-ink">
        Terms of service
      </h1>
      <div className="prose mt-8 max-w-none text-[15px] leading-relaxed text-ink-soft">
        {/* PLACEHOLDER — scaffold only; replace with verified terms before launch. */}
        <p className="rounded-2xl border border-line bg-surface-soft p-4 text-[13px] text-muted">
          <strong className="text-ink">Placeholder.</strong> These terms are a
          structural placeholder. {company.name} will publish the verified terms
          before public launch.
        </p>
        <p className="mt-6">
          By accessing this website you agree to the terms set out in the final,
          verified version of this document.
        </p>
      </div>
      <Link
        href="/"
        className="mt-10 inline-flex items-center gap-2 text-[13px] text-violet hover:underline"
      >
        ← Back to home
      </Link>
    </main>
  );
}
