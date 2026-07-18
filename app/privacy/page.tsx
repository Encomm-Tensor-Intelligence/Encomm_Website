import type { Metadata } from "next";
import Link from "next/link";
import { BrandMark } from "@/components/brand/BrandMark";
import { company } from "@/content/site-content";

export const metadata: Metadata = {
  title: "Privacy",
  description: `Privacy notice for ${company.name}.`,
  robots: { index: false, follow: true },
};

export default function PrivacyPage() {
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
        Privacy notice
      </h1>
      <div className="prose mt-8 max-w-none text-[15px] leading-relaxed text-ink-soft">
        {/* PLACEHOLDER — this content is a scaffold and must be reviewed and
            completed by ENCOMM with verified legal language before launch. */}
        <p className="rounded-2xl border border-line bg-surface-soft p-4 text-[13px] text-muted">
          <strong className="text-ink">Placeholder.</strong> This privacy notice
          is a structural placeholder. ENCOMM will replace this with the verified
          policy before public launch.
        </p>
        <p className="mt-6">
          {company.name} is committed to protecting the privacy of visitors and
          customers. This notice describes what information is collected, how it
          is used, and the choices available.
        </p>
        <h2 className="mt-8 font-display text-xl text-ink">Information we collect</h2>
        <p className="mt-2">
          To be completed: contact form submissions, analytics, and any data
          processed when operating ENCOMM systems on behalf of clients.
        </p>
        <h2 className="mt-8 font-display text-xl text-ink">How we use information</h2>
        <p className="mt-2">To be completed.</p>
        <h2 className="mt-8 font-display text-xl text-ink">Contact</h2>
        <p className="mt-2">
          Questions about this notice will be directed to a verified contact once
          configured.
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
