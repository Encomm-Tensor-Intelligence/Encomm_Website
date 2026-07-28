import type { ContactFormData, Language } from "@/content/site-content";

export type FieldErrors = Partial<Record<keyof ContactFormData, string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateField(
  field: keyof ContactFormData,
  value: string | boolean,
  language: Language = "en",
): string | null {
  const el = language === "el";
  switch (field) {
    case "name": {
      const s = String(value).trim();
      if (!s) return el ? "Συμπληρώστε το όνομά σας." : "Please tell us your name.";
      if (s.length < 2) return el ? "Το όνομα είναι πολύ σύντομο." : "That name looks too short.";
      return null;
    }
    case "email": {
      const s = String(value).trim();
      if (!s) return el ? "Χρειαζόμαστε ένα email για να απαντήσουμε." : "We need an email to reply.";
      if (!EMAIL_RE.test(s)) return el ? "Συμπληρώστε μια έγκυρη διεύθυνση email." : "Please enter a valid email address.";
      return null;
    }
    case "company": {
      const s = String(value).trim();
      if (!s) return el ? "Σε ποιον οργανισμό ανήκετε;" : "Which organization are you with?";
      return null;
    }
    case "projectType": {
      const s = String(value).trim();
      if (!s) return el ? "Επιλέξτε αυτό που ταιριάζει περισσότερο." : "Pick the closest match.";
      return null;
    }
    case "message": {
      const s = String(value).trim();
      if (!s) return el ? "Πείτε μας τι θέλετε να κάνει το AI για εσάς." : "Tell us what AI should do for you.";
      if (s.length < 10) return el ? "Λίγες περισσότερες λεπτομέρειες θα μας βοηθήσουν." : "A bit more detail would help us a lot.";
      return null;
    }
    case "consent": {
      if (!value) return el ? "Χρειαζόμαστε τη συγκατάθεσή σας για να επικοινωνήσουμε." : "We need your consent to be contacted.";
      return null;
    }
    default:
      return null;
  }
}

export function validateAll(
  data: ContactFormData,
  language: Language = "en",
): FieldErrors {
  const errors: FieldErrors = {};
  (Object.keys(data) as (keyof ContactFormData)[]).forEach((k) => {
    const err = validateField(k, data[k], language);
    if (err) errors[k] = err;
  });
  return errors;
}

export function hasErrors(errors: FieldErrors): boolean {
  return Object.keys(errors).length > 0;
}
