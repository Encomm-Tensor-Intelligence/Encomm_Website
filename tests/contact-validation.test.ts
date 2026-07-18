import { describe, expect, it } from "vitest";
import {
  validateAll,
  validateField,
  hasErrors,
} from "@/lib/contact-validation";
import type { ContactFormData } from "@/content/site-content";

const valid: ContactFormData = {
  name: "Eleni Papadopoulou",
  email: "eleni@encomm.ai",
  company: "ENCOMM",
  projectType: "Conversational AI assistant",
  message: "We need an assistant grounded in our internal docs.",
  consent: true,
};

const empty: ContactFormData = {
  name: "",
  email: "",
  company: "",
  projectType: "",
  message: "",
  consent: false,
};

describe("validateField", () => {
  it("flags missing name", () => {
    expect(validateField("name", "")).toBe("Please tell us your name.");
  });

  it("flags short name", () => {
    expect(validateField("name", "E")).toBe("That name looks too short.");
  });

  it("accepts valid name", () => {
    expect(validateField("name", "Eleni")).toBeNull();
  });

  it("rejects malformed email", () => {
    expect(validateField("email", "not-an-email")).toBe(
      "Please enter a valid email address.",
    );
    expect(validateField("email", "a@b")).toBe(
      "Please enter a valid email address.",
    );
  });

  it("accepts valid email", () => {
    expect(validateField("email", "a@b.co")).toBeNull();
  });

  it("requires company", () => {
    expect(validateField("company", "  ")).toBe(
      "Which organization are you with?",
    );
  });

  it("requires project type", () => {
    expect(validateField("projectType", "")).toBe("Pick the closest match.");
  });

  it("requires message of reasonable length", () => {
    expect(validateField("message", "")).toBe(
      "Tell us what AI should do for you.",
    );
    expect(validateField("message", "short")).toBe(
      "A bit more detail would help us a lot.",
    );
  });

  it("requires consent", () => {
    expect(validateField("consent", false)).toBe(
      "We need your consent to be contacted.",
    );
    expect(validateField("consent", true)).toBeNull();
  });
});

describe("validateAll", () => {
  it("returns no errors for a complete valid payload", () => {
    const errors = validateAll(valid);
    expect(hasErrors(errors)).toBe(false);
    expect(Object.keys(errors)).toHaveLength(0);
  });

  it("returns an error for every required field when empty", () => {
    const errors = validateAll(empty);
    expect(hasErrors(errors)).toBe(true);
    expect(Object.keys(errors).sort()).toEqual(
      [
        "name",
        "email",
        "company",
        "projectType",
        "message",
        "consent",
      ].sort(),
    );
  });
});

describe("hasErrors", () => {
  it("false on empty object", () => {
    expect(hasErrors({})).toBe(false);
  });
  it("true with at least one error", () => {
    expect(hasErrors({ email: "bad" })).toBe(true);
  });
});
