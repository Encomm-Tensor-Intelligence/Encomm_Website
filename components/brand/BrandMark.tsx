import { cn } from "@/lib/cn";

/**
 * BrandMark — the ENCOMM crystal mark as inline SVG.
 * Scales crisply; uses currentColor-independent fills so it reads on any bg.
 *
 * Uses the official raster logo on its own (sharp at small sizes) is also an
 * option — see /public/brand/ENCOMM_logo_email_160px.png — but for nav/footer
 * the vector version stays sharper at all DPRs.
 */
export function BrandMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 160 160"
      className={cn("block", className)}
      role="img"
      aria-label="ENCOMM"
    >
      <title>ENCOMM</title>
      <defs>
        <linearGradient id="bm-violet" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#A07BFF" />
          <stop offset="1" stopColor="#5E48D6" />
        </linearGradient>
        <linearGradient id="bm-lilac" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#E4CFFF" />
          <stop offset="1" stopColor="#B79BFF" />
        </linearGradient>
        <linearGradient id="bm-cyan" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0" stopColor="#66D7F5" />
          <stop offset="1" stopColor="#9BE7FB" />
        </linearGradient>
        <linearGradient id="bm-magenta" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#E7A8F5" />
          <stop offset="1" stopColor="#C088E8" />
        </linearGradient>
      </defs>
      <polygon points="80,12 134,42 134,118 80,148 26,118 26,42" fill="url(#bm-violet)" />
      <polygon points="80,12 134,42 80,72" fill="url(#bm-lilac)" />
      <polygon points="134,42 134,118 80,88" fill="#7C66E8" />
      <polygon points="134,118 80,148 80,88" fill="url(#bm-magenta)" opacity="0.92" />
      <polygon points="80,148 26,118 80,88" fill="#5E48D6" />
      <polygon points="26,118 26,42 80,72" fill="#6E54D6" />
      <polygon points="26,42 80,12 80,72" fill="url(#bm-cyan)" opacity="0.92" />
      <g opacity="0.95">
        <rect x="58" y="64" width="44" height="6" rx="3" fill="#FFFFFF" />
        <rect x="58" y="77" width="44" height="6" rx="3" fill="#F2ECFF" />
        <rect x="58" y="90" width="44" height="6" rx="3" fill="#FFFFFF" />
        <rect x="58" y="64" width="6" height="32" rx="3" fill="#FFFFFF" />
      </g>
    </svg>
  );
}
