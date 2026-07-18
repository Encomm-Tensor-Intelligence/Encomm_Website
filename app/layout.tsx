import type { Metadata, Viewport } from "next";
import { spaceGrotesk, inter } from "@/lib/fonts";
import { company } from "@/content/site-content";
import { MotionProvider } from "@/components/motion/MotionProvider";
import GlobalField from "@/components/webgl/GlobalField";
import CustomCursor from "@/components/ui/CustomCursor";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(company.url),
  title: {
    default: `${company.name} — ${company.descriptor}`,
    template: `%s · ${company.name}`,
  },
  description: company.description,
  applicationName: company.name,
  keywords: [
    "Enterprise AI",
    "AI assistant",
    "Conversational AI",
    "AI agents",
    "Knowledge-grounded AI",
    "Postmatrix",
    "Custom AI systems",
    "Greece AI",
    "ENCOMM",
  ],
  authors: [{ name: company.name }],
  creator: company.name,
  publisher: company.name,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: company.url,
    siteName: company.name,
    title: `${company.name} — ${company.descriptor}`,
    description: company.description,
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: `${company.name} — ${company.descriptor}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${company.name} — ${company.descriptor}`,
    description: company.description,
    images: ["/og-image.png"],
  },
  icons: {
    icon: [
      { url: "/icons/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/icons/favicon-16.png", sizes: "16x16", type: "image/png" },
    ],
    shortcut: ["/favicon.ico"],
    apple: [{ url: "/icons/apple-touch-icon.png", sizes: "180x180" }],
  },
  manifest: "/site.webmanifest",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  category: "technology",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F7F8FC" },
    { media: "(prefers-color-scheme: dark)", color: "#F7F8FC" },
  ],
  width: "device-width",
  initialScale: 1,
};

const orgJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: company.name,
  description: company.description,
  url: company.url,
  slogan: company.tagline,
  foundingLocation: {
    "@type": "Place",
    address: { "@type": "PostalAddress", addressCountry: "GR" },
  },
  areaServed: "Global",
  knowsAbout: [
    "Conversational AI",
    "AI assistants",
    "AI agents",
    "Integrations",
    "Automation",
    "Custom AI applications",
  ],
  logo: `${company.url}/brand/encomm-lockup.svg`,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${inter.variable}`}
      suppressHydrationWarning
    >
      <body className="antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-ink focus:px-4 focus:py-2 focus:font-display focus:text-sm focus:text-white"
        >
          Skip to content
        </a>
        <MotionProvider>
          <GlobalField />
          <CustomCursor />
          <div className="relative z-10">{children}</div>
        </MotionProvider>
      </body>
    </html>
  );
}
