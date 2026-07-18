/**
 * Contact submission layer.
 *
 * Single documented source for how the contact form behaves.
 *
 * Resolution order for the submission endpoint:
 *   1. process.env.NEXT_PUBLIC_CONTACT_ENDPOINT  (set at build/runtime)
 *   2. process.env.CONTACT_ENDPOINT               (server-only fallback)
 *   3. content.contact.endpoint                   (last-resort default)
 *
 * When no endpoint is configured, the form runs in DEMO mode: it validates,
 * simulates a submission locally, and clearly tells the user no message was
 * actually sent. It never impersonates a successful real delivery.
 *
 * SECURITY: never put secrets here. Anything referenced by the client must be
 * a NEXT_PUBLIC_* var or an intended-public value.
 */

import { contact } from "@/content/site-content";

export const contactEndpoint: string =
  process.env.NEXT_PUBLIC_CONTACT_ENDPOINT ||
  process.env.CONTACT_ENDPOINT ||
  contact.endpoint;

export const isDemoMode = !contactEndpoint;

export type ContactSubmitResult =
  | { ok: true; demo: boolean; message: string }
  | { ok: false; errors: Record<string, string>; message: string };

export type ContactPayload = {
  name: string;
  email: string;
  company: string;
  projectType: string;
  message: string;
  consent: boolean;
};

/**
 * Submit the contact form. In demo mode this resolves locally after a short
 * delay to mimic network latency for realistic UX feedback.
 */
export async function submitContact(
  payload: ContactPayload,
): Promise<ContactSubmitResult> {
  if (isDemoMode) {
    await new Promise((r) => setTimeout(r, 650));
    return {
      ok: true,
      demo: true,
      message:
        "Demo mode: your details are valid, but no message was sent because no contact endpoint is configured.",
    };
  }

  try {
    const res = await fetch(contactEndpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      return {
        ok: false,
        errors: {},
        message: `Submission failed (${res.status}). Please try again or email us directly.`,
      };
    }
    return {
      ok: true,
      demo: false,
      message: "Thank you — we'll be in touch shortly.",
    };
  } catch {
    return {
      ok: false,
      errors: {},
      message:
        "Network error while submitting. Please check your connection and try again.",
    };
  }
}
