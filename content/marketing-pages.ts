import { company } from "@/content/company";

export const elevateRegistryUrl = company.elevateProfile;

export const serviceSlugs = [
  "ai-strategy",
  "ai-agents",
  "intelligent-automation",
  "erp-ecommerce-integrations",
  "custom-ai-products",
] as const;

export type ServiceSlug = (typeof serviceSlugs)[number];
export type MarketingLanguage = "en" | "el";

type ServicePage = {
  index: string;
  eyebrow: string;
  title: string;
  accent: string;
  summary: string;
  promise: string;
  outcomesTitle: string;
  outcomes: Array<{ title: string; body: string }>;
  deliverablesTitle: string;
  deliverables: string[];
  processTitle: string;
  process: Array<{ number: string; title: string; body: string }>;
  systemsTitle: string;
  systems: string[];
};

const sharedChrome = {
  en: {
    navLabel: "Company navigation",
    home: "Home",
    about: "About",
    services: "Services",
    work: "Work",
    contact: "Start a project",
    language: "Language",
    support: "Support",
    privacy: "Privacy",
    terms: "Terms",
    cookies: "Cookies",
    location: "Thessaloniki, Greece",
    registeredOffice: company.addressEn,
    registration: `ENCOMM P.C. · G.E.MI. ${company.gemi} · Greek VAT ${company.vat}`,
    registry: "National Startup Registry",
    registryTitle: "Registered member of Elevate Greece",
    footerLine: "Practical AI systems for real operational workflows.",
    backToServices: "All services",
    related: "Explore another capability",
    talkEyebrow: "Have a real workflow in mind?",
    talkTitle: "Let’s make it work intelligently.",
    talkBody:
      "Tell us what needs to change, which systems are involved and what a useful result looks like.",
    talkCta: "Talk to ENCOMM",
  },
  el: {
    navLabel: "Πλοήγηση εταιρείας",
    home: "Αρχική",
    about: "Η εταιρεία",
    services: "Υπηρεσίες",
    work: "Έργα",
    contact: "Ξεκινήστε ένα έργο",
    language: "Γλώσσα",
    support: "Υποστήριξη",
    privacy: "Απόρρητο",
    terms: "Όροι",
    cookies: "Πολιτική Cookies",
    location: "Θεσσαλονίκη, Ελλάδα",
    registeredOffice: company.addressEl,
    registration: `ENCOMM Ι.Κ.Ε. · Γ.Ε.ΜΗ. ${company.gemi} · Α.Φ.Μ. ${company.vat}`,
    registry: "Εθνικό Μητρώο Νεοφυών Επιχειρήσεων",
    registryTitle: "Εγγεγραμμένο μέλος του Elevate Greece",
    footerLine: "Πρακτικά συστήματα AI για πραγματικές λειτουργικές ροές.",
    backToServices: "Όλες οι υπηρεσίες",
    related: "Δείτε μια ακόμη δυνατότητα",
    talkEyebrow: "Έχετε μια πραγματική ροή στο μυαλό σας;",
    talkTitle: "Ας την κάνουμε να λειτουργεί έξυπνα.",
    talkBody:
      "Πείτε μας τι πρέπει να αλλάξει, ποια συστήματα εμπλέκονται και ποιο είναι το χρήσιμο αποτέλεσμα.",
    talkCta: "Μιλήστε με την ENCOMM",
  },
} as const;

const about = {
  en: {
    eyebrow: "Company / Thessaloniki",
    title: "AI that moves",
    accent: "real work forward.",
    intro:
      "ENCOMM is a Greek AI software company building a voice-first orchestration layer for citizen services, public-sector workflows and service-heavy organizations.",
    source: "Company information verified through the official G.E.MI. publicity service and the Elevate Greece National Startup Registry.",
    facts: [
      ["BASE", "Thessaloniki, Greece"],
      ["G.E.MI.", company.gemi],
      ["GREEK VAT", company.vat],
      ["STATUS", "Active · Private Company"],
    ],
    storyEyebrow: "Why ENCOMM exists",
    storyTitle: "Complex procedures should feel simple.",
    storyBody: [
      "ENCOMM was created to make complex services easier to access through natural language, guided automation and human-in-the-loop execution.",
      "The goal is not another generic chatbot. It is an operational layer that understands intent, retrieves trusted information, guides each step, prepares structured outputs and connects the conversation to the real workflow behind it.",
    ],
    philosophyEyebrow: "Technology philosophy",
    philosophyTitle: "Useful intelligence needs structure.",
    philosophy: [
      {
        number: "01",
        title: "Trusted context",
        body: "Responses and decisions are grounded in approved knowledge, data and validation rules.",
      },
      {
        number: "02",
        title: "Controlled action",
        body: "Workflow automation is traceable, secure and designed with human approval where it matters.",
      },
      {
        number: "03",
        title: "Reusable architecture",
        body: "Voice interface, knowledge layer, workflow engine, audit logs and integrations can scale across use cases.",
      },
    ],
    technologyEyebrow: "Official technology profile",
    technologyTitle: "One operating layer, multiple disciplines.",
    technology: [
      "Artificial Intelligence",
      "Cloud Computing",
      "Data Analytics & Big Data",
      "Software Engineering",
      "Web & Mobile Applications",
    ],
    teamEyebrow: "Founding team",
    teamTitle: "Three co-founders. One shared vision.",
    teamIntro:
      "ENCOMM’s founding team combines entrepreneurial experience, technology execution, AI product design and a deep understanding of complex operational workflows.",
    team: [
      {
        name: "Charalampos Dedopoulos",
        role: "Co-Founder",
        image: "/team-charalampos-dedopoulos.webp",
        imageAlt: "Charalampos Dedopoulos, Co-Founder of ENCOMM",
        socials: {
          github: "https://github.com/Xamposs",
          x: "https://x.com/DedoXampos",
        },
      },
      {
        name: "Vasileios Mitrakoudis",
        role: "Co-Founder",
        image: "/team-vasileios-mitrakoudis.webp",
        imageAlt: "Vasileios Mitrakoudis, Co-Founder of ENCOMM",
        socials: {
          github: "https://github.com/Blacknoir",
        },
      },
      {
        name: "Eleftherios Kasapis",
        role: "Co-Founder",
        image: "/team-eleftherios-kasapis.webp",
        imageAlt: "Eleftherios Kasapis, Co-Founder of ENCOMM",
        socials: {},
      },
    ],
    ecosystemEyebrow: "Partnerships & ecosystem",
    ecosystemTitle: "Built to collaborate.",
    ecosystemIntro:
      "ENCOMM is developing an ecosystem around pilot deployments, secure integrations and scalable commercial use.",
    ecosystem: [
      {
        title: "Public & enterprise pilots",
        body: "Operational environments where guided AI workflows can reduce manual work and improve access to services.",
      },
      {
        title: "Technology & data partners",
        body: "Secure integrations, infrastructure and trusted information sources that make the platform useful in practice.",
      },
      {
        title: "Research, security & compliance",
        body: "Collaboration around evaluation, privacy, governance and responsible deployment in demanding environments.",
      },
    ],
    elevateEyebrow: "Elevate Greece",
    elevateTitle: "Part of Greece’s National Startup Registry.",
    elevateBody:
      `${company.legalNameEl}, trading as ${company.tradingName}, is listed in the official Elevate Greece registry, with Thessaloniki as its base and Enterprise Software as its industry.`,
    elevateCta: "View the official company profile",
  },
  el: {
    eyebrow: "Εταιρεία / Θεσσαλονίκη",
    title: "AI που κινεί",
    accent: "την πραγματική εργασία μπροστά.",
    intro:
      "Η ENCOMM είναι μια ελληνική εταιρεία λογισμικού τεχνητής νοημοσύνης που δημιουργεί ένα επίπεδο ενορχήστρωσης με φωνητική αλληλεπίδραση για υπηρεσίες πολιτών, ροές εργασίας του δημόσιου τομέα και οργανισμούς με σύνθετες υπηρεσίες.",
    source: "Τα εταιρικά στοιχεία έχουν επιβεβαιωθεί από την επίσημη Δημοσιότητα Γ.Ε.ΜΗ. και το Εθνικό Μητρώο Νεοφυών Επιχειρήσεων Elevate Greece.",
    facts: [
      ["ΕΔΡΑ", "Θεσσαλονίκη, Ελλάδα"],
      ["Γ.Ε.ΜΗ.", company.gemi],
      ["Α.Φ.Μ.", company.vat],
      ["ΚΑΤΑΣΤΑΣΗ", "Ενεργή · Ι.Κ.Ε."],
    ],
    storyEyebrow: "Γιατί δημιουργήθηκε η ENCOMM",
    storyTitle: "Οι σύνθετες διαδικασίες πρέπει να γίνονται απλές.",
    storyBody: [
      "Η ENCOMM δημιουργήθηκε για να κάνει τις σύνθετες υπηρεσίες πιο εύκολα προσβάσιμες μέσα από φυσική γλώσσα, καθοδηγούμενους αυτοματισμούς και ανθρώπινο έλεγχο.",
      "Ο στόχος δεν είναι ένα ακόμη γενικό σύστημα συνομιλίας. Είναι ένα λειτουργικό επίπεδο που κατανοεί την πρόθεση, ανακτά αξιόπιστες πληροφορίες, καθοδηγεί κάθε βήμα, προετοιμάζει δομημένα αποτελέσματα και συνδέει τη συζήτηση με την πραγματική ροή εργασίας που την υποστηρίζει.",
    ],
    philosophyEyebrow: "Τεχνολογική φιλοσοφία",
    philosophyTitle: "Η χρήσιμη νοημοσύνη χρειάζεται δομή.",
    philosophy: [
      {
        number: "01",
        title: "Αξιόπιστο πλαίσιο",
        body: "Οι απαντήσεις και οι αποφάσεις βασίζονται σε εγκεκριμένη γνώση, δεδομένα και κανόνες επικύρωσης.",
      },
      {
        number: "02",
        title: "Ελεγχόμενη δράση",
        body: "Οι αυτοματισμοί είναι ιχνηλάσιμοι, ασφαλείς και περιλαμβάνουν ανθρώπινη έγκριση όπου έχει σημασία.",
      },
      {
        number: "03",
        title: "Επαναχρησιμοποιήσιμη αρχιτεκτονική",
        body: "Η φωνητική διεπαφή, το επίπεδο γνώσης, η μηχανή ροών εργασίας, τα αρχεία ελέγχου και οι διασυνδέσεις μπορούν να κλιμακωθούν σε διαφορετικές εφαρμογές.",
      },
    ],
    technologyEyebrow: "Επίσημο τεχνολογικό προφίλ",
    technologyTitle: "Ένα λειτουργικό επίπεδο, πολλαπλές τεχνολογικές ειδικότητες.",
    technology: [
      "Τεχνητή Νοημοσύνη",
      "Υπολογιστικό Νέφος",
      "Ανάλυση Δεδομένων & Μεγάλα Δεδομένα",
      "Μηχανική Λογισμικού",
      "Εφαρμογές Ιστού & Κινητών",
    ],
    teamEyebrow: "Ιδρυτική ομάδα",
    teamTitle: "Τρεις συνιδρυτές. Ένα κοινό όραμα.",
    teamIntro:
      "Η ιδρυτική ομάδα της ENCOMM συνδυάζει επιχειρηματική εμπειρία, τεχνολογική υλοποίηση, σχεδιασμό προϊόντων AI και βαθιά κατανόηση σύνθετων λειτουργικών ροών.",
    team: [
      {
        name: "Charalampos Dedopoulos",
        role: "Συνιδρυτής",
        image: "/team-charalampos-dedopoulos.webp",
        imageAlt: "Ο Charalampos Dedopoulos, συνιδρυτής της ENCOMM",
        socials: {
          github: "https://github.com/Xamposs",
          x: "https://x.com/DedoXampos",
        },
      },
      {
        name: "Vasileios Mitrakoudis",
        role: "Συνιδρυτής",
        image: "/team-vasileios-mitrakoudis.webp",
        imageAlt: "Ο Vasileios Mitrakoudis, συνιδρυτής της ENCOMM",
        socials: {
          github: "https://github.com/Blacknoir",
        },
      },
      {
        name: "Eleftherios Kasapis",
        role: "Συνιδρυτής",
        image: "/team-eleftherios-kasapis.webp",
        imageAlt: "Ο Eleftherios Kasapis, συνιδρυτής της ENCOMM",
        socials: {},
      },
    ],
    ecosystemEyebrow: "Συνεργασίες & οικοσύστημα",
    ecosystemTitle: "Σχεδιασμένο για συνεργασία.",
    ecosystemIntro:
      "Η ENCOMM αναπτύσσει ένα οικοσύστημα γύρω από πιλοτικές υλοποιήσεις, ασφαλείς διασυνδέσεις και λύσεις που μπορούν να κλιμακωθούν σε πραγματική εμπορική χρήση.",
    ecosystem: [
      {
        title: "Πιλοτικές υλοποιήσεις σε δημόσιο & επιχειρήσεις",
        body: "Πραγματικά λειτουργικά περιβάλλοντα όπου οι καθοδηγούμενες ροές AI μειώνουν τη χειροκίνητη εργασία και βελτιώνουν την πρόσβαση σε υπηρεσίες.",
      },
      {
        title: "Συνεργάτες τεχνολογίας & δεδομένων",
        body: "Ασφαλείς διασυνδέσεις, υποδομή και αξιόπιστες πηγές πληροφορίας που κάνουν την πλατφόρμα χρήσιμη στην πράξη.",
      },
      {
        title: "Έρευνα, ασφάλεια & συμμόρφωση",
        body: "Συνεργασία γύρω από την αξιολόγηση, την ιδιωτικότητα, τη διακυβέρνηση και την υπεύθυνη εφαρμογή σε απαιτητικά περιβάλλοντα.",
      },
    ],
    elevateEyebrow: "Elevate Greece",
    elevateTitle: "Μέλος του Εθνικού Μητρώου Νεοφυών Επιχειρήσεων.",
    elevateBody:
      `Η ${company.legalNameEl}, με διακριτικό τίτλο ${company.tradingName}, είναι καταχωρισμένη στο επίσημο μητρώο Elevate Greece, με έδρα τη Θεσσαλονίκη και κλάδο το επιχειρησιακό λογισμικό.`,
    elevateCta: "Δείτε το επίσημο εταιρικό προφίλ",
  },
} as const;

const services: Record<MarketingLanguage, Record<ServiceSlug, ServicePage>> = {
  en: {
    "ai-strategy": {
      index: "01",
      eyebrow: "AI Strategy",
      title: "Choose where AI",
      accent: "creates real leverage.",
      summary:
        "We turn AI ambition into a practical roadmap tied to business value, operational readiness and responsible adoption.",
      promise:
        "A clear decision framework before technology, budget and attention are spread across disconnected experiments.",
      outcomesTitle: "What we solve",
      outcomes: [
        { title: "Priority", body: "Identify the workflows and decisions where AI can create meaningful operational value." },
        { title: "Readiness", body: "Map data, systems, governance, risks and team capabilities before implementation." },
        { title: "Direction", body: "Define a sequenced roadmap from validation and prototype to integration and scale." },
      ],
      deliverablesTitle: "Typical deliverables",
      deliverables: ["AI opportunity map", "Prioritized use-case portfolio", "Data & systems readiness review", "Architecture direction", "Governance and adoption plan", "Pilot definition"],
      processTitle: "How we move",
      process: [
        { number: "01", title: "Discover", body: "Understand the business, friction, decisions and existing technology landscape." },
        { number: "02", title: "Prioritize", body: "Score opportunities by value, feasibility, risk and speed to useful evidence." },
        { number: "03", title: "Design", body: "Shape the target workflows, architecture, guardrails and operating model." },
        { number: "04", title: "Activate", body: "Define a pilot that can prove value and create the foundation for scale." },
      ],
      systemsTitle: "Connected to",
      systems: ["Business strategy", "Operations", "Data", "Security", "Governance", "Change management"],
    },
    "ai-agents": {
      index: "02",
      eyebrow: "AI Agents",
      title: "Digital intelligence",
      accent: "that can act.",
      summary:
        "We design AI agents that understand context, use approved tools and complete multi-step work with people in control.",
      promise:
        "Agents are built as dependable participants in a workflow—not isolated chat experiences.",
      outcomesTitle: "What we solve",
      outcomes: [
        { title: "Knowledge", body: "Retrieve answers from trusted documents, systems, APIs and structured databases." },
        { title: "Execution", body: "Use tools to prepare outputs, update systems and move a task through its next steps." },
        { title: "Control", body: "Add permissions, validation, escalation and human approval around important actions." },
      ],
      deliverablesTitle: "Typical deliverables",
      deliverables: ["Agent architecture", "Knowledge & RAG layer", "Tool and API connections", "Workflow orchestration", "Human approval controls", "Monitoring & evaluation"],
      processTitle: "How we move",
      process: [
        { number: "01", title: "Frame the role", body: "Define what the agent knows, what it can do and where it must stop." },
        { number: "02", title: "Ground the context", body: "Connect verified information, business rules and live operational data." },
        { number: "03", title: "Connect the tools", body: "Give the agent controlled access to the systems required for action." },
        { number: "04", title: "Evaluate & operate", body: "Test behavior, edge cases, safety and day-to-day observability." },
      ],
      systemsTitle: "Connected to",
      systems: ["Documents", "Websites", "CRM", "ERP", "Databases", "Internal tools"],
    },
    "intelligent-automation": {
      index: "03",
      eyebrow: "Intelligent Automation",
      title: "Redesign the flow,",
      accent: "not just the task.",
      summary:
        "We combine rules, AI and integrations to turn fragmented manual work into a dependable end-to-end process.",
      promise:
        "Automation starts with how the work should move, then connects the people, decisions and systems behind it.",
      outcomesTitle: "What we solve",
      outcomes: [
        { title: "Repetition", body: "Remove copy-paste work, manual routing and recurring operational checks." },
        { title: "Fragmentation", body: "Connect steps that currently live across inboxes, spreadsheets and separate systems." },
        { title: "Exceptions", body: "Route uncertainty and high-impact decisions to the right person with full context." },
      ],
      deliverablesTitle: "Typical deliverables",
      deliverables: ["Workflow blueprint", "Rules & decision logic", "AI-assisted processing", "System integrations", "Exception handling", "Audit trail & monitoring"],
      processTitle: "How we move",
      process: [
        { number: "01", title: "Map", body: "See the current process, handoffs, delays, data and decision points." },
        { number: "02", title: "Redesign", body: "Create a simpler target flow with clear automation and approval boundaries." },
        { number: "03", title: "Integrate", body: "Connect the tools, data and actions that make the process continuous." },
        { number: "04", title: "Improve", body: "Measure real behavior and strengthen the workflow over time." },
      ],
      systemsTitle: "Connected to",
      systems: ["Email", "Forms", "ERP", "CRM", "Accounting", "Custom platforms"],
    },
    "erp-ecommerce-integrations": {
      index: "04",
      eyebrow: "ERP & E‑shop Integrations",
      title: "Make every system",
      accent: "work as one.",
      summary:
        "We connect ERP, e-commerce, CRM, warehouses, accounting and custom applications into one reliable operational flow.",
      promise:
        "The right data reaches the right system at the right step—without fragile manual transfers.",
      outcomesTitle: "What we solve",
      outcomes: [
        { title: "Synchronization", body: "Keep products, stock, customers, orders and operational records aligned." },
        { title: "Orchestration", body: "Coordinate multi-system actions from an event, approval or business rule." },
        { title: "Visibility", body: "Track what moved, what failed and where human attention is required." },
      ],
      deliverablesTitle: "Typical deliverables",
      deliverables: ["Integration architecture", "API and data mapping", "ERP connectors", "E-shop workflows", "Queues & retry handling", "Monitoring & alerts"],
      processTitle: "How we move",
      process: [
        { number: "01", title: "Inventory", body: "Map systems, APIs, data ownership, frequency and operational dependencies." },
        { number: "02", title: "Contract", body: "Define schemas, validations, events and the source of truth for every record." },
        { number: "03", title: "Connect", body: "Build resilient flows with retries, logs and safe handling of failure." },
        { number: "04", title: "Operate", body: "Monitor synchronization and evolve the integrations as the business changes." },
      ],
      systemsTitle: "Connected to",
      systems: ["ERP", "E‑shops", "CRM", "WMS", "Accounting", "Marketplaces", "Legacy APIs"],
    },
    "custom-ai-products": {
      index: "05",
      eyebrow: "Custom AI Products",
      title: "Build the product",
      accent: "that does not exist yet.",
      summary:
        "We turn a domain problem into production-ready AI software shaped around your users, knowledge and competitive advantage.",
      promise:
        "Product strategy, experience, AI architecture and engineering move together from the first prototype to daily use.",
      outcomesTitle: "What we solve",
      outcomes: [
        { title: "New product", body: "Shape an AI-native application or SaaS proposition around a validated need." },
        { title: "Internal platform", body: "Build specialized software that transforms how a team delivers its work." },
        { title: "Embedded intelligence", body: "Add useful AI behavior inside an existing digital product and user journey." },
      ],
      deliverablesTitle: "Typical deliverables",
      deliverables: ["Product discovery", "UX & interface design", "AI system architecture", "Full-stack engineering", "Security & guardrails", "Deployment & evolution"],
      processTitle: "How we move",
      process: [
        { number: "01", title: "Validate", body: "Clarify the user, problem, value proposition and evidence required." },
        { number: "02", title: "Prototype", body: "Make the experience and AI behavior tangible with a focused product slice." },
        { number: "03", title: "Engineer", body: "Build the reliable application, intelligence layer, integrations and controls." },
        { number: "04", title: "Launch & learn", body: "Deploy, observe real usage and evolve the product from evidence." },
      ],
      systemsTitle: "Built with",
      systems: ["AI & ML", "Web applications", "Mobile experiences", "Cloud infrastructure", "APIs", "Analytics"],
    },
  },
  el: {
    "ai-strategy": {
      index: "01",
      eyebrow: "Στρατηγική AI",
      title: "Επιλέξτε πού το AI",
      accent: "δημιουργεί πραγματική αξία.",
      summary:
        "Μετατρέπουμε τη φιλοδοξία γύρω από το AI σε πρακτικό οδικό χάρτη, συνδεδεμένο με επιχειρηματική αξία, λειτουργική ετοιμότητα και υπεύθυνη υιοθέτηση.",
      promise:
        "Ένα καθαρό πλαίσιο αποφάσεων πριν από τη διάθεση τεχνολογίας, προϋπολογισμού και προσοχής σε ασύνδετα πειράματα.",
      outcomesTitle: "Τι λύνουμε",
      outcomes: [
        { title: "Προτεραιότητα", body: "Εντοπίζουμε τις ροές και τις αποφάσεις όπου το AI μπορεί να δημιουργήσει ουσιαστική λειτουργική αξία." },
        { title: "Ετοιμότητα", body: "Χαρτογραφούμε δεδομένα, συστήματα, διακυβέρνηση, κινδύνους και δυνατότητες της ομάδας πριν από την υλοποίηση." },
        { title: "Κατεύθυνση", body: "Ορίζουμε έναν οδικό χάρτη από την επικύρωση και το πρωτότυπο μέχρι την ενσωμάτωση και την κλιμάκωση." },
      ],
      deliverablesTitle: "Συνήθη παραδοτέα",
      deliverables: ["Χάρτης ευκαιριών AI", "Ιεραρχημένο σύνολο περιπτώσεων χρήσης", "Έλεγχος ετοιμότητας δεδομένων & συστημάτων", "Κατεύθυνση αρχιτεκτονικής", "Πλάνο διακυβέρνησης και υιοθέτησης", "Ορισμός πιλοτικής υλοποίησης"],
      processTitle: "Πώς προχωράμε",
      process: [
        { number: "01", title: "Ανακάλυψη", body: "Κατανοούμε την επιχείρηση, τις τριβές, τις αποφάσεις και το υπάρχον τεχνολογικό τοπίο." },
        { number: "02", title: "Ιεράρχηση", body: "Αξιολογούμε τις ευκαιρίες με βάση την αξία, την εφικτότητα, τον κίνδυνο και την ταχύτητα τεκμηρίωσης." },
        { number: "03", title: "Σχεδιασμός", body: "Ορίζουμε τις ροές-στόχους, την αρχιτεκτονική, τις δικλίδες και το λειτουργικό μοντέλο." },
        { number: "04", title: "Ενεργοποίηση", body: "Καθορίζουμε μια πιλοτική υλοποίηση που αποδεικνύει την αξία και δημιουργεί τη βάση για κλιμάκωση." },
      ],
      systemsTitle: "Συνδέεται με",
      systems: ["Επιχειρηματική στρατηγική", "Λειτουργίες", "Δεδομένα", "Ασφάλεια", "Διακυβέρνηση", "Διαχείριση αλλαγών"],
    },
    "ai-agents": {
      index: "02",
      eyebrow: "Πράκτορες AI",
      title: "Ψηφιακή νοημοσύνη",
      accent: "που μπορεί να δράσει.",
      summary:
        "Σχεδιάζουμε πράκτορες AI που κατανοούν το πλαίσιο, χρησιμοποιούν εγκεκριμένα εργαλεία και ολοκληρώνουν εργασίες πολλαπλών βημάτων, με τον άνθρωπο να διατηρεί τον έλεγχο.",
      promise:
        "Οι πράκτορες σχεδιάζονται ως αξιόπιστοι συμμετέχοντες σε μια ροή εργασίας — όχι ως απομονωμένες εμπειρίες συνομιλίας.",
      outcomesTitle: "Τι λύνουμε",
      outcomes: [
        { title: "Γνώση", body: "Ανάκτηση απαντήσεων από αξιόπιστα έγγραφα, συστήματα, διεπαφές API και δομημένες βάσεις δεδομένων." },
        { title: "Εκτέλεση", body: "Χρήση εργαλείων για προετοιμασία αποτελεσμάτων, ενημέρωση συστημάτων και προώθηση εργασιών." },
        { title: "Έλεγχος", body: "Δικαιώματα, επικυρώσεις, κλιμάκωση και ανθρώπινη έγκριση γύρω από σημαντικές ενέργειες." },
      ],
      deliverablesTitle: "Συνήθη παραδοτέα",
      deliverables: ["Αρχιτεκτονική πράκτορα", "Επίπεδο γνώσης & RAG", "Συνδέσεις εργαλείων και API", "Ενορχήστρωση ροών εργασίας", "Έλεγχοι ανθρώπινης έγκρισης", "Παρακολούθηση & αξιολόγηση"],
      processTitle: "Πώς προχωράμε",
      process: [
        { number: "01", title: "Ορισμός ρόλου", body: "Ορίζουμε τι γνωρίζει ο πράκτορας, τι μπορεί να κάνει και πού πρέπει να σταματά." },
        { number: "02", title: "Θεμελίωση πλαισίου", body: "Συνδέουμε επαληθευμένες πληροφορίες, επιχειρηματικούς κανόνες και δεδομένα πραγματικού χρόνου." },
        { number: "03", title: "Σύνδεση εργαλείων", body: "Δίνουμε ελεγχόμενη πρόσβαση στα συστήματα που απαιτούνται για δράση." },
        { number: "04", title: "Αξιολόγηση & λειτουργία", body: "Ελέγχουμε τη συμπεριφορά, τις οριακές περιπτώσεις, την ασφάλεια και την καθημερινή εποπτεία." },
      ],
      systemsTitle: "Συνδέεται με",
      systems: ["Έγγραφα", "Ιστοσελίδες", "CRM", "ERP", "Βάσεις δεδομένων", "Εσωτερικά εργαλεία"],
    },
    "intelligent-automation": {
      index: "03",
      eyebrow: "Ευφυείς Αυτοματισμοί",
      title: "Επανασχεδιάστε τη ροή,",
      accent: "όχι μόνο την εργασία.",
      summary:
        "Συνδυάζουμε κανόνες, AI και διασυνδέσεις για να μετατρέψουμε την κατακερματισμένη χειροκίνητη εργασία σε αξιόπιστη διαδικασία από άκρη σε άκρη.",
      promise:
        "Ο αυτοματισμός ξεκινά από το πώς πρέπει να κινείται η εργασία και μετά συνδέει ανθρώπους, αποφάσεις και συστήματα.",
      outcomesTitle: "Τι λύνουμε",
      outcomes: [
        { title: "Επανάληψη", body: "Καταργούμε την αντιγραφή και επικόλληση, τη χειροκίνητη δρομολόγηση και τους επαναλαμβανόμενους ελέγχους." },
        { title: "Κατακερματισμός", body: "Συνδέουμε βήματα που σήμερα βρίσκονται σε εισερχόμενα email, υπολογιστικά φύλλα και ξεχωριστά συστήματα." },
        { title: "Εξαιρέσεις", body: "Δρομολογούμε την αβεβαιότητα και τις κρίσιμες αποφάσεις στον σωστό άνθρωπο με όλο το πλαίσιο." },
      ],
      deliverablesTitle: "Συνήθη παραδοτέα",
      deliverables: ["Σχεδιάγραμμα ροής εργασίας", "Κανόνες & λογική αποφάσεων", "Επεξεργασία με υποστήριξη AI", "Διασυνδέσεις συστημάτων", "Διαχείριση εξαιρέσεων", "Ίχνος ελέγχου & παρακολούθηση"],
      processTitle: "Πώς προχωράμε",
      process: [
        { number: "01", title: "Χαρτογράφηση", body: "Αποτυπώνουμε την τρέχουσα διαδικασία, τις παραδόσεις μεταξύ ομάδων, τις καθυστερήσεις, τα δεδομένα και τις αποφάσεις." },
        { number: "02", title: "Επανασχεδιασμός", body: "Δημιουργούμε απλούστερη ροή με καθαρά όρια αυτοματισμού και έγκρισης." },
        { number: "03", title: "Ενσωμάτωση", body: "Συνδέουμε εργαλεία, δεδομένα και ενέργειες ώστε η διαδικασία να είναι συνεχής." },
        { number: "04", title: "Βελτίωση", body: "Μετράμε την πραγματική λειτουργία και ενισχύουμε τη ροή με τον χρόνο." },
      ],
      systemsTitle: "Συνδέεται με",
      systems: ["Email", "Φόρμες", "ERP", "CRM", "Λογιστική", "Εξατομικευμένες πλατφόρμες"],
    },
    "erp-ecommerce-integrations": {
      index: "04",
      eyebrow: "Διασυνδέσεις ERP & E‑shop",
      title: "Κάντε κάθε σύστημα",
      accent: "να λειτουργεί ως ένα.",
      summary:
        "Συνδέουμε ERP, ηλεκτρονικά καταστήματα, CRM, αποθήκες, λογιστική και εξατομικευμένες εφαρμογές σε μία αξιόπιστη λειτουργική ροή.",
      promise:
        "Τα σωστά δεδομένα φτάνουν στο σωστό σύστημα, στο σωστό βήμα — χωρίς εύθραυστες χειροκίνητες μεταφορές.",
      outcomesTitle: "Τι λύνουμε",
      outcomes: [
        { title: "Συγχρονισμός", body: "Διατηρούμε προϊόντα, αποθέματα, πελάτες, παραγγελίες και λειτουργικά αρχεία ευθυγραμμισμένα." },
        { title: "Ενορχήστρωση", body: "Συντονίζουμε ενέργειες σε πολλά συστήματα με αφετηρία ένα συμβάν, μια έγκριση ή έναν επιχειρηματικό κανόνα." },
        { title: "Ορατότητα", body: "Παρακολουθούμε τι μετακινήθηκε, τι απέτυχε και πού απαιτείται ανθρώπινη προσοχή." },
      ],
      deliverablesTitle: "Συνήθη παραδοτέα",
      deliverables: ["Αρχιτεκτονική διασυνδέσεων", "API και αντιστοίχιση δεδομένων", "Διασυνδέσεις ERP", "Ροές ηλεκτρονικού καταστήματος", "Ουρές & επαναλήψεις αποτυχημένων ενεργειών", "Παρακολούθηση & ειδοποιήσεις"],
      processTitle: "Πώς προχωράμε",
      process: [
        { number: "01", title: "Απογραφή", body: "Χαρτογραφούμε συστήματα, διεπαφές API, κυριότητα δεδομένων, συχνότητα και λειτουργικές εξαρτήσεις." },
        { number: "02", title: "Συμβόλαιο δεδομένων", body: "Ορίζουμε σχήματα, επικυρώσεις, συμβάντα και τη μοναδική αξιόπιστη πηγή για κάθε εγγραφή." },
        { number: "03", title: "Σύνδεση", body: "Χτίζουμε ανθεκτικές ροές με επαναλήψεις, αρχεία καταγραφής και ασφαλή διαχείριση αποτυχιών." },
        { number: "04", title: "Λειτουργία", body: "Παρακολουθούμε τον συγχρονισμό και εξελίσσουμε τις διασυνδέσεις μαζί με την επιχείρηση." },
      ],
      systemsTitle: "Συνδέεται με",
      systems: ["ERP", "Ηλεκτρονικά καταστήματα", "CRM", "WMS", "Λογιστική", "Ηλεκτρονικές αγορές", "Παλαιότερες διεπαφές API"],
    },
    "custom-ai-products": {
      index: "05",
      eyebrow: "Εξατομικευμένα Προϊόντα AI",
      title: "Δημιουργήστε το προϊόν",
      accent: "που δεν υπάρχει ακόμη.",
      summary:
        "Μετατρέπουμε ένα πρόβλημα του κλάδου σας σε λογισμικό AI έτοιμο για παραγωγική λειτουργία, σχεδιασμένο γύρω από τους χρήστες, τη γνώση και το ανταγωνιστικό σας πλεονέκτημα.",
      promise:
        "Η στρατηγική προϊόντος, η εμπειρία χρήσης, η αρχιτεκτονική AI και η μηχανική λογισμικού εξελίσσονται μαζί από το πρώτο πρωτότυπο μέχρι την καθημερινή χρήση.",
      outcomesTitle: "Τι λύνουμε",
      outcomes: [
        { title: "Νέο προϊόν", body: "Σχεδιάζουμε μια εφαρμογή που βασίζεται εξαρχής στο AI ή μια πρόταση SaaS γύρω από μια επικυρωμένη ανάγκη." },
        { title: "Εσωτερική πλατφόρμα", body: "Χτίζουμε εξειδικευμένο λογισμικό που μεταμορφώνει τον τρόπο εργασίας μιας ομάδας." },
        { title: "Ενσωματωμένη νοημοσύνη", body: "Προσθέτουμε χρήσιμη συμπεριφορά AI μέσα σε ένα υπάρχον ψηφιακό προϊόν και στη διαδρομή του χρήστη." },
      ],
      deliverablesTitle: "Συνήθη παραδοτέα",
      deliverables: ["Διερεύνηση προϊόντος", "Σχεδιασμός εμπειρίας & διεπαφής", "Αρχιτεκτονική συστήματος AI", "Πλήρης ανάπτυξη λογισμικού", "Ασφάλεια & δικλίδες", "Παραγωγική λειτουργία & εξέλιξη"],
      processTitle: "Πώς προχωράμε",
      process: [
        { number: "01", title: "Επικύρωση", body: "Ξεκαθαρίζουμε τον χρήστη, το πρόβλημα, την πρόταση αξίας και τα στοιχεία που απαιτούνται." },
        { number: "02", title: "Πρωτότυπο", body: "Κάνουμε την εμπειρία και τη συμπεριφορά του AI απτές μέσα από ένα εστιασμένο, λειτουργικό τμήμα του προϊόντος." },
        { number: "03", title: "Υλοποίηση", body: "Χτίζουμε την αξιόπιστη εφαρμογή, το επίπεδο νοημοσύνης, τις διασυνδέσεις και τους ελέγχους." },
        { number: "04", title: "Διάθεση & βελτίωση", body: "Θέτουμε το προϊόν σε παραγωγική λειτουργία, παρατηρούμε την πραγματική χρήση και το εξελίσσουμε με βάση τα στοιχεία." },
      ],
      systemsTitle: "Χτίζεται με",
      systems: ["AI & ML", "Εφαρμογές ιστού", "Εφαρμογές για κινητές συσκευές", "Υποδομή νέφους", "Διεπαφές API", "Ανάλυση δεδομένων"],
    },
  },
};

export const marketingPages = {
  en: {
    chrome: sharedChrome.en,
    about: about.en,
    services: services.en,
  },
  el: {
    chrome: sharedChrome.el,
    about: about.el,
    services: services.el,
  },
} as const;

export const serviceLinks = serviceSlugs.map((slug) => ({
  slug,
  href: `/services/${slug}`,
}));
