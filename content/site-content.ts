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

export type Language = "en" | "el";

const greekNav: NavItem[] = [
  { label: "Συστήματα", href: "#systems" },
  { label: "Δυνατότητες", href: "#capabilities" },
  { label: "Εφαρμογές", href: "#use-cases" },
  { label: "Προσέγγιση", href: "#approach" },
  { label: "Εταιρεία", href: "#company" },
];

const greekFooterNav: { title: string; items: NavItem[] }[] = [
  {
    title: "Συστήματα",
    items: [
      { label: "AI Assistant", href: "#system-assistant" },
      { label: "Postmatrix", href: "#system-postmatrix" },
      { label: "Εξατομικευμένα συστήματα AI", href: "#system-custom" },
    ],
  },
  {
    title: "Εταιρεία",
    items: [
      { label: "Προσέγγιση", href: "#approach" },
      { label: "Ελλάδα → Κόσμος", href: "#company" },
      { label: "Επικοινωνία", href: "#contact" },
    ],
  },
  {
    title: "Νομικά",
    items: [
      { label: "Απόρρητο", href: "/privacy" },
      { label: "Όροι", href: "/terms" },
    ],
  },
];

const greekStages: Stage[] = [
  {
    key: "signal",
    index: "01",
    title: "Σήμα",
    sentence:
      "Συνδέουμε έγγραφα, ιστοσελίδες, συστήματα, APIs, βάσεις δεδομένων και οργανωσιακή γνώση.",
    detail: "Κάθε πηγή γίνεται ένα σήμα που η ENCOMM μπορεί να διαβάσει.",
  },
  {
    key: "sense",
    index: "02",
    title: "Κατανόηση",
    sentence:
      "Κατανοούμε το πλαίσιο, την πρόθεση, τις πολιτικές, τις διαδικασίες και τις πληροφορίες της επιχείρησης.",
    detail: "Χαρτογραφούμε το νόημα — όχι μόνο λέξεις-κλειδιά.",
  },
  {
    key: "system",
    index: "03",
    title: "Σύστημα",
    sentence:
      "Υλοποιούμε AI assistants, agents, integrations, εφαρμογές και αυτοματοποιημένες ροές εργασίας.",
    detail: "Η νοημοσύνη μετατρέπεται σε λειτουργικό σύστημα.",
  },
  {
    key: "scale",
    index: "04",
    title: "Κλιμάκωση",
    sentence:
      "Βελτιώνουμε την πρόσβαση στη γνώση, την εμπειρία πελάτη, τις εσωτερικές λειτουργίες και τη δυναμικότητα του οργανισμού.",
    detail: "Η δυνατότητα πολλαπλασιάζεται σε όλο τον οργανισμό.",
  },
];

const greekSystems: System[] = [
  {
    id: "system-assistant",
    index: "S—01",
    eyebrow: "Conversational AI",
    name: "ENCOMM AI Assistant",
    line: "Απαντήσεις θεμελιωμένες στη δική σας γνώση.",
    description:
      "Ένας AI assistant που βασίζεται στις επαληθευμένες πληροφορίες του οργανισμού σας. Ευρετηριάζει έγγραφα, αντλεί γνώση από ιστοσελίδες, συνδέεται με APIs και βάσεις δεδομένων και δίνει συγκεκριμένες απαντήσεις αντί για γενικές εικασίες.",
    features: [
      "Ευρετηρίαση αρχείων PDF, Word και PowerPoint",
      "Συνεχής ενημέρωση γνώσης από ιστοσελίδες",
      "Διασύνδεση με εξωτερικά APIs",
      "Σύνδεση με δομημένες βάσεις δεδομένων",
      "Ενσωμάτωση σε ιστοσελίδες και ψηφιακά προϊόντα",
      "Αυτοματοποίηση επαναλαμβανόμενων ερωτήσεων υποστήριξης",
    ],
    verified: true,
  },
  {
    id: "system-postmatrix",
    index: "S—02",
    eyebrow: "Περιεχόμενο & προγραμματισμός",
    name: "Postmatrix",
    line: "Από την ιδέα στη δημοσίευση, με έξυπνο συντονισμό.",
    description:
      "Μια AI πλατφόρμα παραγωγής και προγραμματισμού περιεχομένου για social media. Βοηθά τις ομάδες να περνούν από την ιδέα στη δημοσίευση με AI-assisted writing, οργανωμένες ροές και έξυπνους agents.",
    features: [
      "Ιδέες και συγγραφή περιεχομένου με AI",
      "Προγραμματισμός και ροές δημοσίευσης",
      "Ανάλυση feed και αλληλεπίδρασης",
      "Έξυπνοι AI agents",
      "Συνεργασία και αυτοματοποίηση για ομάδες",
    ],
    verified: true,
  },
  {
    id: "system-custom",
    index: "S—03",
    eyebrow: "Εξατομικευμένα συστήματα AI",
    name: "Custom AI Systems",
    line: "Χτισμένα γύρω από τα δεδομένα, τις ροές και τις φιλοδοξίες σας.",
    description:
      "Εξατομικευμένες AI εφαρμογές, agents, integrations, automations και συστήματα λογισμικού — σχεδιασμένα για τον συγκεκριμένο οργανισμό, τους περιορισμούς και τους στόχους του.",
    features: [
      "Εξατομικευμένες AI εφαρμογές και agents",
      "Διασυνδέσεις με υπάρχοντα συστήματα",
      "Αυτοματοποίηση διαδικασιών",
      "Έλεγχος με άνθρωπο στη διαδικασία",
      "Analytics και παρατηρησιμότητα",
    ],
    verified: true,
  },
];

const greekCapabilities: Capability[] = [
  { id: "kg", title: "AI βασισμένο στη γνώση", short: "Απαντήσεις δεμένες με τις επαληθευμένες πηγές σας.", relates: ["doc", "web", "db"] },
  { id: "doc", title: "Νοημοσύνη εγγράφων", short: "Κατανόηση και ευρετηρίαση PDF, Word και PowerPoint.", relates: ["kg", "web"] },
  { id: "web", title: "Νοημοσύνη ιστοσελίδων", short: "Συλλογή και συνεχής ενημέρωση της γνώσης.", relates: ["kg", "doc"] },
  { id: "api", title: "Διασυνδέσεις API", short: "Σύνδεση με τα συστήματα που ήδη χρησιμοποιείτε.", relates: ["db", "auto"] },
  { id: "db", title: "Σύνδεση βάσεων δεδομένων", short: "Ασφαλή ερωτήματα σε δομημένα δεδομένα.", relates: ["api", "kg"] },
  { id: "agent", title: "Agentic ροές", short: "Αυτόνομη εκτέλεση εργασιών πολλαπλών βημάτων.", relates: ["auto", "hitl"] },
  { id: "auto", title: "Αυτοματοποίηση διαδικασιών", short: "Αξιόπιστη εκτέλεση επαναλαμβανόμενων εργασιών.", relates: ["agent", "api"] },
  { id: "app", title: "Custom εφαρμογές", short: "AI λογισμικό σχεδιασμένο για τον σκοπό σας.", relates: ["agent", "obs"] },
  { id: "hitl", title: "Human-in-the-loop", short: "Έλεγχος, έγκριση και παρέμβαση στις αποφάσεις.", relates: ["agent", "obs"] },
  { id: "obs", title: "Analytics & observability", short: "Ορατότητα στη συμπεριφορά και την απόδοση του συστήματος.", relates: ["app", "hitl"] },
];

const greekUseCases: UseCase[] = [
  {
    id: "uc-enterprise",
    category: "Επιχειρησιακή Γνώση",
    challenge: "Μεγάλος όγκος εσωτερικής γνώσης εγκλωβισμένος σε έγγραφα και απομονωμένα συστήματα.",
    sources: ["Έγγραφα", "Intranet", "Βάσεις δεδομένων"],
    behavior: "Ένας grounded assistant απαντά σε εσωτερικές ερωτήσεις με επαληθευμένες πηγές.",
    workflow: "Ερώτηση εργαζομένου → απάντηση με πηγές → γνώση πάντα ενημερωμένη.",
  },
  {
    id: "uc-public",
    category: "Δημόσιες Υπηρεσίες",
    challenge: "Μεγάλος όγκος διαδικαστικών ερωτήσεων σε διαφορετικά τμήματα.",
    sources: ["Πολιτικές", "Ιστοσελίδα", "Forms API"],
    behavior: "Ο δημόσιος assistant απαντά με συνέπεια σε διαδικαστικά ερωτήματα.",
    workflow: "Ερώτηση πολίτη → τεκμηριωμένη απάντηση → μεταφορά σε άνθρωπο όταν χρειάζεται.",
  },
  {
    id: "uc-support",
    category: "Εξυπηρέτηση Πελατών",
    challenge: "Επαναλαμβανόμενες ερωτήσεις υποστήριξης δεσμεύουν χρόνο της ομάδας.",
    sources: ["Help docs", "Product API", "CRM"],
    behavior: "Ο assistant αυτοματοποιεί επαναλαμβανόμενες ερωτήσεις και διαδικασίες.",
    workflow: "Ερώτηση → τεκμηριωμένη επίλυση → ανθρώπινη παρέμβαση στις ειδικές περιπτώσεις.",
  },
  {
    id: "uc-commerce",
    category: "E-commerce",
    challenge: "Ερωτήσεις για κατάλογο, διαθεσιμότητα και παραγγελίες σε μεγάλη κλίμακα.",
    sources: ["Κατάλογος προϊόντων", "Inventory API", "Βάση παραγγελιών"],
    behavior: "Ο assistant απαντά για προϊόντα και παραγγελίες με δεδομένα σε πραγματικό χρόνο.",
    workflow: "Ερώτηση πελάτη → απάντηση από live data → προώθηση στην υποστήριξη όταν χρειάζεται.",
  },
  {
    id: "uc-education",
    category: "Εκπαίδευση",
    challenge: "Πληροφορίες μαθημάτων, πολιτικών και διοικητικών διαδικασιών βρίσκονται διάσπαρτες.",
    sources: ["Υλικό μαθημάτων", "Ιστοσελίδα", "Φοιτητικά συστήματα"],
    behavior: "Ο assistant καθοδηγεί φοιτητές και προσωπικό με τεκμηριωμένες απαντήσεις.",
    workflow: "Ερώτηση → απάντηση με πηγές → μικρότερος διοικητικός φόρτος.",
  },
  {
    id: "uc-marketing",
    category: "Marketing Operations",
    challenge: "Παραγωγή και προγραμματισμός περιεχομένου σε πολλαπλά κανάλια.",
    sources: ["Brand docs", "Analytics", "Social APIs"],
    behavior: "AI agents υποστηρίζουν τις ιδέες, τη συγγραφή και τον προγραμματισμό.",
    workflow: "Πλάνο → δημιουργία με AI → προγραμματισμός → ανάλυση αλληλεπίδρασης.",
  },
];

const greekApproach: ApproachStep[] = [
  { index: "01", title: "Ανακάλυψη", description: "Κατανοούμε τον οργανισμό, τα δεδομένα, τους περιορισμούς και το επιθυμητό αποτέλεσμα." },
  { index: "02", title: "Σχεδιασμός", description: "Ορίζουμε τη συμπεριφορά του AI, την εμπειρία χρήστη, την αρχιτεκτονική και τις δικλίδες ασφαλείας." },
  { index: "03", title: "Υλοποίηση", description: "Αναπτύσσουμε τον assistant, τον agent, την εφαρμογή, τα integrations και τα interfaces." },
  { index: "04", title: "Ενσωμάτωση", description: "Συνδέουμε το σύστημα με τις πληροφορίες και τα εργαλεία που έχουν σημασία." },
  { index: "05", title: "Εξέλιξη", description: "Μετράμε, συντηρούμε, βελτιώνουμε και επεκτείνουμε το σύστημα." },
];

export const siteContent = {
  en: {
    nav,
    primaryNavCta,
    footerNav,
    hero,
    stages,
    systems,
    capabilities,
    useCases,
    approach,
    finalCta,
    trust,
    projectTypeOptions,
  },
  el: {
    nav: greekNav,
    primaryNavCta: { label: "Επικοινωνία", href: "#contact" },
    footerNav: greekFooterNav,
    hero: {
      eyebrow: "ENTERPRISE AI · ΕΛΛΑΔΑ → ΚΟΣΜΟΣ",
      headline: "AI, σε πραγματική λειτουργία.",
      headlineParts: ["AI, σε πραγματική ", "λειτουργία", "."] as const,
      supporting:
        "Η ENCOMM μετατρέπει τη γνώση, τα δεδομένα και τις ροές εργασίας σε ευφυή συστήματα που λειτουργούν μέσα στον οργανισμό σας.",
      primaryCta: { label: "Δημιουργήστε με την ENCOMM", href: "#contact" },
      secondaryCta: { label: "Δείτε τα συστήματά μας", href: "#systems" },
    },
    stages: greekStages,
    systems: greekSystems,
    capabilities: greekCapabilities,
    useCases: greekUseCases,
    approach: greekApproach,
    finalCta: {
      headline: "Τι πρέπει να κάνει το AI για τον οργανισμό σας;",
      copy: "Ας σχεδιάσουμε ένα σύστημα γύρω από τη γνώση, τις ροές και τους ανθρώπους σας.",
      cta: "Ξεκινήστε μια συζήτηση",
    },
    trust: {
      headline: "Χτισμένο στην Ελλάδα. Σχεδιασμένο για τον κόσμο.",
      copy: "Η ENCOMM είναι μια ελληνική εταιρεία Enterprise AI και αναγνωρισμένο μέλος του Elevate Greece, της εθνικής πρωτοβουλίας για καινοτόμες startups και scaleups.",
      bullets: [
        "Enterprise-grade μηχανική από τον σχεδιασμό",
        "AI βασισμένο στη γνώση και με εξηγήσιμα αποτελέσματα",
        "Συστήματα που ενσωματώνονται και εξελίσσονται",
      ],
    },
    projectTypeOptions: [
      "Conversational AI assistant",
      "Postmatrix — περιεχόμενο & προγραμματισμός",
      "Εξατομικευμένο σύστημα AI",
      "Integration ή αυτοματοποίηση",
      "Δεν είμαι ακόμη σίγουρος/η",
    ] as const,
  },
} as const;

export const uiCopy = {
  en: {
    language: { label: "Language", english: "English", greek: "Greek" },
    skip: "Skip to content",
    navigation: {
      primary: "Primary navigation",
      backToTop: "ENCOMM — back to top",
      openMenu: "Open menu",
      closeMenu: "Close menu",
      menu: "Menu",
      siteMenu: "Site menu",
      mobileEyebrow: "ENCOMM · ENTERPRISE AI",
    },
    hero: {
      lineOne: "AI, made",
      lineTwo: "operational.",
      supportingOne: "Knowledge becomes understanding.",
      supportingTwo: "Understanding becomes action.",
      scroll: "Scroll to engage",
    },
    narrative: {
      eyebrow: "The arc",
      lineOne: "Raw information",
      lineTwo: "becomes useful action.",
    },
    systems: {
      eyebrow: "Systems",
      lineOne: "Three ways intelligence becomes",
      accent: "a working system",
    },
    capabilities: {
      eyebrow: "Capabilities",
      lineOne: "A connected",
      accent: "neural constellation",
      hint: "Hover, focus, or click a node. The constellation is the interface — not a list beside it.",
      empty: "◦ Select a capability to explore its connections",
    },
    useCases: {
      eyebrow: "Example applications",
      lineOne: "One system,",
      accent: "many worlds",
      challenge: "Challenge",
      behavior: "AI behavior",
      workflow: "Workflow",
      intelligence: "ENCOMM intelligence",
      disclaimer: "◦ Example application · capability pattern, not a client story",
    },
    approach: {
      eyebrow: "Approach",
      lineOne: "One signal through the",
      accent: "whole pipeline",
      stage: "STAGE",
    },
    globe: {
      eyebrow: "Greece → Global",
      lineOne: "Built in Greece.",
      lineTwo: "Designed for the world.",
      recognized: "◦ Recognized member of Elevate Greece",
      location: "Athens · Greece → Global",
      member: "Elevate Greece · member",
    },
    contact: {
      eyebrow: "Contact",
      background: "WHAT SHOULD AI DO\nFOR YOUR ORGANIZATION?",
      lineOne: "What should AI do",
      lineTwo: "for your organization?",
      readiness: "System readiness",
      ready: "● READY",
      configuring: "○ CONFIGURING",
      complete: "complete",
      issues: "issues",
      demoTitle: "Demo mode.",
      demoText: "No contact endpoint configured — submissions validate locally but are not sent.",
      demoEnable: "to enable.",
      formLabel: "Contact ENCOMM",
      command: "Command interface",
      name: "Name",
      namePlaceholder: "Your name",
      email: "Work email",
      company: "Company",
      companyPlaceholder: "Organization",
      projectType: "Project type",
      select: "Select the closest match…",
      message: "What should AI do for you?",
      messageHint: "The problem, the systems involved, the outcome you're after.",
      messagePlaceholder: "We'd like to …",
      consentBefore: "I agree to be contacted about my enquiry and to ENCOMM's privacy practices.",
      privacyNotice: "Privacy notice",
      transmitting: "Transmitting…",
      systemReady: "System ready — start conversation",
      demoBadge: "demo",
    },
    footer: {
      descriptor: "Enterprise AI",
      country: "Greece → Global",
      publicEmail: "Public email — to be confirmed by ENCOMM",
      social: "Social profiles — to be confirmed by ENCOMM",
      rights: "All rights reserved.",
      privacy: "Privacy",
      terms: "Terms",
    },
    legal: {
      eyebrow: "Legal",
      backHome: "Back to home",
      placeholder: "Placeholder.",
      privacyTitle: "Privacy notice",
      privacyIntro: "This privacy notice is a launch placeholder and must be reviewed and completed by ENCOMM before public release.",
      privacyBody: "ENCOMM respects your privacy. This page will explain what personal information is collected, why it is used, how long it is retained, and the rights available to you.",
      information: "Information we collect",
      informationBody: "To be completed with ENCOMM's verified data practices and contact-form configuration.",
      usage: "How we use information",
      usageBody: "To be completed.",
      contact: "Contact",
      contactBody: "A verified privacy contact address must be added before launch.",
      termsTitle: "Terms of use",
      termsIntro: "These terms are a launch placeholder and must be reviewed and completed by ENCOMM before public release.",
      termsBody: "The final terms will describe permitted website use, intellectual property, disclaimers, limitations, and applicable law.",
    },
  },
  el: {
    language: { label: "Γλώσσα", english: "Αγγλικά", greek: "Ελληνικά" },
    skip: "Μετάβαση στο περιεχόμενο",
    navigation: {
      primary: "Κύρια πλοήγηση",
      backToTop: "ENCOMM — επιστροφή στην κορυφή",
      openMenu: "Άνοιγμα μενού",
      closeMenu: "Κλείσιμο μενού",
      menu: "Μενού",
      siteMenu: "Μενού ιστοσελίδας",
      mobileEyebrow: "ENCOMM · ENTERPRISE AI",
    },
    hero: {
      lineOne: "AI, σε πραγματική",
      lineTwo: "λειτουργία.",
      supportingOne: "Η γνώση γίνεται κατανόηση.",
      supportingTwo: "Η κατανόηση γίνεται δράση.",
      scroll: "Κάντε scroll για να ξεκινήσετε",
    },
    narrative: {
      eyebrow: "Η διαδρομή",
      lineOne: "Η πληροφορία",
      lineTwo: "γίνεται χρήσιμη δράση.",
    },
    systems: {
      eyebrow: "Συστήματα",
      lineOne: "Τρεις τρόποι με τους οποίους η νοημοσύνη γίνεται",
      accent: "λειτουργικό σύστημα",
    },
    capabilities: {
      eyebrow: "Δυνατότητες",
      lineOne: "Ένας συνδεδεμένος",
      accent: "νευρωνικός αστερισμός",
      hint: "Περάστε τον δείκτη, εστιάστε ή επιλέξτε έναν κόμβο. Ο αστερισμός είναι το interface.",
      empty: "◦ Επιλέξτε μια δυνατότητα για να δείτε τις συνδέσεις της",
    },
    useCases: {
      eyebrow: "Ενδεικτικές εφαρμογές",
      lineOne: "Ένα σύστημα,",
      accent: "πολλοί κόσμοι",
      challenge: "Πρόκληση",
      behavior: "Συμπεριφορά AI",
      workflow: "Ροή εργασίας",
      intelligence: "ENCOMM intelligence",
      disclaimer: "◦ Ενδεικτική εφαρμογή · μοτίβο δυνατοτήτων, όχι ιστορία πελάτη",
    },
    approach: {
      eyebrow: "Προσέγγιση",
      lineOne: "Ένα σήμα σε",
      accent: "ολόκληρη τη διαδρομή",
      stage: "ΣΤΑΔΙΟ",
    },
    globe: {
      eyebrow: "Ελλάδα → Κόσμος",
      lineOne: "Χτισμένο στην Ελλάδα.",
      lineTwo: "Σχεδιασμένο για τον κόσμο.",
      recognized: "◦ Αναγνωρισμένο μέλος του Elevate Greece",
      location: "Αθήνα · Ελλάδα → Κόσμος",
      member: "Elevate Greece · μέλος",
    },
    contact: {
      eyebrow: "Επικοινωνία",
      background: "ΤΙ ΠΡΕΠΕΙ ΝΑ ΚΑΝΕΙ ΤΟ AI\nΓΙΑ ΤΟΝ ΟΡΓΑΝΙΣΜΟ ΣΑΣ;",
      lineOne: "Τι πρέπει να κάνει το AI",
      lineTwo: "για τον οργανισμό σας;",
      readiness: "Ετοιμότητα συστήματος",
      ready: "● ΕΤΟΙΜΟ",
      configuring: "○ ΡΥΘΜΙΣΗ",
      complete: "ολοκληρωμένο",
      issues: "ζητήματα",
      demoTitle: "Λειτουργία επίδειξης.",
      demoText: "Δεν έχει ρυθμιστεί endpoint επικοινωνίας — η φόρμα ελέγχεται τοπικά αλλά δεν αποστέλλεται.",
      demoEnable: "για ενεργοποίηση.",
      formLabel: "Επικοινωνία με την ENCOMM",
      command: "Περιβάλλον επικοινωνίας",
      name: "Όνομα",
      namePlaceholder: "Το όνομά σας",
      email: "Επαγγελματικό email",
      company: "Εταιρεία",
      companyPlaceholder: "Οργανισμός",
      projectType: "Τύπος έργου",
      select: "Επιλέξτε αυτό που ταιριάζει περισσότερο…",
      message: "Τι θέλετε να κάνει το AI για εσάς;",
      messageHint: "Το πρόβλημα, τα εμπλεκόμενα συστήματα και το αποτέλεσμα που επιδιώκετε.",
      messagePlaceholder: "Θα θέλαμε να …",
      consentBefore: "Συμφωνώ να επικοινωνήσει μαζί μου η ENCOMM σχετικά με το αίτημά μου και αποδέχομαι τις πρακτικές απορρήτου.",
      privacyNotice: "Ενημέρωση απορρήτου",
      transmitting: "Αποστολή…",
      systemReady: "Το σύστημα είναι έτοιμο — ξεκινήστε τη συζήτηση",
      demoBadge: "demo",
    },
    footer: {
      descriptor: "Enterprise AI",
      country: "Ελλάδα → Κόσμος",
      publicEmail: "Δημόσιο email — αναμένεται επιβεβαίωση από την ENCOMM",
      social: "Social profiles — αναμένεται επιβεβαίωση από την ENCOMM",
      rights: "Με επιφύλαξη παντός δικαιώματος.",
      privacy: "Απόρρητο",
      terms: "Όροι",
    },
    legal: {
      eyebrow: "Νομικά",
      backHome: "Επιστροφή στην αρχική",
      placeholder: "Προσωρινό κείμενο.",
      privacyTitle: "Ενημέρωση απορρήτου",
      privacyIntro: "Αυτή η ενημέρωση απορρήτου είναι προσωρινή και πρέπει να ελεγχθεί και να ολοκληρωθεί από την ENCOMM πριν από τη δημόσια κυκλοφορία.",
      privacyBody: "Η ENCOMM σέβεται το απόρρητό σας. Η σελίδα θα εξηγεί ποια προσωπικά δεδομένα συλλέγονται, γιατί χρησιμοποιούνται, για πόσο διατηρούνται και ποια δικαιώματα έχετε.",
      information: "Πληροφορίες που συλλέγουμε",
      informationBody: "Θα συμπληρωθεί με τις επιβεβαιωμένες πρακτικές δεδομένων και τη ρύθμιση της φόρμας επικοινωνίας.",
      usage: "Πώς χρησιμοποιούμε τις πληροφορίες",
      usageBody: "Θα συμπληρωθεί.",
      contact: "Επικοινωνία",
      contactBody: "Πρέπει να προστεθεί επιβεβαιωμένη διεύθυνση επικοινωνίας για θέματα απορρήτου πριν από τη δημοσίευση.",
      termsTitle: "Όροι χρήσης",
      termsIntro: "Οι όροι αυτοί είναι προσωρινοί και πρέπει να ελεγχθούν και να ολοκληρωθούν από την ENCOMM πριν από τη δημόσια κυκλοφορία.",
      termsBody: "Οι τελικοί όροι θα περιγράφουν την επιτρεπόμενη χρήση της ιστοσελίδας, την πνευματική ιδιοκτησία, τις αποποιήσεις, τους περιορισμούς και το εφαρμοστέο δίκαιο.",
    },
  },
} as const;
