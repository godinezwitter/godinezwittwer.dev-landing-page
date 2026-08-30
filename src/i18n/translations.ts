/* Central copy dictionary for the two supported languages. The English object
   defines the shape; the German object must mirror it exactly (enforced by the
   `Content` type below). Brand names, tech tags, and asset references live in the
   components, not here — only human-facing prose is translated. */

const en = {
  nav: {
    links: ["About", "Services", "Process", "Work", "Why us"],
    cta: "Get Started",
    home: "Godinez & Wittwer — back to top",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    language: "Language",
  },
  hero: {
    badge: "Two full-stack engineers",
    line1: "Clean websites,",
    line2: "engineered to",
    rotating: ["convert.", "load fast.", "earn trust.", "sell."],
    subhead:
      "We're Joel and Dee — two engineers who design and build high-converting landing pages and sites for Fiverr sellers. Real code, real testing, no templates.",
    ctaPrimary: "Start Your Project →",
    ctaSecondary: "See Our Work",
    cornerLeft: "Digital Pages, Made Smarter",
    cornerRight: "Fiverr Studio",
    scroll: "[ Scroll ]",
    panelTitle: "[ How we work ]",
    panel: [
      { title: "Real code, not templates", detail: "React · Angular · TypeScript · .NET" },
      { title: "Two sets of eyes", detail: "Built by one, reviewed by the other" },
      { title: "Fast turnaround", detail: "Most pages live in 2–5 days" },
    ],
  },
  about: {
    kicker: "Who we are",
    headingPre: "Two engineers who'd rather ",
    headingEm: "build than talk",
    intro:
      "We're Joel Godinez and Dee Wittwer — third-year full-stack apprentices at Swiss Post by day, a two-person web studio the rest of the time. We build client sites the same way we ship production software: clean code, real testing, no shortcuts.",
    role: "Full-stack engineer",
    bios: [
      "Front-end and motion lead. Comfortable across the stack — from React interfaces down to Spring Boot and .NET services.",
      "Design and back-end lead. Sweats the details on layout and copy, then makes the whole thing run on solid, tested code.",
    ],
    offs: [
      "Off the clock — skiing, gym, music, food.",
      "Off the clock — football, cooking, music, fashion.",
    ],
    linkedin: "on LinkedIn",
  },
  services: {
    kicker: "What we offer",
    heading: "Everything a winning page needs",
    items: [
      {
        title: "Landing page design",
        desc: "Pixel-perfect, single-purpose pages built to turn one click into one customer. Fast, responsive, on-brand.",
      },
      {
        title: "Conversion copywriting",
        desc: "Words and structure that guide people to the click — headlines, hooks, and a flow that answers objections in order.",
      },
      {
        title: "Fiverr gig pages",
        desc: "Purpose-built for the Fiverr ecosystem — trust signals, clear offers, and structure that helps buyers say yes.",
      },
      {
        title: "Full website builds",
        desc: "Multi-page sites coded from scratch — home, services, about, contact — structured to scale as you grow.",
      },
      {
        title: "Page refresh & audit",
        desc: "Already have a page? We audit it, find what's quietly costing you conversions, and rebuild it properly.",
      },
      {
        title: "Brand identity add-on",
        desc: "A tidy starter kit — logo, colour system, and type — so your page looks like a business, not a hobby.",
      },
    ],
  },
  process: {
    kicker: "How we work",
    heading: "From idea to live page — four clean steps",
    steps: [
      { n: "01", title: "Discovery", desc: "A focused brief: your offer, audience, and goal. No fluff — just what the page needs to do." },
      { n: "02", title: "Strategy & wireframe", desc: "We map the structure — hero, value, objections, CTA. Every section earns its place before we design." },
      { n: "03", title: "Design & build", desc: "Design and code happen together. Real components, real content, tested as we go — not a flat mockup." },
      { n: "04", title: "Review & launch", desc: "We revise until you're happy, QA across devices, and hand off clean — code or published live." },
    ],
    guaranteeTitle: "100% satisfaction guarantee",
    guaranteeDesc: "Not happy after two revisions? You get a full refund — no questions asked.",
    guaranteeCta: "Claim your page →",
  },
  work: {
    kicker: "Selected work",
    heading: "Proof of craft",
    subhead:
      "Client work is just getting started — so here's what we've built to show range: concept pages designed and coded end to end.",
    categories: ["Eco-tech · Landing page", "Editorial · Portfolio", "SaaS · Marketing site"],
    tag: "Concept",
  },
  why: {
    kicker: "Why trust us",
    heading: "No hype. Just how we work.",
    subtext:
      "We're a new studio and we won't pad this page with invented numbers. Here's the honest case for handing us your project.",
    reasons: [
      {
        n: "01",
        title: "Professional engineers",
        desc: "We build production software for Swiss Post by day. Your site gets the same standards — clean, tested, maintainable code, not a drag-and-drop template.",
      },
      {
        n: "02",
        title: "Two sets of eyes",
        desc: "Everything is built by one of us and reviewed by the other before it ships. Two people means fewer misses and a second opinion baked into every page.",
      },
      {
        n: "03",
        title: "Revisions until you're happy",
        desc: "We iterate until the page is genuinely right — not until a revision counter runs out. Clear, fast communication the whole way through.",
      },
    ],
    proofPoints: [
      "Real code, not templates",
      "Honest scope & pricing",
      "Clear, fast communication",
      "Delivery in 2–5 days",
    ],
  },
  contact: {
    kicker: "Start today",
    heading: "Ready to build a page that actually works?",
    paragraph:
      "Tell us about your Fiverr gig and we'll come back within 24 hours with a strategy and a clear quote.",
    checks: ["Free initial consultation", "Clear pricing — no surprises", "Delivery within 2–5 days"],
    nameLabel: "Your name",
    namePlaceholder: "Jordan Rivera",
    emailLabel: "Email address",
    emailPlaceholder: "jordan@email.com",
    serviceLabel: "Fiverr category",
    servicePlaceholder: "e.g. Logo Design, SEO, Writing",
    messageLabel: "Tell us about your gig",
    messagePlaceholder: "Briefly describe what you sell and your goal for the page…",
    submit: "Send my brief →",
    successTitle: "Brief received",
    successBody: "We'll review your gig and reply with a strategy and quote within 24 hours.",
    errName: "Please enter your name.",
    errEmailReq: "Please enter your email address.",
    errEmailInvalid: "That email address doesn't look right.",
  },
  footer: {
    copyright: "© 2026 Godinez & Wittwer — Web Studio. Switzerland.",
    privacy: "Privacy",
    terms: "Terms",
    contact: "Contact",
  },
}

export type Lang = "en" | "de"
export type Content = typeof en

const de: Content = {
  nav: {
    links: ["Über uns", "Leistungen", "Ablauf", "Arbeiten", "Warum wir"],
    cta: "Loslegen",
    home: "Godinez & Wittwer — nach oben",
    openMenu: "Menü öffnen",
    closeMenu: "Menü schließen",
    language: "Sprache",
  },
  hero: {
    badge: "Zwei Full-Stack-Entwickler",
    line1: "Saubere Websites,",
    line2: "gebaut, um zu",
    rotating: ["überzeugen.", "begeistern.", "verkaufen.", "konvertieren."],
    subhead:
      "Wir sind Joel und Dee — zwei Entwickler, die hochkonvertierende Landingpages und Websites für Fiverr-Anbieter gestalten und bauen. Echter Code, echte Tests, keine Templates.",
    ctaPrimary: "Projekt starten →",
    ctaSecondary: "Unsere Arbeiten",
    cornerLeft: "Digitale Seiten, klüger gemacht",
    cornerRight: "Fiverr Studio",
    scroll: "[ Scrollen ]",
    panelTitle: "[ So arbeiten wir ]",
    panel: [
      { title: "Echter Code, keine Templates", detail: "React · Angular · TypeScript · .NET" },
      { title: "Vier Augen", detail: "Von einem gebaut, vom anderen geprüft" },
      { title: "Schnelle Umsetzung", detail: "Die meisten Seiten sind in 2–5 Tagen live" },
    ],
  },
  about: {
    kicker: "Wer wir sind",
    headingPre: "Zwei Entwickler, die lieber ",
    headingEm: "bauen als reden",
    intro:
      "Wir sind Joel Godinez und Dee Wittwer — im dritten Lehrjahr als Full-Stack-Entwickler bei der Schweizerischen Post, den Rest der Zeit ein Zwei-Personen-Webstudio. Wir bauen Kundenseiten so, wie wir Produktivsoftware ausliefern: sauberer Code, echte Tests, keine Abkürzungen.",
    role: "Full-Stack-Entwickler",
    bios: [
      "Front-end- und Motion-Lead. Zu Hause im ganzen Stack — von React-Oberflächen bis zu Spring-Boot- und .NET-Services.",
      "Design- und Backend-Lead. Achtet auf jedes Detail bei Layout und Text und bringt das Ganze dann auf soliden, getesteten Code zum Laufen.",
    ],
    offs: [
      "Nach Feierabend — Skifahren, Gym, Musik, Essen.",
      "Nach Feierabend — Fussball, Kochen, Musik, Mode.",
    ],
    linkedin: "auf LinkedIn",
  },
  services: {
    kicker: "Was wir bieten",
    heading: "Alles, was eine überzeugende Seite braucht",
    items: [
      {
        title: "Landingpage-Design",
        desc: "Pixelgenaue, fokussierte Seiten, die aus einem Klick einen Kunden machen. Schnell, responsiv, markengerecht.",
      },
      {
        title: "Conversion-Texte",
        desc: "Worte und Struktur, die zum Klick führen — Überschriften, Hooks und ein Aufbau, der Einwände der Reihe nach beantwortet.",
      },
      {
        title: "Fiverr-Gig-Seiten",
        desc: "Massgeschneidert für das Fiverr-Ökosystem — Vertrauenssignale, klare Angebote und eine Struktur, die Käufer zum Ja bewegt.",
      },
      {
        title: "Komplette Websites",
        desc: "Mehrseitige Websites von Grund auf programmiert — Start, Leistungen, Über uns, Kontakt — so gebaut, dass sie mitwachsen.",
      },
      {
        title: "Seiten-Audit & Relaunch",
        desc: "Schon eine Seite? Wir prüfen sie, finden, was dich still Conversions kostet, und bauen sie richtig neu.",
      },
      {
        title: "Marken-Basics",
        desc: "Ein kompaktes Starter-Kit — Logo, Farbsystem und Typografie — damit deine Seite nach Unternehmen aussieht, nicht nach Hobby.",
      },
    ],
  },
  process: {
    kicker: "So arbeiten wir",
    heading: "Von der Idee zur Live-Seite — vier klare Schritte",
    steps: [
      { n: "01", title: "Briefing", desc: "Ein fokussiertes Briefing: dein Angebot, deine Zielgruppe, dein Ziel. Kein Füllstoff — nur, was die Seite leisten muss." },
      { n: "02", title: "Strategie & Wireframe", desc: "Wir planen die Struktur — Hero, Nutzen, Einwände, CTA. Jeder Abschnitt verdient seinen Platz, bevor wir gestalten." },
      { n: "03", title: "Design & Umsetzung", desc: "Design und Code entstehen zusammen. Echte Komponenten, echte Inhalte, laufend getestet — kein flaches Mockup." },
      { n: "04", title: "Review & Launch", desc: "Wir überarbeiten, bis es passt, testen auf allen Geräten und übergeben sauber — als Code oder live veröffentlicht." },
    ],
    guaranteeTitle: "100% Zufriedenheitsgarantie",
    guaranteeDesc: "Nach zwei Überarbeitungen nicht zufrieden? Du bekommst dein Geld zurück — ohne Wenn und Aber.",
    guaranteeCta: "Seite sichern →",
  },
  work: {
    kicker: "Ausgewählte Arbeiten",
    heading: "Beweis für Handwerk",
    subhead:
      "Kundenprojekte starten gerade erst — hier ist, was wir gebaut haben, um unsere Bandbreite zu zeigen: Konzeptseiten, komplett gestaltet und programmiert.",
    categories: ["Eco-Tech · Landingpage", "Editorial · Portfolio", "SaaS · Marketing-Website"],
    tag: "Konzept",
  },
  why: {
    kicker: "Warum uns vertrauen",
    heading: "Kein Hype. Nur, wie wir arbeiten.",
    subtext:
      "Wir sind ein neues Studio und blähen diese Seite nicht mit erfundenen Zahlen auf. Hier ist der ehrliche Grund, uns dein Projekt anzuvertrauen.",
    reasons: [
      {
        n: "01",
        title: "Professionelle Entwickler",
        desc: "Wir bauen tagsüber Produktivsoftware für die Schweizerische Post. Deine Seite bekommt denselben Standard — sauberer, getesteter, wartbarer Code, kein Baukasten-Template.",
      },
      {
        n: "02",
        title: "Vier Augen",
        desc: "Alles wird von einem von uns gebaut und vom anderen geprüft, bevor es live geht. Zwei Personen bedeuten weniger Fehler und eine zweite Meinung in jeder Seite.",
      },
      {
        n: "03",
        title: "Überarbeitungen, bis du zufrieden bist",
        desc: "Wir iterieren, bis die Seite wirklich stimmt — nicht, bis ein Zähler abgelaufen ist. Klare, schnelle Kommunikation auf dem ganzen Weg.",
      },
    ],
    proofPoints: [
      "Echter Code, keine Templates",
      "Ehrlicher Umfang & Preis",
      "Klare, schnelle Kommunikation",
      "Lieferung in 2–5 Tagen",
    ],
  },
  contact: {
    kicker: "Jetzt starten",
    heading: "Bereit für eine Seite, die wirklich funktioniert?",
    paragraph:
      "Erzähl uns von deinem Fiverr-Gig und wir melden uns innerhalb von 24 Stunden mit einer Strategie und einem klaren Angebot.",
    checks: ["Kostenloses Erstgespräch", "Klare Preise — keine Überraschungen", "Lieferung in 2–5 Tagen"],
    nameLabel: "Dein Name",
    namePlaceholder: "Jordan Rivera",
    emailLabel: "E-Mail-Adresse",
    emailPlaceholder: "jordan@email.com",
    serviceLabel: "Fiverr-Kategorie",
    servicePlaceholder: "z. B. Logo-Design, SEO, Texte",
    messageLabel: "Erzähl uns von deinem Gig",
    messagePlaceholder: "Beschreibe kurz, was du verkaufst und dein Ziel für die Seite …",
    submit: "Briefing senden →",
    successTitle: "Briefing erhalten",
    successBody: "Wir schauen uns deinen Gig an und antworten innerhalb von 24 Stunden mit Strategie und Angebot.",
    errName: "Bitte gib deinen Namen ein.",
    errEmailReq: "Bitte gib deine E-Mail-Adresse ein.",
    errEmailInvalid: "Diese E-Mail-Adresse sieht nicht richtig aus.",
  },
  footer: {
    copyright: "© 2026 Godinez & Wittwer — Web-Studio. Schweiz.",
    privacy: "Datenschutz",
    terms: "AGB",
    contact: "Kontakt",
  },
}

export const translations: Record<Lang, Content> = { en, de }
