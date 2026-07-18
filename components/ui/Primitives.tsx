import { type ReactNode } from "react";
import { cn } from "@/lib/cn";

/** Small mono eyebrow label with a leading index. */
export function Eyebrow({
  index,
  children,
  className,
}: {
  index?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("eyebrow flex items-center gap-3", className)}>
      {index ? (
        <span className="text-violet" aria-hidden="true">
          {index}
        </span>
      ) : (
        <span
          className="block h-px w-6 bg-line-strong"
          aria-hidden="true"
        />
      )}
      <span>{children}</span>
    </div>
  );
}

/** Section heading wrapper with consistent rhythm. */
export function SectionHeading({
  eyebrow,
  eyebrowIndex,
  title,
  intro,
  align = "left",
  className,
}: {
  eyebrow?: string;
  eyebrowIndex?: string;
  title: ReactNode;
  intro?: ReactNode;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-5",
        align === "center" && "items-center text-center",
        className,
      )}
    >
      {eyebrow ? (
        <Eyebrow index={eyebrowIndex}>{eyebrow}</Eyebrow>
      ) : null}
      <h2 className="display-1 text-[clamp(2rem,5vw,3.6rem)] text-ink max-w-3xl">
        {title}
      </h2>
      {intro ? (
        <p className="text-muted text-base md:text-lg max-w-2xl leading-relaxed">
          {intro}
        </p>
      ) : null}
    </div>
  );
}

/** A fine line with a spectral gradient. */
export function SpectralLine({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn("h-px w-full data-line opacity-60", className)}
    />
  );
}
