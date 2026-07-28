import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { inter, spaceGrotesk } from "@/lib/fonts";
import { LanguageProvider } from "@/lib/i18n";
import { company } from "@/content/company";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.encomm.ai"),
  title: "ENCOMM — AI With Intent",
  description:
    "ENCOMM designs intelligent systems that understand your business, move work forward and create lasting advantage.",
  alternates: {
    canonical: "/en",
    languages: {
      en: "/en",
      el: "/el",
      "x-default": "/en",
    },
  },
  icons: {
    icon: "/favicon.webp",
    shortcut: "/favicon.webp",
  },
  openGraph: {
    title: "ENCOMM — AI With Intent.",
    description: "Enterprise intelligence, engineered.",
    type: "website",
    url: "/en",
    images: [
      {
        url: "/og.png",
        width: 1536,
        height: 1024,
        alt: "ENCOMM — AI With Intent.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ENCOMM — AI With Intent.",
    description: "Enterprise intelligence, engineered.",
    images: ["/og.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#f7f6f2",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: company.brand,
    legalName: company.legalNameEl,
    alternateName: company.tradingName,
    url: company.website,
    logo: "https://www.encomm.ai/encomm-logo-opt.webp",
    email: company.email,
    taxID: company.vat,
    vatID: `EL${company.vat}`,
    identifier: {
      "@type": "PropertyValue",
      name: "G.E.MI.",
      value: company.gemi,
      url: company.gemiProfile,
    },
    description:
      "Greek AI software company building practical AI systems, agents, automation, integrations and custom products.",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Εθνικής Αντιστάσεως 18",
      addressLocality: "Thessaloniki",
      postalCode: "55133",
      addressCountry: "GR",
    },
    sameAs: [
      "https://github.com/Encomm-Tensor-Intelligence",
      company.elevateProfile,
      company.gemiProfile,
    ],
  };

  return (
    <html
      lang="en"
      className={`${inter.variable} ${spaceGrotesk.variable}`}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <body>
        <Script
          id="encomm-document-language"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html:
              "var m=location.pathname.match(/^\\/(en|el)(?:\\/|$)/);if(m)document.documentElement.lang=m[1];",
          }}
        />
        <Script
          id="encomm-organization-schema"
          type="application/ld+json"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema).replace(/</g, "\\u003c"),
          }}
        />
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
