"use client";

import { useRef, type ReactNode } from "react";
import Link from "next/link";
import { useReducedMotion } from "@/lib/motion-safe";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "ghost";
type Size = "sm" | "md" | "lg";

type CommonProps = {
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  className?: string;
  /** Disable magnetic effect (e.g. inside other motion contexts) */
  magnetic?: boolean;
  /** strength 0..1 */
  strength?: number;
};

type ButtonAsLink = CommonProps & { href: string; onClick?: never };
type ButtonAsButton = CommonProps & {
  href?: undefined;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  ariaLabel?: string;
};

const base =
  "group relative inline-flex items-center justify-center gap-2 rounded-full font-display font-medium tracking-tight transition-all duration-300 will-change-transform select-none";

const variants: Record<Variant, string> = {
  primary:
    "text-white bg-ink hover:bg-ink-soft shadow-[0_8px_30px_-12px_rgba(16,20,38,0.5)]",
  secondary:
    "text-ink bg-surface border border-line hover:border-line-strong shadow-soft hover:shadow-lift",
  ghost: "text-ink hover:text-violet",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-4 text-[13px]",
  md: "h-11 px-5 text-sm",
  lg: "h-13 px-7 text-[15px] py-3.5",
};

/**
 * MagneticButton — desktop magnetic effect (translate within strength radius),
 * disabled on touch / reduced motion. Accessible: rendered as <a> or <button>.
 */
export function MagneticButton(props: ButtonAsLink | ButtonAsButton) {
  const {
    children,
    variant = "primary",
    size = "md",
    className,
    magnetic = true,
    strength = 0.35,
  } = props;

  const reduced = useReducedMotion();
  const wrapRef = useRef<HTMLSpanElement>(null);
  const innerRef = useRef<HTMLSpanElement>(null);

  const onMove = (e: React.MouseEvent) => {
    if (!magnetic || reduced) return;
    const wrap = wrapRef.current;
    const inner = innerRef.current;
    if (!wrap || !inner) return;
    const r = wrap.getBoundingClientRect();
    const x = e.clientX - (r.left + r.width / 2);
    const y = e.clientY - (r.top + r.height / 2);
    wrap.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
    inner.style.transform = `translate(${x * strength * 0.3}px, ${y * strength * 0.3}px)`;
  };
  const onLeave = () => {
    const wrap = wrapRef.current;
    const inner = innerRef.current;
    if (wrap) wrap.style.transform = "translate(0,0)";
    if (inner) inner.style.transform = "translate(0,0)";
  };

  const classes = cn(base, variants[variant], sizes[size], className);

  // Inner content receives counter-parallax (innerRef)
  const inner = (
    <span
      ref={innerRef}
      className="inline-flex items-center gap-2 transition-transform duration-300 ease-out"
    >
      {children}
    </span>
  );

  // Decorative spectral halo for primary
  const halo =
    variant === "primary" ? (
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -inset-0.5 rounded-full opacity-0 blur-md transition-opacity duration-300 group-hover:opacity-60"
        style={{
          background:
            "linear-gradient(100deg, var(--color-violet), var(--color-magenta), var(--color-cyan))",
        }}
      />
    ) : null;

  const sharedProps = {
    onMouseMove: onMove,
    onMouseLeave: onLeave,
  } as const;

  if ("href" in props && props.href) {
    const isExternal = props.href.startsWith("http");
    const linkProps = isExternal
      ? { target: "_blank", rel: "noreferrer" }
      : {};
    return (
      <span ref={wrapRef} className="magnetic relative inline-flex" {...sharedProps}>
        <Link href={props.href} className={classes} {...linkProps}>
          {halo}
          <span className="relative z-10">{inner}</span>
        </Link>
      </span>
    );
  }

  const { onClick, type = "button", disabled, ariaLabel } =
    props as ButtonAsButton;
  return (
    <span ref={wrapRef} className="magnetic relative inline-flex" {...sharedProps}>
      <button
        type={type}
        onClick={onClick}
        disabled={disabled}
        aria-label={ariaLabel}
        className={cn(classes, disabled && "opacity-50 cursor-not-allowed")}
      >
        {halo}
        <span className="relative z-10">{inner}</span>
      </button>
    </span>
  );
}
