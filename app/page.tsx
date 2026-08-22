"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { FaGithub, FaLinkedinIn, FaXTwitter, FaYoutube } from "react-icons/fa6";
import { LanguageToggle } from "@/components/ui/LanguageToggle";
import { LocalizedSkipLink } from "@/components/ui/LocalizedSkipLink";
import { useLanguage } from "@/lib/i18n";
import { company } from "@/content/company";

const pageCopy = {
  en: {
    nav: {
      label: "Main navigation",
      about: "About",
      capabilities: "Capabilities",
      projects: "Projects",
      integrations: "Integrations",
      method: "Method",
      project: "Start a project",
      capabilitiesIntro: "Explore the systems we design and deliver.",
      menu: "Menu",
      close: "Close",
    },
    hero: {
      kicker: "Enterprise AI / Thessaloniki",
      titleOne: "AI WITH",
      titleTwo: "INTENT.",
      intro:
        "We design intelligent systems that understand your business, move work forward and create lasting advantage.",
      explore: "Explore what we build",
      faceLabel: "A pearl-white synthetic intelligence",
      faceAlt: "Pearl-white synthetic intelligence portrait",
      context: "CONTEXT",
      connected: "CONNECTED",
      control: "CONTROL",
      human: "HUMAN",
      watermark: ["THINKS", "MOVES", "EVOLVES"],
      reality: "Built for reality, not the demo.",
      scroll: "Scroll to activate the intelligence",
    },
    ticker: ["STRATEGY", "AGENTS", "AUTOMATION", "PRODUCTS"],
    manifesto: {
      index: "A point of view",
      title: "The future is not more software.",
      accent: " It is software that understands.",
      bodyOne:
        "ENCOMM brings strategy, design and engineering together to build AI that fits the way an organization actually works.",
      bodyTwo:
        "Useful on day one. Trusted over time. Designed to keep learning.",
      steps: ["UNDERSTAND", "DECIDE", "ACT"],
    },
    capabilitiesHeading: {
      index: "What we build",
      title: "Intelligence,",
      accent: "end to end.",
      body:
        "One partner from the first business question to the system people use every day.",
    },
    capabilities: [
      {
        number: "01",
        href: "/services/ai-strategy",
        title: "AI Strategy",
        label: "Find the leverage",
        body: "We turn scattered AI ambition into a focused roadmap built around value, adoption and responsible scale.",
        tags: ["Discovery", "Roadmaps", "Governance"],
        visual: "signal",
      },
      {
        number: "02",
        href: "/services/ai-agents",
        title: "AI Agents",
        label: "Intelligence that acts",
        body: "Digital teams that understand context, use tools and complete work—with people in control.",
        tags: ["Agents", "RAG", "Orchestration"],
        visual: "agents",
      },
      {
        number: "03",
        href: "/services/intelligent-automation",
        title: "Intelligent Automation",
        label: "Redesign the workflow",
        body: "Reliable AI woven through your operations, connecting decisions, data and action end to end.",
        tags: ["Automation", "Integrations", "Human-in-loop"],
        visual: "flow",
      },
      {
        number: "04",
        href: "/services/erp-ecommerce-integrations",
        title: "ERP & E-shop Integrations",
        label: "Connect every system",
        body: "Reliable data and workflow connections across ERP, e-commerce, CRM, warehouses, accounting and custom platforms.",
        tags: ["ERP", "E-commerce", "APIs"],
        visual: "integration",
      },
      {
        number: "05",
        href: "/services/custom-ai-products",
        title: "Custom AI Products",
        label: "Build what does not exist",
        body: "Production-ready AI products shaped around your domain, your knowledge and your competitive edge.",
        tags: ["Product", "ML engineering", "Deployment"],
        visual: "product",
      },
    ],
    projects: {
      index: "Selected work",
      title: "Products already",
      accent: "in the real world.",
      body:
        "Two live digital products designed and built by ENCOMM — from AI-powered health experiences to a complete dental booking platform.",
      slots: [
        {
          number: "P—01",
          label: "AI Health & Fitness Platform",
          title: "NutriVue",
          body: "A personalized nutrition and fitness product with AI analysis, tailored plans, body insights and progress tracking.",
          image: "/project-nutrivue.png",
          alt: "NutriVue personalized nutrition and fitness platform",
          url: "https://www.nutrivue.gr/",
        },
        {
          number: "P—02",
          label: "Dental Marketplace & Booking Platform",
          title: "Dentora",
          body: "A live platform for discovering dentists, exploring treatments and booking appointments through a complete patient journey.",
          image: "/project-dentora.png",
          alt: "Dentora dental discovery and appointment booking platform",
          url: "https://www.dentora.gr/",
        },
      ],
      live: "Live product",
      visit: "Visit live application",
    },
    operations: {
      index: "Connected operations",
      title: "From ERP to e-shops.",
      accent: "Everything can work as one.",
      body:
        "We can design almost any digital system and connect the technology you already use — automating data, decisions and workflows from ERP and CRM to e-commerce, warehouses and custom platforms.",
      systems: ["ERP", "CRM", "E-SHOPS", "WMS", "ACCOUNTING", "APIs", "LEGACY", "CUSTOM APPS"],
      core: "ENCOMM CORE",
      flow: "ONE INTELLIGENT FLOW",
      powered: "POWERED BY ENCOMM",
    },
    room: {
      index: "The intelligence layer",
      titleOne: "One system.",
      titleTwo: "Many minds.",
      body:
        "Models, business context and human judgment orchestrated as one dependable operating layer.",
      assurance: ["Model agnostic", "Secure by design", "Human in command"],
      mapLabel: "AI orchestration diagram",
      mapTitle: "ENCOMM / INTELLIGENCE MAP",
      live: "LIVE",
      nodes: ["DATA", "PEOPLE", "TOOLS", "ACTION"],
      status: ["04 SOURCES", "12 TOOLS", "GUARDRAILS ACTIVE"],
    },
    method: {
      index: "How we work",
      titleOne: "Built to move.",
      titleTwo: "Made to last.",
      process: [
        ["01", "Frame", "Define the decision, the friction and the value behind it."],
        ["02", "Prototype", "Make the future tangible quickly, with real workflows and data."],
        ["03", "Operationalize", "Engineer the system, controls and integrations for daily use."],
        ["04", "Compound", "Measure, learn and make the intelligence stronger over time."],
      ],
    },
    contact: {
      index: "Start with a question",
      titleOne: "What should",
      titleTwo: "think better?",
      body: "Tell us the decision, workflow or product you want to transform.",
      cta: "Start a conversation",
      subject: "AI project with ENCOMM",
      emailLabel: "Direct contact",
      email: "info@encomm.ai",
    },
    contactForm: {
      eyebrow: "New project / ENCOMM",
      title: "Tell us what should work better.",
      body: "Share the workflow, system or product you want to transform. Your message will be delivered securely to the ENCOMM team.",
      name: "Your name",
      email: "Work email",
      company: "Company",
      brief: "What do you want to build or automate?",
      placeholderName: "Name and surname",
      placeholderEmail: "you@company.com",
      placeholderCompany: "Company name",
      placeholderBrief: "ERP integration, AI agent, e-shop automation…",
      submit: "Send project brief",
      submitting: "Sending securely…",
      direct: "Or contact us directly",
      copied: "Email copied",
      copy: "Copy email",
      close: "Close contact form",
      privacyBefore: "I have read the",
      privacyLink: "Privacy Notice",
      privacyAfter: "and understand how ENCOMM will use my information to respond.",
      success: "Your message has been sent. We will be in touch shortly.",
      genericError: "We could not send your message. Please try again or email us directly.",
    },
    footer: {
      line: "Enterprise intelligence, engineered in Greece.",
      top: "Back to top ↑",
      powered: "Powered by ENCOMM",
      statement: "Intelligence that moves the business forward.",
      statementBody: "Strategy, AI systems and connected operations — designed as one dependable capability.",
      location: "Thessaloniki, Greece",
      capabilities: "Intelligence",
      work: "Work",
      company: "Company",
      support: "Support",
      projects: "Projects",
      integrations: "ERP & integrations",
      method: "Method",
      thinking: "Our thinking",
      contact: "Start a project",
      privacy: "Privacy",
      terms: "Terms",
      cookies: "Cookies",
      sitemap: "Sitemap",
      about: "About ENCOMM",
      elevateEyebrow: "National Startup Registry",
      elevateTitle: "Registered member of Elevate Greece",
      socialSoon: "Link coming soon",
      registeredName: "ENCOMM P.C.",
      gemi: "G.E.MI.",
      vat: "Greek VAT",
    },
  },
  el: {
    nav: {
      label: "Κύρια πλοήγηση",
      about: "Η εταιρεία",
      capabilities: "Δυνατότητες",
      projects: "Έργα",
      integrations: "Διασυνδέσεις",
      method: "Μέθοδος",
      project: "Ξεκινήστε ένα έργο",
      capabilitiesIntro: "Δείτε τα συστήματα που σχεδιάζουμε και υλοποιούμε.",
      menu: "Μενού",
      close: "Κλείσιμο",
    },
    hero: {
      kicker: "Επιχειρησιακό AI / Θεσσαλονίκη",
      titleOne: "AI ΜΕ",
      titleTwo: "ΠΡΟΘΕΣΗ.",
      intro:
        "Σχεδιάζουμε ευφυή συστήματα που κατανοούν την επιχείρησή σας, επιταχύνουν τις ροές εργασίας και δημιουργούν διαρκές πλεονέκτημα.",
      explore: "Δείτε τι δημιουργούμε",
      faceLabel: "Μια συνθετική νοημοσύνη σε λευκό μαργαριταρένιο τόνο",
      faceAlt: "Πορτρέτο συνθετικής νοημοσύνης",
      context: "ΠΛΑΙΣΙΟ",
      connected: "ΣΥΝΔΕΔΕΜΕΝΟ",
      control: "ΕΛΕΓΧΟΣ",
      human: "ΑΝΘΡΩΠΟΣ",
      watermark: ["ΣΚΕΦΤΕΤΑΙ", "ΚΙΝΕΙΤΑΙ", "ΕΞΕΛΙΣΣΕΤΑΙ"],
      reality: "Σχεδιασμένο για την πραγματικότητα, όχι μόνο για την επίδειξη.",
      scroll: "Κυλήστε τη σελίδα για να ενεργοποιηθεί η νοημοσύνη",
    },
    ticker: ["ΣΤΡΑΤΗΓΙΚΗ", "ΠΡΑΚΤΟΡΕΣ", "ΑΥΤΟΜΑΤΙΣΜΟΙ", "ΠΡΟΪΟΝΤΑ"],
    manifesto: {
      index: "Η οπτική μας",
      title: "Το μέλλον δεν χρειάζεται περισσότερο λογισμικό.",
      accent: " Χρειάζεται λογισμικό που κατανοεί.",
      bodyOne:
        "Η ENCOMM ενώνει στρατηγική, σχεδιασμό και μηχανική για να δημιουργεί συστήματα AI που ταιριάζουν στον τρόπο με τον οποίο λειτουργεί πραγματικά ένας οργανισμός.",
      bodyTwo:
        "Χρήσιμο από την πρώτη ημέρα. Αξιόπιστο στον χρόνο. Σχεδιασμένο για να μαθαίνει.",
      steps: ["ΚΑΤΑΝΟΗΣΗ", "ΑΠΟΦΑΣΗ", "ΔΡΑΣΗ"],
    },
    capabilitiesHeading: {
      index: "Τι δημιουργούμε",
      title: "Νοημοσύνη,",
      accent: "από άκρη σε άκρη.",
      body:
        "Ένας συνεργάτης από την πρώτη επιχειρηματική ερώτηση μέχρι το σύστημα που χρησιμοποιούν καθημερινά οι άνθρωποί σας.",
    },
    capabilities: [
      {
        number: "01",
        href: "/services/ai-strategy",
        title: "Στρατηγική AI",
        label: "Εντοπίστε τη μεγαλύτερη αξία",
        body: "Μετατρέπουμε τις διάσπαρτες ιδέες και πρωτοβουλίες γύρω από το AI σε έναν εστιασμένο οδικό χάρτη αξίας, υιοθέτησης και υπεύθυνης κλιμάκωσης.",
        tags: ["Διερεύνηση", "Οδικός χάρτης", "Διακυβέρνηση"],
        visual: "signal",
      },
      {
        number: "02",
        href: "/services/ai-agents",
        title: "Πράκτορες AI",
        label: "Νοημοσύνη που δρα",
        body: "Ψηφιακές ομάδες που κατανοούν το πλαίσιο, χρησιμοποιούν εργαλεία και ολοκληρώνουν εργασίες — με τον άνθρωπο να διατηρεί τον έλεγχο.",
        tags: ["Πράκτορες", "RAG", "Ενορχήστρωση"],
        visual: "agents",
      },
      {
        number: "03",
        href: "/services/intelligent-automation",
        title: "Ευφυείς Αυτοματισμοί",
        label: "Επανασχεδιάστε τη ροή",
        body: "Αξιόπιστο AI ενσωματωμένο στις λειτουργίες σας, που συνδέει αποφάσεις, δεδομένα και δράση από άκρη σε άκρη.",
        tags: ["Αυτοματισμοί", "Διασυνδέσεις", "Ανθρώπινος έλεγχος"],
        visual: "flow",
      },
      {
        number: "04",
        href: "/services/erp-ecommerce-integrations",
        title: "Διασυνδέσεις ERP & E-shop",
        label: "Συνδέστε κάθε σύστημα",
        body: "Αξιόπιστες συνδέσεις δεδομένων και ροών ανάμεσα σε ERP, ηλεκτρονικά καταστήματα, CRM, αποθήκες, λογιστική και εξατομικευμένες πλατφόρμες.",
        tags: ["ERP", "Ηλεκτρονικό εμπόριο", "API"],
        visual: "integration",
      },
      {
        number: "05",
        href: "/services/custom-ai-products",
        title: "Εξατομικευμένα Προϊόντα AI",
        label: "Δημιουργήστε ό,τι δεν υπάρχει",
        body: "Προϊόντα AI έτοιμα για παραγωγική λειτουργία, σχεδιασμένα γύρω από τον τομέα, τη γνώση και το ανταγωνιστικό σας πλεονέκτημα.",
        tags: ["Προϊόν", "Μηχανική ML", "Παραγωγική λειτουργία"],
        visual: "product",
      },
    ],
    projects: {
      index: "Επιλεγμένα έργα",
      title: "Προϊόντα σε λειτουργία",
      accent: "στην πραγματική αγορά.",
      body:
        "Δύο ψηφιακά προϊόντα σε παραγωγική λειτουργία, σχεδιασμένα και υλοποιημένα από την ENCOMM — από μια εμπειρία υγείας με AI έως μια ολοκληρωμένη πλατφόρμα οδοντιατρικών ραντεβού.",
      slots: [
        {
          number: "P—01",
          label: "Πλατφόρμα AI για Υγεία & Άσκηση",
          title: "NutriVue",
          body: "Εξατομικευμένο προϊόν διατροφής και άσκησης με ανάλυση AI, προσαρμοσμένα πλάνα, μετρήσεις σώματος και παρακολούθηση προόδου.",
          image: "/project-nutrivue.png",
          alt: "Πλατφόρμα εξατομικευμένης διατροφής και άσκησης NutriVue",
          url: "https://www.nutrivue.gr/",
        },
        {
          number: "P—02",
          label: "Πλατφόρμα Οδοντιάτρων & Ραντεβού",
          title: "Dentora",
          body: "Ενεργή πλατφόρμα αναζήτησης οδοντιάτρων, εξερεύνησης θεραπειών και κράτησης ραντεβού με ολοκληρωμένη εμπειρία ασθενούς.",
          image: "/project-dentora.png",
          alt: "Πλατφόρμα αναζήτησης οδοντιάτρων και ραντεβού Dentora",
          url: "https://www.dentora.gr/",
        },
      ],
      live: "Ενεργό προϊόν",
      visit: "Δείτε την εφαρμογή",
    },
    operations: {
      index: "Συνδεδεμένες λειτουργίες",
      title: "Από το ERP έως τα ηλεκτρονικά καταστήματα.",
      accent: "Τα πάντα μπορούν να λειτουργούν ως ένα.",
      body:
        "Μπορούμε να σχεδιάσουμε σχεδόν οποιοδήποτε ψηφιακό σύστημα και να συνδέσουμε την τεχνολογία που ήδη χρησιμοποιείτε — αυτοματοποιώντας δεδομένα, αποφάσεις και ροές από συστήματα ERP και CRM έως ηλεκτρονικά καταστήματα, αποθήκες και εξατομικευμένες πλατφόρμες.",
      systems: ["ERP", "CRM", "E-SHOPS", "WMS", "ΛΟΓΙΣΤΙΚΗ", "API", "ΠΑΛΑΙΑ ΣΥΣΤΗΜΑΤΑ", "ΕΞΑΤΟΜΙΚΕΥΜΕΝΕΣ ΕΦΑΡΜΟΓΕΣ"],
      core: "ΠΥΡΗΝΑΣ ENCOMM",
      flow: "ΜΙΑ ΕΥΦΥΗΣ ΡΟΗ",
      powered: "ΜΕ ΤΗΝ ΥΠΟΓΡΑΦΗ ΤΗΣ ENCOMM",
    },
    room: {
      index: "Το επίπεδο νοημοσύνης",
      titleOne: "Ένα σύστημα.",
      titleTwo: "Πολλά μυαλά.",
      body:
        "Ενορχηστρώνουμε μοντέλα, επιχειρηματικό πλαίσιο και ανθρώπινη κρίση σε ένα αξιόπιστο λειτουργικό επίπεδο.",
      assurance: ["Ανεξάρτητο από μοντέλο", "Ασφάλεια από τον σχεδιασμό", "Ο άνθρωπος στον έλεγχο"],
      mapLabel: "Διάγραμμα ενορχήστρωσης AI",
      mapTitle: "ENCOMM / ΧΑΡΤΗΣ ΝΟΗΜΟΣΥΝΗΣ",
      live: "ΕΝΕΡΓΟ",
      nodes: ["ΔΕΔΟΜΕΝΑ", "ΑΝΘΡΩΠΟΙ", "ΕΡΓΑΛΕΙΑ", "ΔΡΑΣΗ"],
      status: ["04 ΠΗΓΕΣ", "12 ΕΡΓΑΛΕΙΑ", "ΔΙΚΛΙΔΕΣ ΕΝΕΡΓΕΣ"],
    },
    method: {
      index: "Πώς εργαζόμαστε",
      titleOne: "Σχεδιασμένο να εξελίσσεται.",
      titleTwo: "Υλοποιημένο για να διαρκεί.",
      process: [
        ["01", "Πλαίσιο", "Ορίζουμε την απόφαση, την τριβή και την αξία πίσω από αυτήν."],
        ["02", "Πρωτότυπο", "Κάνουμε γρήγορα τη λύση απτή, με πραγματικές ροές και δεδομένα."],
        ["03", "Λειτουργία", "Σχεδιάζουμε και υλοποιούμε το σύστημα, τους ελέγχους και τις διασυνδέσεις για καθημερινή χρήση."],
        ["04", "Εξέλιξη", "Μετράμε, μαθαίνουμε και κάνουμε τη νοημοσύνη ισχυρότερη με τον χρόνο."],
      ],
    },
    contact: {
      index: "Ξεκινήστε με μια ερώτηση",
      titleOne: "Τι θα μπορούσε",
      titleTwo: "να λειτουργεί πιο έξυπνα;",
      body: "Πείτε μας την απόφαση, τη ροή εργασίας ή το προϊόν που θέλετε να μεταμορφώσετε.",
      cta: "Ξεκινήστε μια συζήτηση",
      subject: "Έργο AI με την ENCOMM",
      emailLabel: "Άμεση επικοινωνία",
      email: "info@encomm.ai",
    },
    contactForm: {
      eyebrow: "Νέο έργο / ENCOMM",
      title: "Πείτε μας τι πρέπει να λειτουργεί καλύτερα.",
      body: "Περιγράψτε τη ροή, το σύστημα ή το προϊόν που θέλετε να μεταμορφώσετε. Το μήνυμα θα σταλεί με ασφάλεια στην ομάδα της ENCOMM.",
      name: "Ονοματεπώνυμο",
      email: "Επαγγελματικό email",
      company: "Εταιρεία",
      brief: "Τι θέλετε να δημιουργήσουμε ή να αυτοματοποιήσουμε;",
      placeholderName: "Όνομα και επώνυμο",
      placeholderEmail: "you@company.com",
      placeholderCompany: "Επωνυμία εταιρείας",
      placeholderBrief: "Διασύνδεση ERP, πράκτορας AI, αυτοματοποίηση ηλεκτρονικού καταστήματος…",
      submit: "Αποστολή περιγραφής έργου",
      submitting: "Ασφαλής αποστολή…",
      direct: "Ή επικοινωνήστε απευθείας",
      copied: "Το email αντιγράφηκε",
      copy: "Αντιγραφή email",
      close: "Κλείσιμο φόρμας επικοινωνίας",
      privacyBefore: "Έχω διαβάσει την",
      privacyLink: "Πολιτική Απορρήτου",
      privacyAfter: "και κατανοώ πώς η ENCOMM θα χρησιμοποιήσει τα στοιχεία μου για να απαντήσει.",
      success: "Το μήνυμα στάλθηκε. Θα επικοινωνήσουμε σύντομα μαζί σας.",
      genericError: "Δεν μπορέσαμε να στείλουμε το μήνυμα. Δοκιμάστε ξανά ή στείλτε μας απευθείας email.",
    },
    footer: {
      line: "Επιχειρησιακή νοημοσύνη, σχεδιασμένη στην Ελλάδα.",
      top: "Επιστροφή στην κορυφή ↑",
      powered: "Με την υπογραφή της ENCOMM",
      statement: "Νοημοσύνη που κινεί την επιχείρηση μπροστά.",
      statementBody: "Στρατηγική, συστήματα AI και συνδεδεμένες λειτουργίες — σχεδιασμένα ως μία αξιόπιστη δυνατότητα.",
      location: "Θεσσαλονίκη, Ελλάδα",
      capabilities: "Νοημοσύνη",
      work: "Έργα",
      company: "Εταιρεία",
      support: "Υποστήριξη",
      projects: "Έργα",
      integrations: "ERP & διασυνδέσεις",
      method: "Μέθοδος",
      thinking: "Η φιλοσοφία μας",
      contact: "Ξεκινήστε ένα έργο",
      privacy: "Απόρρητο",
      terms: "Όροι",
      cookies: "Πολιτική Cookies",
      sitemap: "Χάρτης ιστοτόπου",
      about: "Σχετικά με την ENCOMM",
      elevateEyebrow: "Εθνικό Μητρώο Νεοφυών Επιχειρήσεων",
      elevateTitle: "Εγγεγραμμένο μέλος του Elevate Greece",
      socialSoon: "Ο σύνδεσμος θα προστεθεί σύντομα",
      registeredName: "ENCOMM Ι.Κ.Ε.",
      gemi: "Γ.Ε.ΜΗ.",
      vat: "Α.Φ.Μ.",
    },
  },
} as const;

function CapabilityVisual({ type, language }: { type: string; language: "en" | "el" }) {
  if (type === "signal") {
    return (
      <div className="card-visual signal-visual" aria-hidden="true">
        <span className="signal-sphere" />
        <i /><i /><i />
      </div>
    );
  }
  if (type === "agents") {
    return (
      <div className="card-visual agent-visual" aria-hidden="true">
        <span className="agent-center">AI</span>
        <i className="agent-dot agent-a" />
        <i className="agent-dot agent-b" />
        <i className="agent-dot agent-c" />
      </div>
    );
  }
  if (type === "flow") {
    return (
      <div className="card-visual flow-visual" aria-hidden="true">
        <span>{language === "el" ? "ΕΙΣΟΔΟΣ" : "INPUT"}</span>
        <i />
        <span>{language === "el" ? "ΣΚΕΨΗ" : "REASON"}</span>
        <i />
        <span>{language === "el" ? "ΔΡΑΣΗ" : "ACT"}</span>
      </div>
    );
  }
  if (type === "integration") {
    return (
      <div className="card-visual integration-visual" aria-hidden="true">
        <span>ERP</span><i /><b>EN</b><i /><span>{language === "el" ? "ΚΑΤΑΣΤΗΜΑ" : "SHOP"}</span>
        <em>{language === "el" ? "ΣΥΓΧΡΟΝΙΣΜΟΣ / ΑΥΤΟΜΑΤΙΣΜΟΣ / ΚΛΙΜΑΚΩΣΗ" : "SYNC / AUTOMATE / SCALE"}</em>
      </div>
    );
  }
  return (
    <div className="card-visual product-visual" aria-hidden="true">
      <span className="product-window"><i /><i /><i /></span>
      <span className="product-pulse" />
    </div>
  );
}

export default function Home() {
  const { language } = useLanguage();
  const t = pageCopy[language];
  const capabilities = t.capabilities;
  const process = t.method.process;
  const localeRoot = `/${language}`;
  const localizedPath = (path: string) => `${localeRoot}${path}`;
  const [headerCompact, setHeaderCompact] = useState(false);
  const [capabilitiesOpen, setCapabilitiesOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");
  const [emailCopied, setEmailCopied] = useState(false);
  const [contactStatus, setContactStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");
  const [contactFeedback, setContactFeedback] = useState("");
  const [contactStartedAt, setContactStartedAt] = useState(0);
  const capabilitiesMenuRef = useRef<HTMLDivElement>(null);
  const contactDialogRef = useRef<HTMLElement>(null);
  const contactReturnFocusRef = useRef<HTMLElement | null>(null);

  const closeNavigation = () => {
    setCapabilitiesOpen(false);
    setMobileMenuOpen(false);
  };

  const openContact = () => {
    contactReturnFocusRef.current =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;
    setContactStatus("idle");
    setContactFeedback("");
    setContactStartedAt(Date.now());
    setContactOpen(true);
  };

  const closeContact = () => {
    setContactOpen(false);
    window.setTimeout(() => contactReturnFocusRef.current?.focus(), 0);
  };

  const handleContactSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (contactStatus === "submitting") return;

    const form = event.currentTarget;
    const data = new FormData(event.currentTarget);
    const payload = {
      name: String(data.get("name") ?? ""),
      email: String(data.get("email") ?? ""),
      company: String(data.get("company") ?? ""),
      brief: String(data.get("brief") ?? ""),
      privacy: data.get("privacy") === "accepted",
      website: String(data.get("website") ?? ""),
      startedAt: contactStartedAt,
      language,
    };

    setContactStatus("submitting");
    setContactFeedback("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = (await response.json()) as { ok?: boolean; message?: string };

      if (!response.ok || !result.ok) {
        setContactStatus("error");
        setContactFeedback(result.message || t.contactForm.genericError);
        return;
      }

      setContactStatus("success");
      setContactFeedback(result.message || t.contactForm.success);
      form.reset();
      setContactStartedAt(Date.now());
    } catch {
      setContactStatus("error");
      setContactFeedback(t.contactForm.genericError);
    }
  };

  const copyContactEmail = async () => {
    await navigator.clipboard.writeText(t.contact.email);
    setEmailCopied(true);
    window.setTimeout(() => setEmailCopied(false), 1800);
  };

  useEffect(() => {
    const shouldLock = contactOpen || mobileMenuOpen;
    document.body.style.overflow = shouldLock ? "hidden" : "";

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      if (contactOpen) closeContact();
      setMobileMenuOpen(false);
      setCapabilitiesOpen(false);
    };

    const trapDialogFocus = (event: KeyboardEvent) => {
      if (!contactOpen || event.key !== "Tab" || !contactDialogRef.current) return;
      const focusable = Array.from(
        contactDialogRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), textarea:not([disabled])',
        ),
      ).filter((element) => element.tabIndex !== -1);
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (!first || !last) return;
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    window.addEventListener("keydown", closeOnEscape);
    window.addEventListener("keydown", trapDialogFocus);
    if (contactOpen) {
      window.setTimeout(() => {
        contactDialogRef.current
          ?.querySelector<HTMLElement>("input:not([type='hidden']):not([tabindex='-1'])")
          ?.focus();
      }, 0);
    }
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", closeOnEscape);
      window.removeEventListener("keydown", trapDialogFocus);
    };
  }, [contactOpen, mobileMenuOpen]);

  useEffect(() => {
    if (!capabilitiesOpen) return;

    const closeOnOutsideClick = (event: PointerEvent) => {
      if (
        event.target instanceof Node &&
        !capabilitiesMenuRef.current?.contains(event.target)
      ) {
        setCapabilitiesOpen(false);
      }
    };

    document.addEventListener("pointerdown", closeOnOutsideClick);
    return () => document.removeEventListener("pointerdown", closeOnOutsideClick);
  }, [capabilitiesOpen]);

  useEffect(() => {
    const root = document.documentElement;
    const hero = document.getElementById("hero");
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let pointerFrame = 0;
    let scrollFrame = 0;

    const updatePointer = (event: PointerEvent) => {
      if (reduceMotion) return;
      cancelAnimationFrame(pointerFrame);
      pointerFrame = requestAnimationFrame(() => {
        const x = event.clientX / window.innerWidth - 0.5;
        const y = event.clientY / window.innerHeight - 0.5;
        root.style.setProperty("--pointer-x", x.toFixed(3));
        root.style.setProperty("--pointer-y", y.toFixed(3));
        root.style.setProperty("--face-pointer-x", `${(x * 8).toFixed(2)}px`);
        root.style.setProperty("--face-pointer-y", `${(y * 6).toFixed(2)}px`);
        root.style.setProperty("--cursor-x", `${event.clientX}px`);
        root.style.setProperty("--cursor-y", `${event.clientY}px`);
      });
    };

    const updateScroll = () => {
      cancelAnimationFrame(scrollFrame);
      scrollFrame = requestAnimationFrame(() => {
        const available = document.documentElement.scrollHeight - window.innerHeight;
        const pageProgress = available > 0 ? window.scrollY / available : 0;
        root.style.setProperty("--scroll-progress", pageProgress.toFixed(4));
        setHeaderCompact(window.scrollY > Math.min(360, window.innerHeight * 0.42));

        if (hero) {
          const distance = Math.max(1, hero.offsetHeight - window.innerHeight);
          const heroProgress = Math.min(1, Math.max(0, (window.scrollY - hero.offsetTop) / distance));
          const visualProgress = reduceMotion ? 0 : heroProgress;
          root.style.setProperty("--hero-progress", visualProgress.toFixed(4));
          root.style.setProperty("--face-rise", `${(visualProgress * -14).toFixed(1)}px`);
          root.style.setProperty("--face-scale", (1 + visualProgress * 0.018).toFixed(3));
          root.style.setProperty("--halo-scale", (1 + visualProgress * 0.16).toFixed(3));
          root.style.setProperty("--data-shift", `${(visualProgress * -14).toFixed(1)}px`);
          root.style.setProperty("--watermark-shift", `${(visualProgress * -22).toFixed(1)}px`);
          root.style.setProperty("--hero-fade", (1 - visualProgress * 0.08).toFixed(3));
          root.style.setProperty("--activation-reveal", `${(18 + visualProgress * 72).toFixed(1)}%`);
          root.style.setProperty("--activation-glow", (0.18 + visualProgress * 0.64).toFixed(3));
          root.style.setProperty("--scan-y", `${(18 + visualProgress * 62).toFixed(1)}%`);
          root.style.setProperty("--signal-angle", `${(visualProgress * 54).toFixed(1)}deg`);
        }
      });
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.14 },
    );

    document.querySelectorAll<HTMLElement>("[data-reveal]").forEach((el) => observer.observe(el));
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        const current = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (current?.target.id) setActiveSection(current.target.id);
      },
      { rootMargin: "-28% 0px -58% 0px", threshold: [0.01, 0.18, 0.35] },
    );
    ["hero", "thinking", "capabilities", "projects", "integrations", "method", "contact"].forEach((id) => {
      const section = document.getElementById(id);
      if (section) sectionObserver.observe(section);
    });
    window.addEventListener("pointermove", updatePointer, { passive: true });
    window.addEventListener("scroll", updateScroll, { passive: true });
    window.addEventListener("resize", updateScroll, { passive: true });
    updateScroll();

    return () => {
      cancelAnimationFrame(pointerFrame);
      cancelAnimationFrame(scrollFrame);
      observer.disconnect();
      sectionObserver.disconnect();
      window.removeEventListener("pointermove", updatePointer);
      window.removeEventListener("scroll", updateScroll);
      window.removeEventListener("resize", updateScroll);
    };
  }, []);

  return (
    <main id="top">
      <LocalizedSkipLink targetId="hero" />
      <div className="cursor-aura" aria-hidden="true" />
      <div className="page-progress" aria-hidden="true" />

      <header className={`site-header${headerCompact ? " is-compact" : ""}`}>
        <a className="brand" href="#top" aria-label="ENCOMM" onClick={closeNavigation}>
          <img src="/encomm-logo-opt.webp" alt="" width="40" height="28" />
          <span>ENCOMM</span>
        </a>
        <nav className="desktop-nav" aria-label={t.nav.label}>
          <a href={localizedPath("/about")}>
            {t.nav.about}
          </a>
          <div className="nav-services" ref={capabilitiesMenuRef}>
            <button
              className={activeSection === "capabilities" ? "is-active" : ""}
              type="button"
              aria-expanded={capabilitiesOpen}
              aria-controls="capabilities-menu"
              onClick={() => setCapabilitiesOpen((open) => !open)}
            >
              {t.nav.capabilities} <span aria-hidden="true">⌄</span>
            </button>
            {capabilitiesOpen && (
              <div className="capabilities-menu" id="capabilities-menu">
                <div className="capabilities-menu-intro">
                  <span>ENCOMM / AI</span>
                  <p>{t.nav.capabilitiesIntro}</p>
                </div>
                <div className="capabilities-menu-links">
                  {capabilities.map((item) => (
                    <a href={localizedPath(item.href)} key={item.number} onClick={closeNavigation}>
                      <span>{item.number}</span>
                      <strong>{item.title}</strong>
                      <i aria-hidden="true">↗</i>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
          <a className={activeSection === "projects" ? "is-active" : ""} href="#projects">
            {t.nav.projects}
          </a>
          <a className={activeSection === "integrations" ? "is-active" : ""} href="#integrations">
            {t.nav.integrations}
          </a>
          <a className={activeSection === "method" ? "is-active" : ""} href="#method">
            {t.nav.method}
          </a>
        </nav>
        <div className="header-actions">
          <LanguageToggle className="header-language-toggle" />
          <button className="nav-cta" type="button" onClick={openContact}>
            {t.nav.project} <span aria-hidden="true">↗</span>
          </button>
          <button
            className="mobile-menu-trigger"
            type="button"
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-navigation"
            aria-label={mobileMenuOpen ? t.nav.close : t.nav.menu}
            onClick={() => {
              setCapabilitiesOpen(false);
              setMobileMenuOpen((open) => !open);
            }}
          >
            <i /><i />
          </button>
        </div>
      </header>

      {mobileMenuOpen && (
        <div className="mobile-navigation" id="mobile-navigation">
          <div className="mobile-navigation-head">
            <span>ENCOMM / {language.toUpperCase()}</span>
            <button type="button" onClick={() => setMobileMenuOpen(false)}>{t.nav.close} ×</button>
          </div>
          <nav aria-label={t.nav.label}>
            <a href={localizedPath("/about")} onClick={closeNavigation}><span>01</span>{t.nav.about}</a>
            <a href="#capabilities" onClick={closeNavigation}><span>02</span>{t.nav.capabilities}</a>
            <a href="#projects" onClick={closeNavigation}><span>03</span>{t.nav.projects}</a>
            <a href="#integrations" onClick={closeNavigation}><span>04</span>{t.nav.integrations}</a>
            <a href="#method" onClick={closeNavigation}><span>05</span>{t.nav.method}</a>
          </nav>
          <div className="mobile-navigation-services">
            {capabilities.map((item) => (
              <a href={localizedPath(item.href)} key={item.number} onClick={closeNavigation}>
                {item.title}<span aria-hidden="true">↗</span>
              </a>
            ))}
          </div>
          <div className="mobile-navigation-actions">
            <LanguageToggle />
            <button type="button" onClick={() => {
              setMobileMenuOpen(false);
              openContact();
            }}>{t.nav.project} <span aria-hidden="true">↗</span></button>
          </div>
        </div>
      )}

      {contactOpen && (
        <div className="contact-modal" role="presentation" onMouseDown={(event) => {
          if (event.target === event.currentTarget) closeContact();
        }}>
          <section
            className="contact-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="contact-dialog-title"
            aria-describedby="contact-dialog-description"
            ref={contactDialogRef}
          >
            <div className="contact-dialog-head">
              <span>{t.contactForm.eyebrow}</span>
              <button type="button" aria-label={t.contactForm.close} onClick={closeContact}>×</button>
            </div>
            <div className="contact-dialog-grid">
              <div className="contact-dialog-copy">
                <h2 id="contact-dialog-title">{t.contactForm.title}</h2>
                <p id="contact-dialog-description">{t.contactForm.body}</p>
                <div>
                  <span>{t.contactForm.direct}</span>
                  <a href={`mailto:${t.contact.email}`}>{t.contact.email}</a>
                  <button type="button" onClick={copyContactEmail}>
                    {emailCopied ? t.contactForm.copied : t.contactForm.copy}
                  </button>
                </div>
              </div>
              <form
                className="project-form"
                onSubmit={handleContactSubmit}
                aria-busy={contactStatus === "submitting"}
              >
                <div className="project-form-trap" aria-hidden="true">
                  <label htmlFor="contact-website">Website</label>
                  <input
                    id="contact-website"
                    name="website"
                    type="text"
                    autoComplete="off"
                    tabIndex={-1}
                  />
                </div>
                <label>
                  <span>{t.contactForm.name}</span>
                  <input
                    name="name"
                    type="text"
                    autoComplete="name"
                    placeholder={t.contactForm.placeholderName}
                    minLength={2}
                    maxLength={80}
                    required
                  />
                </label>
                <label>
                  <span>{t.contactForm.email}</span>
                  <input
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder={t.contactForm.placeholderEmail}
                    maxLength={254}
                    required
                  />
                </label>
                <label>
                  <span>{t.contactForm.company}</span>
                  <input
                    name="company"
                    type="text"
                    autoComplete="organization"
                    placeholder={t.contactForm.placeholderCompany}
                    maxLength={120}
                  />
                </label>
                <label className="project-form-brief">
                  <span>{t.contactForm.brief}</span>
                  <textarea
                    name="brief"
                    rows={5}
                    placeholder={t.contactForm.placeholderBrief}
                    minLength={20}
                    maxLength={3000}
                    required
                  />
                </label>
                <label className="project-form-privacy">
                  <input name="privacy" type="checkbox" value="accepted" required />
                  <span>
                    {t.contactForm.privacyBefore}{" "}
                    <a href={localizedPath("/privacy")} target="_blank" rel="noreferrer">
                      {t.contactForm.privacyLink}
                    </a>{" "}
                    {t.contactForm.privacyAfter}
                  </span>
                </label>
                <button
                  className="project-form-submit"
                  type="submit"
                  disabled={contactStatus === "submitting"}
                >
                  {contactStatus === "submitting"
                    ? t.contactForm.submitting
                    : t.contactForm.submit}
                  <span aria-hidden="true">↗</span>
                </button>
                <p
                  className={`project-form-feedback is-${contactStatus}`}
                  role={contactStatus === "error" ? "alert" : "status"}
                  aria-live="polite"
                >
                  {contactFeedback}
                </p>
              </form>
            </div>
          </section>
        </div>
      )}

      <section className="hero" id="hero" aria-labelledby="hero-title">
        <div className="hero-sticky">
          <div className="hero-grid" aria-hidden="true" />
          <div className="hero-wash wash-one" aria-hidden="true" />
          <div className="hero-wash wash-two" aria-hidden="true" />

          <div className="hero-copy-block">
            <p className="hero-kicker"><i /> {t.hero.kicker}</p>
            <h1 id="hero-title">
              <span>{t.hero.titleOne}</span>
              <em>{t.hero.titleTwo}</em>
            </h1>
            <p className="hero-intro">
              {t.hero.intro}
            </p>
            <a className="hero-cta" href="#capabilities">
              {t.hero.explore} <span aria-hidden="true">↓</span>
            </a>
          </div>

          <div className="face-stage" aria-label={t.hero.faceLabel}>
            <div className="face-orbit orbit-outer" aria-hidden="true" />
            <div className="face-orbit orbit-inner" aria-hidden="true" />
            <div className="face-halo" aria-hidden="true" />
            <div className="face-shell">
              <img
                className="ai-face"
                src="/ai-face-v2.webp"
                alt={t.hero.faceAlt}
                width="1024"
                height="1536"
                fetchPriority="high"
              />
              <span className="face-scan" aria-hidden="true" />
            </div>
            <span className="face-marker marker-one" aria-hidden="true">01</span>
            <span className="face-marker marker-two" aria-hidden="true">02</span>
            <span className="face-marker marker-three" aria-hidden="true">03</span>
          </div>

          <div className="hero-data data-left" aria-hidden="true">
            <span>{t.hero.context}</span><strong>{t.hero.connected}</strong>
          </div>
          <div className="hero-data data-right" aria-hidden="true">
            <span>{t.hero.control}</span><strong>{t.hero.human}</strong>
          </div>

          <div className="hero-watermark" aria-hidden="true">
            {t.hero.watermark.map((word) => <span key={word}>{word}</span>)}
          </div>

          <div className="hero-foot">
            <span>{t.hero.reality}</span>
            <div className="scroll-instruction" aria-hidden="true"><i /> {t.hero.scroll}</div>
            <span>ENCOMM / 2026</span>
          </div>
        </div>
      </section>

      <div className="kinetic-band" aria-label={t.nav.capabilities}>
        <div className="kinetic-track">
          {[...t.ticker, ...t.ticker].map((item, index) => (
            <span key={`${item}-${index}`}>{item}<i>✦</i></span>
          ))}
        </div>
      </div>

      <section className="manifesto page-shell" id="thinking">
        <div className="section-index" data-reveal><span>01</span> {t.manifesto.index}</div>
        <div className="manifesto-grid">
          <h2 data-reveal>
            {t.manifesto.title}
            <em>{t.manifesto.accent}</em>
          </h2>
          <div className="manifesto-aside" data-reveal>
            <span className="aside-rule" />
            <p>{t.manifesto.bodyOne}</p>
            <p>{t.manifesto.bodyTwo}</p>
          </div>
        </div>
        <div className="manifesto-numbers" aria-hidden="true" data-reveal>
          {t.manifesto.steps.map((step, index) => (
            <span key={step}>0{index + 1} <i>{step}</i></span>
          ))}
        </div>
      </section>

      <section className="capabilities page-shell" id="capabilities">
        <div className="section-heading" data-reveal>
          <div className="section-index"><span>02</span> {t.capabilitiesHeading.index}</div>
          <h2>{t.capabilitiesHeading.title}<br /><em>{t.capabilitiesHeading.accent}</em></h2>
          <p>{t.capabilitiesHeading.body}</p>
        </div>

        <div className="capability-grid">
          {capabilities.map((item, index) => (
            <article
              className={`capability-card card-${index + 1}`}
              id={`service-${item.number}`}
              key={item.number}
              data-reveal
            >
              <div className="capability-top">
                <span>{item.number}</span>
                <i aria-hidden="true">↗</i>
              </div>
              <CapabilityVisual type={item.visual} language={language} />
              <div className="capability-copy">
                <p>{item.label}</p>
                <h3>{item.title}</h3>
                <div className="capability-detail">
                  <p>{item.body}</p>
                  <div>{item.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
                </div>
                <a className="capability-page-link" href={localizedPath(item.href)}>
                  {language === "el" ? "Δείτε την υπηρεσία" : "Explore the service"}
                  <span aria-hidden="true">↗</span>
                </a>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="projects page-shell" id="projects">
        <div className="projects-heading" data-reveal>
          <div className="section-index"><span>03</span> {t.projects.index}</div>
          <h2>{t.projects.title}<br /><em>{t.projects.accent}</em></h2>
          <p>{t.projects.body}</p>
        </div>

        <div className="project-grid">
          {t.projects.slots.map((project, index) => (
            <a
              className={`project-card project-card-${index + 1}`}
              href={project.url}
              target="_blank"
              rel="noreferrer"
              key={project.number}
              data-reveal
            >
              <div className="project-card-top">
                <span>{project.number}</span>
                <i><b />{t.projects.live}</i>
              </div>
              <div className="project-preview">
                <img src={project.image} alt={project.alt} width="1265" height="712" loading="lazy" />
                <span aria-hidden="true">
                  ENCOMM / {language === "el" ? "ΕΝΕΡΓΟ" : "LIVE"} {String(index + 1).padStart(2, "0")}
                </span>
              </div>
              <div className="project-card-copy">
                <p>{project.label}</p>
                <h3>{project.title}<i aria-hidden="true">↗</i></h3>
                <span>{project.body}</span>
                <strong>{t.projects.visit}<i aria-hidden="true">↗</i></strong>
              </div>
            </a>
          ))}
        </div>
      </section>

      <section className="operations" id="integrations">
        <div className="page-shell operations-inner">
          <div className="operations-copy" data-reveal>
            <div className="section-index"><span>04</span> {t.operations.index}</div>
            <h2>{t.operations.title}<br /><em>{t.operations.accent}</em></h2>
            <p>{t.operations.body}</p>
            <div className="integration-chips">
              {t.operations.systems.map((system) => <span key={system}>{system}</span>)}
            </div>
            <div className="powered-badge"><i /> {t.operations.powered}</div>
          </div>

          <div className="system-matrix" data-reveal aria-label={t.operations.index}>
            <div className="matrix-toolbar">
              <span>{t.operations.flow}</span>
              <strong>{language === "el" ? "ΕΝΕΡΓΟ" : "ACTIVE"} <i /></strong>
            </div>
            <div className="matrix-canvas" aria-hidden="true">
              <div className="matrix-orbit matrix-orbit-one" />
              <div className="matrix-orbit matrix-orbit-two" />
              <div className="matrix-core"><span>EN</span><strong>{t.operations.core}</strong></div>
              {t.operations.systems.map((system, index) => (
                <span className={`matrix-node matrix-node-${index + 1}`} key={system}>{system}</span>
              ))}
              <div className="matrix-flow"><i /> {t.operations.flow} <i /></div>
            </div>
            <div className="matrix-footer">
              <span>{language === "el" ? "ERP → ΔΕΔΟΜΕΝΑ → AI → ΔΡΑΣΗ" : "ERP → DATA → AI → ACTION"}</span>
              <strong>{t.operations.powered}</strong>
            </div>
          </div>
        </div>
      </section>

      <section className="intelligence-room" id="intelligence">
        <div className="room-grid" aria-hidden="true" />
        <div className="page-shell room-inner">
          <div className="room-copy" data-reveal>
            <div className="section-index"><span>05</span> {t.room.index}</div>
            <h2>{t.room.titleOne}<br />{t.room.titleTwo}</h2>
            <p>{t.room.body}</p>
            <div className="assurance-list">
              {t.room.assurance.map((item) => <span key={item}><i /> {item}</span>)}
            </div>
          </div>

          <div className="intelligence-map" data-reveal aria-label={t.room.mapLabel}>
            <div className="map-toolbar"><span>{t.room.mapTitle}</span><strong>{t.room.live}</strong></div>
            <div className="map-canvas" aria-hidden="true">
              <div className="map-ring ring-one" />
              <div className="map-ring ring-two" />
              <div className="map-center"><span>EN</span><strong>{language === "el" ? "ΠΥΡΗΝΑΣ" : "CORE"}</strong></div>
              <span className="map-node map-data">{t.room.nodes[0]}</span>
              <span className="map-node map-people">{t.room.nodes[1]}</span>
              <span className="map-node map-tools">{t.room.nodes[2]}</span>
              <span className="map-node map-action">{t.room.nodes[3]}</span>
              <i className="map-line line-a" /><i className="map-line line-b" />
              <i className="map-line line-c" /><i className="map-line line-d" />
            </div>
            <div className="map-status">
              {t.room.status.map((item) => <span key={item}>{item}</span>)}
            </div>
          </div>
        </div>
      </section>

      <section className="method page-shell" id="method">
        <div className="section-heading method-heading" data-reveal>
          <div className="section-index"><span>06</span> {t.method.index}</div>
          <h2>{t.method.titleOne}<br /><em>{t.method.titleTwo}</em></h2>
        </div>
        <div className="method-list">
          {process.map(([number, title, body]) => (
            <article key={number} data-reveal>
              <span>{number}</span>
              <h3>{title}</h3>
              <p>{body}</p>
              <i aria-hidden="true">↗</i>
            </article>
          ))}
        </div>
      </section>

      <section className="contact page-shell" id="contact">
        <div className="contact-panel" data-reveal>
          <div className="contact-orb" aria-hidden="true"><i /><i /></div>
          <div className="section-index"><span>07</span> {t.contact.index}</div>
          <h2>{t.contact.titleOne}<br /><em>{t.contact.titleTwo}</em></h2>
          <p>{t.contact.body}</p>
          <div className="contact-email">
            <span>{t.contact.emailLabel}</span>
            <a href={`mailto:${t.contact.email}`}>{t.contact.email}</a>
          </div>
          <button className="contact-cta" type="button" onClick={openContact}>
            <span>{t.contact.cta}</span><i aria-hidden="true">↗</i>
          </button>
        </div>
      </section>

      <footer className="mega-footer">
        <div className="footer-lead">
          <div>
            <span>{language === "el" ? "ENCOMM / ΕΠΙΧΕΙΡΗΣΙΑΚΟ AI" : "ENCOMM / ENTERPRISE AI"}</span>
            <h2>{t.footer.statement}</h2>
            <p>{t.footer.statementBody}</p>
          </div>
          <button type="button" onClick={openContact}>
            {t.footer.contact}<span aria-hidden="true">↗</span>
          </button>
        </div>

        <div className="footer-directory">
          <div className="footer-identity">
            <a className="footer-brand" href="#top" aria-label="ENCOMM">
              <img src="/encomm-logo-opt.webp" alt="" width="48" height="34" />
              <strong>ENCOMM</strong>
            </a>
            <p><i aria-hidden="true">⌖</i> {language === "el" ? company.addressEl : company.addressEn}</p>
            <small>
              {t.footer.registeredName}<br />
              {t.footer.gemi} {company.gemi} · {t.footer.vat} {company.vat}
            </small>
          </div>

          <div className="footer-column">
            <span>{t.footer.capabilities}</span>
            {capabilities.map((item) => (
              <a href={localizedPath(item.href)} key={item.number}>{item.title}</a>
            ))}
          </div>

          <div className="footer-column">
            <span>{t.footer.work}</span>
            <a href="#projects">{t.footer.projects}</a>
            <a href="#integrations">{t.footer.integrations}</a>
            <a href="#method">{t.footer.method}</a>
            <button type="button" onClick={openContact}>{t.footer.contact}</button>
            <div className="footer-support">
              <span>{t.footer.support}</span>
              <a href={`mailto:${t.contact.email}`}>{t.contact.email}</a>
            </div>
          </div>

          <div className="footer-column">
            <span>{t.footer.company}</span>
            <a href={localizedPath("/about")}>{t.footer.about}</a>
            <a href="#thinking">{t.footer.thinking}</a>
            <a href={localizedPath("/privacy")}>{t.footer.privacy}</a>
            <a href={localizedPath("/terms")}>{t.footer.terms}</a>
            <a href={localizedPath("/cookies")}>{t.footer.cookies}</a>
          </div>
        </div>

        <div className="footer-accreditation">
          <a
            className="elevate-card"
            href="https://registry.elevategreece.gov.gr/company/encomm-tensor-intelligence-%ce%b9-%ce%ba-%ce%b5/"
            target="_blank"
            rel="noreferrer"
          >
            <span className="elevate-mark" aria-hidden="true">EG</span>
            <span>
              <small>{t.footer.elevateEyebrow}</small>
              <strong>{t.footer.elevateTitle}</strong>
            </span>
            <i aria-hidden="true">↗</i>
          </a>
        </div>

        <div className="footer-bottom">
          <div className="footer-legal">
            <span>© 2026 ENCOMM</span>
            <a href="/sitemap.xml">{t.footer.sitemap}</a>
            <span>{t.footer.powered}</span>
            <a href="#top">{t.footer.top}</a>
          </div>
          <p>{t.footer.line}</p>
          <div
            className="footer-socials"
            aria-label={language === "el" ? "Κοινωνικά δίκτυα της ENCOMM" : "ENCOMM social media"}
          >
            <a
              href="https://github.com/Encomm-Tensor-Intelligence"
              target="_blank"
              rel="noreferrer"
              aria-label={language === "el" ? "Η ENCOMM στο GitHub" : "ENCOMM on GitHub"}
              title="GitHub"
            >
              <FaGithub aria-hidden="true" />
            </a>
            <span aria-disabled="true" aria-label={`LinkedIn — ${t.footer.socialSoon}`} title={t.footer.socialSoon}>
              <FaLinkedinIn aria-hidden="true" />
            </span>
            <span aria-disabled="true" aria-label={`X — ${t.footer.socialSoon}`} title={t.footer.socialSoon}>
              <FaXTwitter aria-hidden="true" />
            </span>
            <span aria-disabled="true" aria-label={`YouTube — ${t.footer.socialSoon}`} title={t.footer.socialSoon}>
              <FaYoutube aria-hidden="true" />
            </span>
          </div>
        </div>
        <div className="footer-wordmark" aria-hidden="true">ENCOMM</div>
      </footer>
    </main>
  );
}
