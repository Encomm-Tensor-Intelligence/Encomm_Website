"use client";

import { usePathname, useRouter } from "next/navigation";
import { useLanguage } from "@/lib/i18n";

export function LanguageToggle({ className }: { className?: string }) {
  const { language, setLanguage, copy } = useLanguage();
  const pathname = usePathname();
  const router = useRouter();

  const switchLanguage = (code: "en" | "el") => {
    if (code === language) return;
    const localizedPath = /^\/(en|el)(?:\/|$)/.test(pathname)
      ? pathname.replace(/^\/(en|el)(?=\/|$)/, `/${code}`)
      : pathname === "/"
        ? `/${code}`
        : `/${code}${pathname}`;
    const hash = window.location.hash;

    setLanguage(code);
    router.push(`${localizedPath}${hash}`);
  };

  return (
    <div
      className={`language-toggle${className ? ` ${className}` : ""}`}
      role="group"
      aria-label={copy.language.label}
    >
      {(["en", "el"] as const).map((code) => {
        const active = language === code;
        return (
          <button
            key={code}
            type="button"
            onClick={() => switchLanguage(code)}
            aria-pressed={active}
            aria-label={
              code === "en" ? copy.language.english : copy.language.greek
            }
            className={`language-option${active ? " is-active" : ""}`}
          >
            {code === "en" ? "EN" : "EL"}
          </button>
        );
      })}
    </div>
  );
}
