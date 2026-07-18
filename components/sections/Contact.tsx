"use client";

import { useMemo, useState } from "react";
import { finalCta, projectTypeOptions } from "@/content/site-content";
import type { ContactFormData } from "@/content/site-content";
import {
  validateAll,
  validateField,
  hasErrors,
  type FieldErrors,
} from "@/lib/contact-validation";
import { submitContact, isDemoMode } from "@/lib/contact-config";
import { Field, fieldStyles, fieldErrorStyles } from "@/components/ui/FormField";
import { Reveal, LineMask } from "@/components/motion/Reveal";
import { Eyebrow } from "@/components/ui/Primitives";
import { cn } from "@/lib/cn";

const EMPTY: ContactFormData = {
  name: "",
  email: "",
  company: "",
  projectType: "",
  message: "",
  consent: false,
};

const FIELD_ORDER: (keyof ContactFormData)[] = [
  "name",
  "email",
  "company",
  "projectType",
  "message",
  "consent",
];

export function Contact() {
  const [data, setData] = useState<ContactFormData>(EMPTY);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [touched, setTouched] = useState<
    Partial<Record<keyof ContactFormData, boolean>>
  >({});
  const [status, setStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");
  const [feedback, setFeedback] = useState<string>("");
  const [demo, setDemo] = useState(false);

  function set<K extends keyof ContactFormData>(key: K, value: ContactFormData[K]) {
    setData((d) => ({ ...d, [key]: value }));
    if (touched[key]) {
      const err = validateField(key, value);
      setErrors((e) => ({ ...e, [key]: err ?? undefined }));
    }
  }
  function blur(key: keyof ContactFormData) {
    setTouched((t) => ({ ...t, [key]: true }));
    const err = validateField(key, data[key]);
    setErrors((e) => ({ ...e, [key]: err ?? undefined }));
  }

  // completion progress 0..1
  const progress = useMemo(() => {
    let done = 0;
    FIELD_ORDER.forEach((k) => {
      const v = data[k];
      if (k === "consent" ? v : String(v).trim().length > 0) done++;
    });
    return done / FIELD_ORDER.length;
  }, [data]);

  const allValid = useMemo(() => !hasErrors(validateAll(data)), [data]);
  const systemReady = progress === 1 && allValid;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const allErrors = validateAll(data);
    setErrors(allErrors);
    setTouched(Object.fromEntries(FIELD_ORDER.map((k) => [k, true])));
    if (hasErrors(allErrors)) {
      const first = Object.keys(allErrors)[0];
      if (first) document.getElementById(`contact-${first}`)?.focus();
      return;
    }
    setStatus("submitting");
    const result = await submitContact(data);
    if (result.ok) {
      setStatus("success");
      setFeedback(result.message);
      setDemo(result.demo);
      setData(EMPTY);
      setTouched({});
    } else {
      setStatus("error");
      setFeedback(result.message);
    }
  }

  return (
    <section
      id="contact"
      className="section-anchor relative overflow-hidden py-24 md:py-36"
    >
      <div className="spectral-wash pointer-events-none absolute inset-0 opacity-70" />
      <div className="grid-bg pointer-events-none absolute inset-0 opacity-30" />

      {/* oversized background headline */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-12 select-none text-center"
      >
        <h2 className="kinetic text-[clamp(2.6rem,9vw,9rem)] leading-none text-ink/[0.06]">
          WHAT SHOULD AI DO
          <br />
          FOR YOUR ORGANIZATION?
        </h2>
      </div>

      <div className="relative mx-auto max-w-[1400px] px-4 md:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
          {/* left — invitation */}
          <div className="relative">
            <Reveal variant="fade-up">
              <Eyebrow index="C—02">Contact</Eyebrow>
            </Reveal>
            <h2 className="kinetic mt-5 text-[clamp(2rem,5vw,3.6rem)] text-ink">
              <LineMask>What should AI do</LineMask>
              <LineMask>
                <span className="text-spectral">for your organization?</span>
              </LineMask>
            </h2>
            <Reveal variant="fade-up" delay={0.1}>
              <p className="mt-6 max-w-md text-[16px] leading-relaxed text-muted">
                {finalCta.copy}
              </p>
            </Reveal>

            {/* system status panel */}
            <Reveal variant="fade-up" delay={0.18}>
              <div className="mt-8 rounded-2xl border border-line glass p-4">
                <div className="mb-2 flex items-center justify-between">
                  <span className="eyebrow">System readiness</span>
                  <span
                    className={cn(
                      "font-mono text-[11px]",
                      systemReady ? "text-violet" : "text-faint",
                    )}
                  >
                    {systemReady ? "● READY" : "○ CONFIGURING"}
                  </span>
                </div>
                {/* progress bar */}
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-line">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-violet to-cyan transition-all duration-500"
                    style={{ width: `${progress * 100}%` }}
                  />
                </div>
                <div className="mt-2 flex justify-between font-mono text-[9px] text-faint">
                  <span>{Math.round(progress * 100)}% complete</span>
                  <span>{Object.keys(errors).length} issues</span>
                </div>
              </div>
            </Reveal>

            {isDemoMode ? (
              <Reveal variant="fade-up" delay={0.24}>
                <div className="mt-4 rounded-lg border border-line bg-white/60 px-3 py-2 text-[11.5px] text-muted">
                  <strong className="text-ink">Demo mode.</strong> No contact
                  endpoint configured — submissions validate locally but are
                  not sent. Set{" "}
                  <code className="rounded bg-surface-soft px-1 font-mono text-[10.5px]">
                    NEXT_PUBLIC_CONTACT_ENDPOINT
                  </code>{" "}
                  to enable.
                </div>
              </Reveal>
            ) : null}
          </div>

          {/* right — form */}
          <Reveal variant="scale-in" delay={0.1}>
            <form
              noValidate
              onSubmit={onSubmit}
              aria-label="Contact ENCOMM"
              className="relative overflow-hidden rounded-[28px] border border-line glass-strong p-6 shadow-lift md:p-8"
            >
              {/* corner technical marks */}
              <div className="coord pointer-events-none absolute right-4 top-4 text-right">
                <div>FORM · v1.0</div>
                <div>STATE · {status.toUpperCase()}</div>
              </div>

              <div className="mb-6 flex items-center gap-2">
                <span className="status-dot" />
                <span className="eyebrow">Command interface</span>
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <Field
                  label="Name"
                  required
                  error={touched.name ? errors.name : undefined}
                >
                  {({ id: _id, describedBy, invalid, required }) => (
                    <input
                      id="contact-name"
                      name="name"
                      autoComplete="name"
                      className={cn(fieldStyles, invalid && fieldErrorStyles)}
                      value={data.name}
                      onChange={(e) => set("name", e.target.value)}
                      onBlur={() => blur("name")}
                      aria-invalid={invalid}
                      aria-describedby={describedBy}
                      required={required}
                      placeholder="Your name"
                    />
                  )}
                </Field>

                <Field
                  label="Work email"
                  required
                  error={touched.email ? errors.email : undefined}
                >
                  {({ invalid }) => (
                    <input
                      id="contact-email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      className={cn(fieldStyles, invalid && fieldErrorStyles)}
                      value={data.email}
                      onChange={(e) => set("email", e.target.value)}
                      onBlur={() => blur("email")}
                      aria-invalid={invalid}
                      required
                      placeholder="you@company.com"
                    />
                  )}
                </Field>

                <Field
                  label="Company"
                  required
                  error={touched.company ? errors.company : undefined}
                >
                  {({ invalid }) => (
                    <input
                      id="contact-company"
                      name="company"
                      autoComplete="organization"
                      className={cn(fieldStyles, invalid && fieldErrorStyles)}
                      value={data.company}
                      onChange={(e) => set("company", e.target.value)}
                      onBlur={() => blur("company")}
                      aria-invalid={invalid}
                      required
                      placeholder="Organization"
                    />
                  )}
                </Field>

                <Field
                  label="Project type"
                  required
                  error={touched.projectType ? errors.projectType : undefined}
                >
                  {({ invalid }) => (
                    <select
                      id="contact-projectType"
                      name="projectType"
                      className={cn(fieldStyles, invalid && fieldErrorStyles)}
                      value={data.projectType}
                      onChange={(e) => set("projectType", e.target.value)}
                      onBlur={() => blur("projectType")}
                      aria-invalid={invalid}
                      required
                    >
                      <option value="">Select the closest match…</option>
                      {projectTypeOptions.map((p) => (
                        <option key={p} value={p}>
                          {p}
                        </option>
                      ))}
                    </select>
                  )}
                </Field>
              </div>

              <div className="mt-5">
                <Field
                  label="What should AI do for you?"
                  required
                  error={touched.message ? errors.message : undefined}
                  hint="The problem, the systems involved, the outcome you're after."
                >
                  {({ invalid }) => (
                    <textarea
                      id="contact-message"
                      name="message"
                      rows={5}
                      className={cn(
                        fieldStyles,
                        "resize-y",
                        invalid && fieldErrorStyles,
                      )}
                      value={data.message}
                      onChange={(e) => set("message", e.target.value)}
                      onBlur={() => blur("message")}
                      aria-invalid={invalid}
                      required
                      placeholder="We'd like to …"
                    />
                  )}
                </Field>
              </div>

              <div className="mt-5">
                <label className="flex cursor-pointer items-start gap-3 text-[13px] text-muted">
                  <input
                    type="checkbox"
                    className="mt-0.5 h-4 w-4 shrink-0 accent-violet"
                    checked={data.consent}
                    onChange={(e) => set("consent", e.target.checked)}
                    onBlur={() => blur("consent")}
                    aria-invalid={Boolean(touched.consent && errors.consent)}
                  />
                  <span>
                    I agree to be contacted about my enquiry and to ENCOMM's
                    privacy practices.{" "}
                    <a
                      href="/privacy"
                      className="text-violet underline-offset-2 hover:underline"
                    >
                      Privacy notice
                    </a>
                    .
                  </span>
                </label>
                {touched.consent && errors.consent ? (
                  <p role="alert" className="mt-1.5 text-[12px] text-[#c0392b]">
                    {errors.consent}
                  </p>
                ) : null}
              </div>

              <div className="mt-7 flex flex-wrap items-center gap-4">
                <button
                  type="submit"
                  disabled={status === "submitting"}
                  data-cursor="OPEN"
                  className={cn(
                    "group relative inline-flex h-13 items-center justify-center gap-2 overflow-hidden rounded-full px-7 py-3.5 font-display text-[15px] font-medium text-white transition-all duration-300",
                    systemReady
                      ? "bg-gradient-to-r from-violet to-violet-deep shadow-glow"
                      : "bg-ink hover:bg-ink-soft shadow-[0_8px_30px_-12px_rgba(16,20,38,0.5)]",
                    status === "submitting" && "cursor-wait opacity-70",
                  )}
                >
                  {/* shimmer */}
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 group-hover:translate-x-full"
                  />
                  <span className="relative z-10">
                    {status === "submitting"
                      ? "Transmitting…"
                      : systemReady
                        ? "System ready — start conversation"
                        : finalCta.cta}
                  </span>
                </button>

                {status === "success" ? (
                  <p
                    role="status"
                    className="flex items-center gap-2 text-[13px] text-violet-deep"
                  >
                    <span aria-hidden="true">✓</span>
                    {feedback}
                    {demo ? (
                      <span className="ml-1 rounded bg-surface-soft px-1.5 py-0.5 font-mono text-[10.5px] uppercase tracking-wider text-faint">
                        demo
                      </span>
                    ) : null}
                  </p>
                ) : null}
                {status === "error" ? (
                  <p role="alert" className="text-[13px] text-[#c0392b]">
                    {feedback}
                  </p>
                ) : null}
              </div>
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
