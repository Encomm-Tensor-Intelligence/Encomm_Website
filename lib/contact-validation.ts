import type { ContactFormData } from "@/content/site-content";

export type FieldErrors = Partial<Record<keyof ContactFormData, string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateField(
  field: keyof ContactFormData,
  value: string | boolean,
): string | null {
  switch (field) {
    case "name": {
      const s = String(value).trim();
      if (!s) return "Please tell us your name.";
      if (s.length < 2) return "That name looks too short.";
      return null;
    }
    case "email": {
      const s = String(value).trim();
      if (!s) return "We need an email to reply.";
      if (!EMAIL_RE.test(s)) return "Please enter a valid email address.";
      return null;
    }
    case "company": {
      const s = String(value).trim();
      if (!s) return "Which organization are you with?";
      return null;
    }
    case "projectType": {
      const s = String(value).trim();
      if (!s) return "Pick the closest match.";
      return null;
    }
    case "message": {
      const s = String(value).trim();
      if (!s) return "Tell us what AI should do for you.";
      if (s.length < 10) return "A bit more detail would help us a lot.";
      return null;
    }
    case "consent": {
      if (!value) return "We need your consent to be contacted.";
      return null;
    }
    default:
      return null;
  }
}

export function validateAll(data: ContactFormData): FieldErrors {
  const errors: FieldErrors = {};
  (Object.keys(data) as (keyof ContactFormData)[]).forEach((k) => {
    const err = validateField(k, data[k]);
    if (err) errors[k] = err;
  });
  return errors;
}

export function hasErrors(errors: FieldErrors): boolean {
  return Object.keys(errors).length > 0;
}
