"use client";

import { useLanguage } from "@/lib/i18n";

export function LocalizedSkipLink({
  targetId = "main-content",
}: {
  targetId?: string;
}) {
  const { copy } = useLanguage();

  return (
    <a
      href={`#${targetId}`}
      className="skip-link"
    >
      {copy.skip}
    </a>
  );
}
