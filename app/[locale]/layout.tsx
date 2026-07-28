import { notFound } from "next/navigation";
import { LanguageProvider } from "@/lib/i18n";
import type { Language } from "@/content/site-content";

const locales = ["en", "el"] as const;

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!locales.includes(locale as Language)) notFound();

  return (
    <LanguageProvider
      initialLanguage={locale as Language}
      followStoredPreference={false}
    >
      {children}
    </LanguageProvider>
  );
}
