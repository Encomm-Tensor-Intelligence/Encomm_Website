import { NextResponse } from "next/server";

export const runtime = "nodejs";

const WINDOW_MS = 10 * 60 * 1000;
const MAX_REQUESTS = 5;
const MAX_BODY_BYTES = 16_000;
const MIN_COMPLETION_MS = 1_800;
const MAX_FORM_AGE_MS = 2 * 60 * 60 * 1000;

type RateEntry = { count: number; resetAt: number };
type ContactBody = {
  name?: unknown;
  email?: unknown;
  company?: unknown;
  brief?: unknown;
  language?: unknown;
  privacy?: unknown;
  website?: unknown;
  startedAt?: unknown;
};

const rateStore = new Map<string, RateEntry>();

function clean(value: unknown, maximum: number) {
  return typeof value === "string"
    ? value.replace(/\u0000/g, "").trim().slice(0, maximum)
    : "";
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function clientIp(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for");
  return forwarded?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "local";
}

function sameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin) return true;

  try {
    const requestHost = request.headers.get("host");
    const originUrl = new URL(origin);
    if (requestHost && originUrl.host === requestHost) return true;

    const allowed = (process.env.CONTACT_ALLOWED_ORIGINS ?? "")
      .split(",")
      .map((value) => value.trim())
      .filter(Boolean);
    return allowed.includes(originUrl.origin);
  } catch {
    return false;
  }
}

function isRateLimited(key: string) {
  const now = Date.now();
  if (rateStore.size > 1_000) {
    for (const [storedKey, entry] of rateStore) {
      if (entry.resetAt <= now) rateStore.delete(storedKey);
    }
  }
  const existing = rateStore.get(key);

  if (!existing || existing.resetAt <= now) {
    rateStore.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }

  existing.count += 1;
  rateStore.set(key, existing);
  return existing.count > MAX_REQUESTS;
}

function quietSuccess(language: "en" | "el") {
  return NextResponse.json({
    ok: true,
    message:
      language === "el"
        ? "Ευχαριστούμε. Το μήνυμά σας καταχωρίστηκε."
        : "Thank you. Your message has been received.",
  });
}

export async function POST(request: Request) {
  const contentType = request.headers.get("content-type") ?? "";
  const declaredLength = Number(request.headers.get("content-length") ?? "0");

  if (!contentType.toLowerCase().startsWith("application/json")) {
    return NextResponse.json({ ok: false, message: "Unsupported request." }, { status: 415 });
  }
  if (declaredLength > MAX_BODY_BYTES) {
    return NextResponse.json({ ok: false, message: "Request too large." }, { status: 413 });
  }
  if (!sameOrigin(request)) {
    return NextResponse.json({ ok: false, message: "Request origin rejected." }, { status: 403 });
  }

  const ip = clientIp(request);
  if (isRateLimited(ip)) {
    return NextResponse.json(
      { ok: false, message: "Too many requests. Please try again later." },
      { status: 429, headers: { "Retry-After": String(WINDOW_MS / 1000) } },
    );
  }

  let body: ContactBody;
  try {
    const rawBody = await request.text();
    if (new TextEncoder().encode(rawBody).byteLength > MAX_BODY_BYTES) {
      return NextResponse.json({ ok: false, message: "Request too large." }, { status: 413 });
    }
    body = JSON.parse(rawBody) as ContactBody;
  } catch {
    return NextResponse.json({ ok: false, message: "Invalid request." }, { status: 400 });
  }

  const language = body.language === "el" ? "el" : "en";
  const honeypot = clean(body.website, 200);
  const startedAt = typeof body.startedAt === "number" ? body.startedAt : Number(body.startedAt);
  const age = Date.now() - startedAt;
  const brief = clean(body.brief, 3_000);

  // Quietly accept obvious automated submissions so the endpoint does not
  // teach bots which check they triggered.
  if (
    honeypot ||
    !Number.isFinite(startedAt) ||
    age < MIN_COMPLETION_MS ||
    age > MAX_FORM_AGE_MS ||
    (brief.match(/https?:\/\//gi)?.length ?? 0) > 3
  ) {
    return quietSuccess(language);
  }

  const name = clean(body.name, 80);
  const email = clean(body.email, 254).toLowerCase();
  const companyName = clean(body.company, 120);
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (
    name.length < 2 ||
    !emailPattern.test(email) ||
    brief.length < 20 ||
    body.privacy !== true
  ) {
    return NextResponse.json(
      {
        ok: false,
        message:
          language === "el"
            ? "Ελέγξτε τα υποχρεωτικά πεδία και δοκιμάστε ξανά."
            : "Please check the required fields and try again.",
      },
      { status: 400 },
    );
  }

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.CONTACT_FROM_EMAIL;
  const to = process.env.CONTACT_TO_EMAIL ?? "info@encomm.ai";

  if (!apiKey || !from) {
    return NextResponse.json(
      {
        ok: false,
        message:
          language === "el"
            ? "Η ηλεκτρονική αποστολή δεν έχει ενεργοποιηθεί ακόμη. Στείλτε μας email στο info@encomm.ai."
            : "Online delivery is not active yet. Please email us at info@encomm.ai.",
      },
      { status: 503 },
    );
  }

  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safeCompany = escapeHtml(companyName || "—");
  const safeBrief = escapeHtml(brief).replaceAll("\n", "<br />");
  const safeSubjectLabel = (companyName || name).replace(/[\r\n]+/g, " ");
  const subject = `New ENCOMM enquiry — ${safeSubjectLabel}`;
  const text = [
    `Name: ${name}`,
    `Email: ${email}`,
    `Company: ${companyName || "—"}`,
    `Language: ${language.toUpperCase()}`,
    "",
    "Project brief:",
    brief,
  ].join("\n");

  let delivery: Response;
  try {
    delivery = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "Idempotency-Key": crypto.randomUUID(),
        "User-Agent": "ENCOMM-Website/1.0",
      },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: email,
        subject,
        text,
        html: `
          <div style="font-family:Arial,sans-serif;line-height:1.6;color:#15151a">
            <h1 style="font-size:24px">New ENCOMM project enquiry</h1>
            <p><strong>Name:</strong> ${safeName}</p>
            <p><strong>Email:</strong> ${safeEmail}</p>
            <p><strong>Company:</strong> ${safeCompany}</p>
            <p><strong>Language:</strong> ${language.toUpperCase()}</p>
            <hr style="border:0;border-top:1px solid #ddd;margin:24px 0" />
            <p><strong>Project brief</strong></p>
            <p>${safeBrief}</p>
          </div>
        `,
        tags: [{ name: "source", value: "encomm-website" }],
      }),
    });
  } catch {
    return NextResponse.json(
      {
        ok: false,
        message:
          language === "el"
            ? "Η υπηρεσία αποστολής δεν είναι προσωρινά διαθέσιμη. Δοκιμάστε ξανά ή χρησιμοποιήστε το info@encomm.ai."
            : "The delivery service is temporarily unavailable. Please try again or use info@encomm.ai.",
      },
      { status: 502 },
    );
  }

  if (!delivery.ok) {
    console.error("Contact delivery failed", delivery.status);
    return NextResponse.json(
      {
        ok: false,
        message:
          language === "el"
            ? "Δεν μπορέσαμε να στείλουμε το μήνυμα. Δοκιμάστε ξανά ή χρησιμοποιήστε το info@encomm.ai."
            : "We could not send your message. Please try again or use info@encomm.ai.",
      },
      { status: 502 },
    );
  }

  return NextResponse.json({
    ok: true,
    message:
      language === "el"
        ? "Το μήνυμα στάλθηκε. Θα επικοινωνήσουμε σύντομα μαζί σας."
        : "Your message has been sent. We will be in touch shortly.",
  });
}
