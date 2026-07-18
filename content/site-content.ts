/**
 * ENCOMM — Central site content & configuration.
 *
 * This is the single source of truth for company copy, navigation, contact,
 * and product information. Edit values here; the UI consumes them by reference.
 *
 * ONLY VERIFIED INFORMATION lives here. Do not add client names, revenue
 * numbers, awards, testimonials, or contact details that ENCOMM has not
 * confirmed. Capability-focused language replaces fabricated proof.
 */

export const company = {
  name: "ENCOMM",
  legalName: "ENCOMM",
  descriptor: "Enterprise AI",
  tagline: "AI, made operational.",
  country: "Greece",
  positioning: "Enterprise AI",
  /** Verified: ENCOMM is a recognized member of Elevate Greece. */
  elevateGreeceMember: true,
  /**
   * Public website URL. The live site currently shows an "updates in
   * progress" notice; this is the canonical domain, used for metadata only.
   */
  url: "https://www.encomm.ai",
  description:
    "ENCOMM is a Greek Enterprise AI company that designs and develops AI software, intelligent assistants, agents, integrations, automations, and custom applications.",
} as const;

/**
 * Contact configuration.
 *
 * The contact form reads `endpoint` from the CONTACT_ENDPOINT env var first,
 * then from `endpoint` below. When neither is present, the form runs in a
 * clearly-labelled local demo state and never pretends to send.
 *
 * VERIFIED contact channels only. The email below is intentionally a
 * placeholder until ENCOMM confirms a public address — it is not rendered
 * publicly. Set `publicEmail` once verified.
 */
export const contact = {
  /** Optional POST endpoint for the contact form. Leave empty for demo mode. */
  endpoint: "",
  publicEmail: "", // e.g. "hello@encomm.ai" — set once verified
  phone: "", // do not display until verified
  address: "", // do not display until verified
  /** Social links — populate only with ENCOMM-verified profiles. */
  social: [
    // { label: "LinkedIn", href: "https://www.linkedin.com/company/encomm" },
  ] as Array<{ label: string; href: string }>,
} as const;

export type NavItem = { label: string; href: string };

export const nav: NavItem[] = [
  { label: "Systems", href: "#systems" },
  { label: "Capabilities", href: "#capabilities" },
  { label: "Use cases", href: "#use-cases" },
  { label: "Approach", href: "#approach" },
  { label: "Company", href: "#company" },
];

export const primaryNavCta = { label: "Contact sales", href: "#contact" };

/** Footer navigation groupings. */
export const footerNav: { title: string; items: NavItem[] }[] = [
  {
    title: "Systems",
    items: [
      { label: "AI Assistant", href: "#system-assistant" },
      { label: "Postmatrix", href: "#system-postmatrix" },
      { label: "Custom AI systems", href: "#system-custom" },
    ],
  },
  {
    title: "Company",
    items: [
      { label: "Approach", href: "#approach" },
      { label: "Greece → Global", href: "#company" },
      { label: "Contact", href: "#contact" },
    ],
  },
  {
    title: "Legal",
    items: [
      // PLACEHOLDER — replace with verified policy URLs before launch.
      { label: "Privacy", href: "/privacy" },
      { label: "Terms", href: "/terms" },
    ],
  },
];

export const hero = {
  eyebrow: "ENTERPRISE AI · GREECE → GLOBAL",
  headline: "AI, made operational.",
  /** Tokens like {accent} are styled by the component. */
  headlineParts: ["AI, made ", "operational", "."] as const,
  supporting:
    "ENCOMM transforms knowledge, data, and workflows into intelligent systems that work inside your organization.",
  primaryCta: { label: "Build with ENCOMM", href: "#contact" },
  secondaryCta: { label: "Explore our systems", href: "#systems" },
};

/**
 * SIGNAL → SENSE → SYSTEM → SCALE.
 * Each stage: one clear sentence, one transformation cue, one interaction note.
 */
export type Stage = {
  key: "signal" | "sense" | "system" | "scale";
  index: string;
  title: string;
  sentence: string;
  detail: string;
};

export const stages: Stage[] = [
  {
    key: "signal",
    index: "01",
    title: "Signal",
    sentence: "Connect documents, websites, systems, APIs, databases, and organizational knowledge.",
    detail: "Every source becomes a signal ENCOMM can read.",
  },
  {
    key: "sense",
    index: "02",
    title: "Sense",
    sentence: "Understand context, intent, policies, procedures, and business-specific information.",
    detail: "Meaning is mapped — not just keywords.",
  },
  {
    key: "system",
    index: "03",
    title: "System",
    sentence: "Deploy AI assistants, agents, integrations, applications, and automated workflows.",
    detail: "Intelligence becomes a working system.",
  },
  {
    key: "scale",
    index: "04",
    title: "Scale",
    sentence: "Improve access to knowledge, customer experience, internal operations, and organizational capacity.",
    detail: "Capability compounds across the organization.",
  },
];

export type System = {
  id: string;
  index: string;
  eyebrow: string;
  name: string;
  line: string;
  description: string;
  features: string[];
  /** Verified flag — controls product naming usage. */
  verified: boolean;
};

export const systems: System[] = [
  {
    id: "system-assistant",
    index: "S—01",
    eyebrow: "Conversational AI",
    name: "ENCOMM AI Assistant",
    line: "Answers grounded in your knowledge.",
    description:
      "An AI assistant grounded in your organization's own verified information. It indexes documents, crawls websites, connects to APIs and databases, and gives organization-specific answers instead of generic guesses.",
    features: [
      "Indexes PDF, Word, and PowerPoint documents",
      "Crawls and updates knowledge from websites",
      "Integrates with external APIs",
      "Connects to structured databases",
      "Embeddable in websites and digital products",
      "Automates repetitive support and procedural questions",
    ],
    verified: true,
  },
  {
    id: "system-postmatrix",
    index: "S—02",
    eyebrow: "Content & scheduling",
    name: "Postmatrix",
    line: "From idea to published content, intelligently coordinated.",
    description:
      "An AI-powered social-media content and scheduling platform. It helps teams move from idea to published post with AI-assisted writing, scheduling workflows, and smart agents.",
    features: [
      "AI-assisted content ideation and writing",
      "Content scheduling and publishing workflows",
      "Feed and engagement analysis",
      "Smart AI agents",
      "Collaboration and automation for teams",
    ],
    // Use the name only when verified in company materials.
    verified: true,
  },
  {
    id: "system-custom",
    index: "S—03",
    eyebrow: "Custom AI systems",
    name: "Custom AI Systems",
    line: "Built around your data, workflows, and ambitions.",
    description:
      "Tailor-made AI applications, agents, integrations, automations, and software systems — designed around the specific organization, its constraints, and its outcomes.",
    features: [
      "Custom AI applications and agents",
      "Integrations with existing systems",
      "Process automation",
      "Human-in-the-loop controls",
      "Analytics and observability",
    ],
    verified: true,
  },
];

export type Capability = {
  id: string;
  title: string;
  short: string;
  /** ids of related capabilities for constellation highlighting */
  relates: string[];
};

export const capabilities: Capability[] = [
  { id: "kg", title: "Knowledge-grounded AI", short: "Answers tied to your verified sources.", relates: ["doc", "web", "db"] },
  { id: "doc", title: "Document intelligence", short: "PDF, Word, PowerPoint understood and indexed.", relates: ["kg", "web"] },
  { id: "web", title: "Website intelligence", short: "Crawl and keep knowledge up to date.", relates: ["kg", "doc"] },
  { id: "api", title: "API integrations", short: "Connect the systems you already use.", relates: ["db", "auto"] },
  { id: "db", title: "Database connectivity", short: "Query structured data safely.", relates: ["api", "kg"] },
  { id: "agent", title: "Agentic workflows", short: "Multi-step tasks handled autonomously.", relates: ["auto", "hitl"] },
  { id: "auto", title: "Process automation", short: "Repetitive work, reliably handled.", relates: ["agent", "api"] },
  { id: "app", title: "Custom applications", short: "Purpose-built AI software.", relates: ["agent", "obs"] },
  { id: "hitl", title: "Human-in-the-loop", short: "Review, approve, and override decisions.", relates: ["agent", "obs"] },
  { id: "obs", title: "Analytics & observability", short: "See how the system behaves and performs.", relates: ["app", "hitl"] },
];

export type UseCase = {
  id: string;
  category: string;
  challenge: string;
  sources: string[];
  behavior: string;
  workflow: string;
};

/**
 * Labelled as "Example applications" / use-case patterns — not client stories.
 * No quantified results, no fabricated clients.
 */
export const useCases: UseCase[] = [
  {
    id: "uc-enterprise",
    category: "Enterprise Knowledge",
    challenge: "A large internal knowledge base locked in documents and silos.",
    sources: ["Documents", "Intranet", "Databases"],
    behavior: "Grounded assistant answers internal questions with verified sources.",
    workflow: "Employees ask → assistant cites sources → knowledge stays current.",
  },
  {
    id: "uc-public",
    category: "Citizen & Public Services",
    challenge: "High volume of procedural questions across departments.",
    sources: ["Policy docs", "Website", "Forms API"],
    behavior: "Public-facing assistant resolves procedural queries consistently.",
    workflow: "Citizen asks → grounded answer → handoff to a human when needed.",
  },
  {
    id: "uc-support",
    category: "Customer Support",
    challenge: "Repetitive support questions consuming agent time.",
    sources: ["Help docs", "Product API", "CRM"],
    behavior: "Assistant automates repetitive support and procedural questions.",
    workflow: "Question → grounded resolution → human-in-the-loop for edge cases.",
  },
  {
    id: "uc-commerce",
    category: "E-commerce",
    challenge: "Catalog, inventory, and order questions at scale.",
    sources: ["Product catalog", "Inventory API", "Order DB"],
    behavior: "Assistant answers product and order questions from live data.",
    workflow: "Shopper asks → live data answer → routed to support if complex.",
  },
  {
    id: "uc-education",
    category: "Education",
    challenge: "Course, policy, and administrative information scattered.",
    sources: ["Course materials", "Website", "Student systems"],
    behavior: "Assistant guides students and staff with grounded answers.",
    workflow: "Ask → cited answer → reduced administrative load.",
  },
  {
    id: "uc-marketing",
    category: "Marketing Operations",
    challenge: "Content production and scheduling across channels.",
    sources: ["Brand docs", "Analytics", "Social APIs"],
    behavior: "AI agents assist ideation, writing, and scheduling.",
    workflow: "Plan → draft with AI → schedule → analyze engagement.",
  },
];

export type ApproachStep = {
  index: string;
  title: string;
  description: string;
};

export const approach: ApproachStep[] = [
  { index: "01", title: "Discover", description: "Understand the organization, data, constraints, and desired outcome." },
  { index: "02", title: "Design", description: "Define the AI behavior, user experience, architecture, and safeguards." },
  { index: "03", title: "Build", description: "Develop the assistant, agent, application, integrations, and interfaces." },
  { index: "04", title: "Integrate", description: "Connect it to the systems and information that matter." },
  { index: "05", title: "Evolve", description: "Measure, maintain, refine, and expand the system." },
];

export const finalCta = {
  headline: "What should AI do for your organization?",
  copy: "Let's design a system around your knowledge, workflows, and people.",
  cta: "Start a conversation",
};

export const trust = {
  headline: "Built in Greece. Designed for the world.",
  copy: "ENCOMM is a Greek Enterprise AI company and a recognized member of Elevate Greece, the national initiative for innovative startups and scaleups.",
  bullets: [
    "Enterprise-grade engineering, by design",
    "Knowledge-grounded, explainable AI",
    "Systems built to integrate and evolve",
  ],
};

export const projectTypeOptions = [
  "Conversational AI assistant",
  "Postmatrix — content & scheduling",
  "Custom AI system",
  "Integration or automation",
  "Not sure yet",
] as const;

export type ContactFormData = {
  name: string;
  email: string;
  company: string;
  projectType: string;
  message: string;
  consent: boolean;
};
