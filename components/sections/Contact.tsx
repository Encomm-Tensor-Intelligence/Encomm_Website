"use client";

import { useState } from "react";
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

export function Contact() {
  const [data, setData] = useState<ContactFormData>(EMPTY);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [touched, setTouched] = useState<Partial<Record<keyof ContactFormData, boolean>>>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
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

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const allErrors = validateAll(data);
    setErrors(allErrors);
    setTouched({
      name: true,
      email: true,
      company: true,
      projectType: true,
      message: true,
      consent: true,
    });
    if (hasErrors(allErrors)) {
      // focus first invalid
      const first = Object.keys(allErrors)[0];
      if (first) {
        const el = document.getElementById(`contact-${first}`);
        el?.focus();
      }
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
      className="section-anchor relative overflow-hidden bg-surface-soft py-24 md:py-32"
    >
      <div className="spectral-wash pointer-events-none absolute inset-0 opacity-70" aria-hidden="true" />
      <div className="grid-bg pointer-events-none absolute inset-0 opacity-30" aria-hidden="true" />

      <div className="relative mx-auto max-w-[1320px] px-4 md:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
          {/* left — invitation */}
          <div>
            <Reveal variant="fade-up">
              <Eyebrow index="C—02">Contact</Eyebrow>
            </Reveal>
            <h2 className="display-1 mt-5 text-[clamp(2rem,4.6vw,3.4rem)] text-ink">
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
            <Reveal variant="fade-up" delay={0.18}>
              <div className="mt-8 flex flex-col gap-2 text-[13px] text-faint">
                <div className="flex items-center gap-2">
                  <span className="status-dot !h-1.5 !w-1.5" />
                  We'll get back to you within two business days.
                </div>
                {isDemoMode ? (
                  <div className="rounded-lg border border-line bg-surface px-3 py-2 text-[11.5px] text-muted">
                    Demo mode: no contact endpoint is configured. Submissions are
                    validated but not delivered. Set{" "}
                    <code className="rounded bg-surface-soft px-1 py-0.5 font-mono text-[10.5px]">
                      NEXT_PUBLIC_CONTACT_ENDPOINT
                    </code>{" "}
                    to enable.
                  </div>
                ) : null}
              </div>
            </Reveal>
          </div>

          {/* right — form */}
          <Reveal variant="scale-in" delay={0.1}>
            <form
              noValidate
              onSubmit={onSubmit}
              aria-label="Contact ENCOMM"
              className="rounded-[28px] border border-line bg-surface p-6 shadow-lift md:p-8"
            >
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
                  hint="Tell us about the problem, the systems involved, and the outcome you're after."
                >
                  {({ invalid }) => (
                    <textarea
                      id="contact-message"
                      name="message"
                      rows={5}
                      className={cn(fieldStyles, "resize-y", invalid && fieldErrorStyles)}
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
                    {/* PLACEHOLDER — link to verified privacy policy */}
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
                  className={cn(
                    "group relative inline-flex h-13 items-center justify-center gap-2 rounded-full px-7 py-3.5 font-display text-[15px] font-medium text-white transition-all duration-300",
                    "bg-ink hover:bg-ink-soft shadow-[0_8px_30px_-12px_rgba(16,20,38,0.5)]",
                    status === "submitting" && "opacity-70 cursor-wait",
                  )}
                >
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute -inset-0.5 rounded-full opacity-0 blur-md transition-opacity duration-300 group-hover:opacity-60"
                    style={{
                      background:
                        "linear-gradient(100deg, var(--color-violet), var(--color-magenta), var(--color-cyan))",
                    }}
                  />
                  <span className="relative z-10">
                    {status === "submitting" ? "Sending…" : finalCta.cta}
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
                      <span className="ml-1 rounded bg-surface-soft px-1.5 py-0.5 text-[10.5px] uppercase tracking-wider text-faint">
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
