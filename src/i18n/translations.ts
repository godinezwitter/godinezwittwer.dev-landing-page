/* Central copy dictionary for the two supported languages. The English object
   defines the shape; the German object must mirror it exactly (enforced by the
   `Content` type below). Brand names, tech tags, and asset references live in the
   components, not here — only human-facing prose is translated. */

const en = {
  nav: {
    tabs: { work: "Work", projects: "Our Projects", about: "About Us" },
    cta: "Get Started",
    skip: "Skip to content",
    home: "Godinez & Wittwer — back to top",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    language: "Language",
  },
  hero: {
    kicker: "Fiverr web studio · Switzerland",
    line1: "Clean websites,",
    line2: "engineered to",
    rotating: ["convert.", "load fast.", "earn trust.", "sell."],
    subhead:
      "We're Joel and Dee — two engineers who design and build high-converting landing pages and sites for Fiverr sellers. Real code, real testing, no templates.",
    ctaPrimary: "Start Your Project",
    ctaSecondary: "See Our Work",
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
    kicker: "Six services, one goal",
    heading: "Everything a winning page needs",
    cardAction: "Get started",
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
    kicker: "The process",
    heading: "From idea to live page — four clean steps",
    steps: [
      { n: "01", title: "Discovery", desc: "A focused brief: your offer, audience, and goal. No fluff — just what the page needs to do." },
      { n: "02", title: "Strategy & wireframe", desc: "We map the structure — hero, value, objections, CTA. Every section earns its place before we design." },
      { n: "03", title: "Design & build", desc: "Design and code happen together. Real components, real content, tested as we go — not a flat mockup." },
      { n: "04", title: "Review & launch", desc: "We revise until you're happy, QA across devices, and hand off clean — code or published live." },
    ],
    guaranteeTitle: "100% satisfaction guarantee",
    guaranteeDesc: "Not happy after two revisions? You get a full refund — no questions asked.",
    guaranteeCta: "Claim your page",
  },
  work: {
    kicker: "Selected work",
    heading: "Proof of craft",
    subhead:
      "Client work is just getting started — so here's what we've built to show range: concept pages designed and coded end to end.",
    categories: ["Eco-tech · Landing page", "Editorial · Portfolio", "SaaS · Marketing site"],
    tag: "Concept",
    comingSoon: "Live site coming soon",
    visit: "Visit live site",
    learnMore: "Learn more",
  },
  projects: {
    kicker: "Concept work",
    heading: "Our Projects",
    intro:
      "Client work is just getting started, so these three concept builds are here to show how we actually think and build: real structure, invented briefs, coded end to end — no templates, no stock layouts.",
    backCta: "Back to work",
    items: [
      {
        description:
          "A single-purpose landing page for a fictional sustainability startup. The brief was simple: turn one scroll into one signup. Every section — hero, offer, proof, objection, call to action — earns its place, structured exactly the way we'd plan a real client page.",
      },
      {
        description:
          "A magazine-style portfolio concept for a writer and photographer. The challenge here was typographic: a layout that lets long-form work breathe and reads like an actual publication, instead of a generic gallery template.",
      },
      {
        description:
          "A marketing site for an imagined infrastructure-management platform. Built to explain a technical product to a non-technical buyer — a clear feature walkthrough, a platform explainer, and a signup flow that doesn't overwhelm.",
      },
    ],
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
    submit: "Send my brief",
    submitting: "Sending…",
    successTitle: "Brief received",
    successBody: "We'll review your gig and reply with a strategy and quote within 24 hours.",
    optional: "(optional)",
    errName: "Please enter your name.",
    errEmailReq: "Please enter your email address.",
    errEmailInvalid: "That email address doesn't look right — check for a typo.",
    errMessage: "Please tell us a bit about your gig.",
    errMessageShort: "A sentence or two more would help us reply properly.",
    errCaptcha: "Please confirm you're human with the check above.",
    errSend: "Something went wrong sending your brief. Please email us directly at godinezwittwer.dev@gmail.com.",
  },
  footer: {
    copyright: "© 2026 Godinez & Wittwer — Web Studio. Switzerland.",
    privacy: "Privacy",
    terms: "Terms",
    contact: "Contact",
  },
  /* The two legal documents. Each section renders as: heading, `body`
     paragraphs, an optional `list`, then any `tail` paragraphs — the shape the
     existing copy actually needs. The closing contact block is split around its
     inline link so the sentence stays translatable. */
  legal: {
    kicker: "Legal",
    back: "Back to homepage",
    updated: "Last updated: 29 August 2026",
    note: "This is a template stub. Review it with a legal advisor and replace the placeholder details with your own before relying on it in production.",
    terms: {
      title: "Terms of Service",
      intro:
        "These terms cover your use of the Godinez & Wittwer website and the landing-page design and copywriting services we provide. By hiring us or using this site, you agree to them.",
      sections: [
        {
          heading: "Our services",
          body: [
            "Godinez & Wittwer designs and writes landing pages for Fiverr sellers and buyers. The exact scope, timeline, and price for your project are agreed in writing before work begins.",
          ],
          list: [],
          tail: [],
        },
        {
          heading: "Revisions and delivery",
          body: [
            "Each project includes two rounds of revisions unless stated otherwise. Delivery timelines are estimates and depend on receiving the content and feedback we need from you on time.",
          ],
          list: [],
          tail: [],
        },
        {
          heading: "Payment",
          body: [
            "Fees, deposits, and payment schedules are set out in your project agreement. Work starts once the agreed deposit is received.",
          ],
          list: [],
          tail: [],
        },
        {
          heading: "Refunds",
          body: [
            "If you are not satisfied after the two included revision rounds, you are eligible for a full refund as described on our homepage. Refund requests should be made in writing.",
          ],
          list: [],
          tail: [],
        },
        {
          heading: "Ownership",
          body: [
            "Once the project is paid in full, the final delivered page and its copy are yours to use. We may show non-confidential work in our portfolio unless you ask us not to.",
          ],
          list: [],
          tail: [],
        },
        {
          heading: "Limitation of liability",
          body: [
            "We deliver our work with care, but we cannot guarantee specific business outcomes such as sales or ranking. Our liability is limited to the amount you paid for the project.",
          ],
          list: [],
          tail: [],
        },
      ],
      contact: {
        heading: "Contact",
        before: "Questions about these terms? Reach us through the ",
        link: "contact form",
        after: " on our homepage.",
        href: "/#contact",
      },
    },
    privacy: {
      title: "Privacy Policy",
      intro:
        "This policy explains what information Godinez & Wittwer collects when you use our website or contact us about a landing-page project, and how we handle it.",
      sections: [
        {
          heading: "Information we collect",
          body: ["When you submit the project brief form, we collect the details you provide:"],
          list: [
            "Your name and email address",
            "The Fiverr category or service you sell",
            "Anything you write in the message field about your project",
          ],
          tail: [
            "We also collect basic, non-identifying analytics about how visitors use the site, such as pages viewed and general location, to improve the experience.",
          ],
        },
        {
          heading: "How we use your information",
          body: [],
          list: [
            "To reply to your enquiry with a strategy and quote",
            "To deliver and support the work you hire us for",
            "To improve our website and services",
          ],
          tail: [
            "We do not sell your personal information, and we do not share it except as needed to deliver your project.",
          ],
        },
        {
          heading: "Data retention",
          body: [
            "We keep enquiry details only as long as needed to respond and, if you become a client, to complete and support your project. You can ask us to delete your information at any time.",
          ],
          list: [],
          tail: [],
        },
        {
          heading: "Your choices",
          body: [
            "You can request access to, correction of, or deletion of the information we hold about you by contacting us. We will respond within a reasonable time.",
          ],
          list: [],
          tail: [],
        },
      ],
      contact: {
        heading: "Contact",
        before: "Questions about this policy? Email us at ",
        link: "godinezwittwer.dev@gmail.com",
        after: ".",
        href: "mailto:godinezwittwer.dev@gmail.com",
      },
    },
  },
  meta: {
    titleHome: "Godinez & Wittwer — Landing Pages & Websites, Engineered",
    titleAbout: "About — Godinez & Wittwer",
    titleProjects: "Our Projects — Godinez & Wittwer",
    titleNotFound: "Page not found — Godinez & Wittwer",
    titleTerms: "Terms of Service — Godinez & Wittwer",
    titlePrivacy: "Privacy Policy — Godinez & Wittwer",
  },
  error: {
    title: "Something went wrong.",
    reload: "Reload",
  },
  notFound: {
    code: "404",
    title: "This page took a wrong turn.",
    body: "The link is broken or the page has moved. Let's get you back to solid ground.",
    cta: "Back to home",
  },
}

export type Lang = "en" | "de"
export type Content = typeof en

const de: Content = {
  nav: {
    tabs: { work: "Arbeiten", projects: "Unsere Projekte", about: "Über uns" },
    cta: "Loslegen",
    skip: "Zum Inhalt springen",
    home: "Godinez & Wittwer — nach oben",
    openMenu: "Menü öffnen",
    closeMenu: "Menü schließen",
    language: "Sprache",
  },
  hero: {
    kicker: "Fiverr Web-Studio · Schweiz",
    line1: "Saubere Websites,",
    line2: "gebaut, um zu",
    rotating: ["überzeugen.", "begeistern.", "verkaufen.", "konvertieren."],
    subhead:
      "Wir sind Joel und Dee — zwei Entwickler, die hochkonvertierende Landingpages und Websites für Fiverr-Anbieter gestalten und bauen. Echter Code, echte Tests, keine Templates.",
    ctaPrimary: "Projekt starten",
    ctaSecondary: "Unsere Arbeiten",
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
    kicker: "Sechs Leistungen, ein Ziel",
    heading: "Alles, was eine überzeugende Seite braucht",
    cardAction: "Loslegen",
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
    kicker: "Der Ablauf",
    heading: "Von der Idee zur Live-Seite — vier klare Schritte",
    steps: [
      { n: "01", title: "Briefing", desc: "Ein fokussiertes Briefing: dein Angebot, deine Zielgruppe, dein Ziel. Kein Füllstoff — nur, was die Seite leisten muss." },
      { n: "02", title: "Strategie & Wireframe", desc: "Wir planen die Struktur — Hero, Nutzen, Einwände, CTA. Jeder Abschnitt verdient seinen Platz, bevor wir gestalten." },
      { n: "03", title: "Design & Umsetzung", desc: "Design und Code entstehen zusammen. Echte Komponenten, echte Inhalte, laufend getestet — kein flaches Mockup." },
      { n: "04", title: "Review & Launch", desc: "Wir überarbeiten, bis es passt, testen auf allen Geräten und übergeben sauber — als Code oder live veröffentlicht." },
    ],
    guaranteeTitle: "100% Zufriedenheitsgarantie",
    guaranteeDesc: "Nach zwei Überarbeitungen nicht zufrieden? Du bekommst dein Geld zurück — ohne Wenn und Aber.",
    guaranteeCta: "Seite sichern",
  },
  work: {
    kicker: "Ausgewählte Arbeiten",
    heading: "Beweis für Handwerk",
    subhead:
      "Kundenprojekte starten gerade erst — hier ist, was wir gebaut haben, um unsere Bandbreite zu zeigen: Konzeptseiten, komplett gestaltet und programmiert.",
    categories: ["Eco-Tech · Landingpage", "Editorial · Portfolio", "SaaS · Marketing-Website"],
    tag: "Konzept",
    comingSoon: "Live-Seite kommt bald",
    visit: "Live-Seite besuchen",
    learnMore: "Mehr erfahren",
  },
  projects: {
    kicker: "Konzeptarbeiten",
    heading: "Unsere Projekte",
    intro:
      "Kundenprojekte starten gerade erst — deshalb zeigen diese drei Konzeptseiten, wie wir wirklich denken und arbeiten: echte Struktur, erfundene Briefings, komplett programmiert — keine Templates, keine Standardlayouts.",
    backCta: "Zurück zu den Arbeiten",
    items: [
      {
        description:
          "Eine fokussierte Landingpage für ein fiktives Nachhaltigkeits-Startup. Das Briefing war simpel: aus einem Scroll wird eine Anmeldung. Jeder Abschnitt — Hero, Angebot, Beweis, Einwand, Call-to-Action — verdient seinen Platz, genau so geplant, wie wir eine echte Kundenseite strukturieren würden.",
      },
      {
        description:
          "Ein Portfolio-Konzept im Magazin-Stil für eine:n Autor:in und Fotograf:in. Die Herausforderung war typografisch: ein Layout, das langen Texten Raum gibt und wie eine echte Publikation wirkt statt wie ein generisches Galerie-Template.",
      },
      {
        description:
          "Eine Marketing-Website für eine erfundene Infrastruktur-Management-Plattform. Gebaut, um ein technisches Produkt einer nicht-technischen Zielgruppe zu erklären — ein klarer Funktionsüberblick, eine Plattform-Erklärung und ein Anmeldeprozess, der nicht überfordert.",
      },
    ],
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
    submit: "Briefing senden",
    submitting: "Wird gesendet…",
    successTitle: "Briefing erhalten",
    successBody: "Wir schauen uns deinen Gig an und antworten innerhalb von 24 Stunden mit Strategie und Angebot.",
    optional: "(optional)",
    errName: "Bitte gib deinen Namen ein.",
    errEmailReq: "Bitte gib deine E-Mail-Adresse ein.",
    errEmailInvalid: "Diese E-Mail-Adresse sieht nicht richtig aus — prüf sie auf Tippfehler.",
    errMessage: "Erzähl uns kurz von deinem Gig.",
    errMessageShort: "Ein, zwei Sätze mehr helfen uns, richtig zu antworten.",
    errCaptcha: "Bitte bestätige mit dem Check oben, dass du ein Mensch bist.",
    errSend: "Beim Senden ist etwas schiefgelaufen. Schreib uns direkt an godinezwittwer.dev@gmail.com.",
  },
  footer: {
    copyright: "© 2026 Godinez & Wittwer — Web-Studio. Schweiz.",
    privacy: "Datenschutz",
    terms: "AGB",
    contact: "Kontakt",
  },
  legal: {
    kicker: "Rechtliches",
    back: "Zurück zur Startseite",
    updated: "Zuletzt aktualisiert: 29. August 2026",
    note: "Dies ist eine Vorlage. Lass sie von einer Rechtsberatung prüfen und ersetze die Platzhalter durch deine eigenen Angaben, bevor du dich im Produktivbetrieb darauf verlässt.",
    terms: {
      /* ­ is a soft hyphen. The German titles are compound nouns too long
         for the page's title rail, and browser auto-hyphenation needs a German
         dictionary we can't count on — so the compound seams are marked
         explicitly. They are invisible unless the line actually breaks. */
      title: "Allgemeine Geschäfts­bedingungen",
      intro:
        "Diese Bedingungen regeln die Nutzung der Website von Godinez & Wittwer sowie die von uns angebotenen Landingpage-Design- und Textleistungen. Indem du uns beauftragst oder diese Website nutzt, stimmst du ihnen zu.",
      sections: [
        {
          heading: "Unsere Leistungen",
          body: [
            "Godinez & Wittwer gestaltet und textet Landingpages für Fiverr-Anbieter und -Käufer. Der genaue Umfang, Zeitplan und Preis für dein Projekt werden vor Beginn schriftlich vereinbart.",
          ],
          list: [],
          tail: [],
        },
        {
          heading: "Überarbeitungen und Lieferung",
          body: [
            "Jedes Projekt umfasst zwei Überarbeitungsrunden, sofern nicht anders angegeben. Lieferfristen sind Schätzungen und hängen davon ab, dass wir die benötigten Inhalte und dein Feedback rechtzeitig erhalten.",
          ],
          list: [],
          tail: [],
        },
        {
          heading: "Zahlung",
          body: [
            "Honorare, Anzahlungen und Zahlungspläne sind in deiner Projektvereinbarung festgelegt. Die Arbeit beginnt, sobald die vereinbarte Anzahlung eingegangen ist.",
          ],
          list: [],
          tail: [],
        },
        {
          heading: "Rückerstattungen",
          body: [
            "Wenn du nach den zwei enthaltenen Überarbeitungsrunden nicht zufrieden bist, hast du Anspruch auf eine vollständige Rückerstattung, wie auf unserer Startseite beschrieben. Rückerstattungsanfragen sind schriftlich zu stellen.",
          ],
          list: [],
          tail: [],
        },
        {
          heading: "Eigentum",
          body: [
            "Sobald das Projekt vollständig bezahlt ist, gehören die final gelieferte Seite und ihre Texte dir. Wir dürfen nicht vertrauliche Arbeiten in unserem Portfolio zeigen, sofern du dem nicht widersprichst.",
          ],
          list: [],
          tail: [],
        },
        {
          heading: "Haftungsbeschränkung",
          body: [
            "Wir liefern unsere Arbeit mit Sorgfalt, können aber bestimmte geschäftliche Ergebnisse wie Verkäufe oder Rankings nicht garantieren. Unsere Haftung ist auf den von dir für das Projekt gezahlten Betrag beschränkt.",
          ],
          list: [],
          tail: [],
        },
      ],
      contact: {
        heading: "Kontakt",
        before: "Fragen zu diesen Bedingungen? Erreiche uns über das ",
        link: "Kontaktformular",
        after: " auf unserer Startseite.",
        href: "/#contact",
      },
    },
    privacy: {
      title: "Datenschutz­erklärung",
      intro:
        "Diese Erklärung beschreibt, welche Informationen Godinez & Wittwer erfasst, wenn du unsere Website nutzt oder uns wegen eines Landingpage-Projekts kontaktierst, und wie wir damit umgehen.",
      sections: [
        {
          heading: "Welche Informationen wir erfassen",
          body: ["Wenn du das Projekt-Briefing-Formular absendest, erfassen wir die von dir angegebenen Daten:"],
          list: [
            "Deinen Namen und deine E-Mail-Adresse",
            "Die Fiverr-Kategorie oder Dienstleistung, die du anbietest",
            "Alles, was du im Nachrichtenfeld über dein Projekt schreibst",
          ],
          tail: [
            "Ausserdem erfassen wir grundlegende, nicht personenbezogene Analysedaten darüber, wie Besucher die Website nutzen — etwa aufgerufene Seiten und ungefähren Standort —, um das Erlebnis zu verbessern.",
          ],
        },
        {
          heading: "Wie wir deine Informationen verwenden",
          body: [],
          list: [
            "Um auf deine Anfrage mit einer Strategie und einem Angebot zu antworten",
            "Um die von dir beauftragte Arbeit zu liefern und zu betreuen",
            "Um unsere Website und Dienste zu verbessern",
          ],
          tail: [
            "Wir verkaufen deine personenbezogenen Daten nicht und geben sie nur weiter, soweit es zur Umsetzung deines Projekts nötig ist.",
          ],
        },
        {
          heading: "Speicherdauer",
          body: [
            "Wir bewahren Anfragedaten nur so lange auf, wie es zur Beantwortung nötig ist — und, falls du Kunde wirst, zur Umsetzung und Betreuung deines Projekts. Du kannst jederzeit die Löschung deiner Daten verlangen.",
          ],
          list: [],
          tail: [],
        },
        {
          heading: "Deine Rechte",
          body: [
            "Du kannst Auskunft über die zu dir gespeicherten Daten sowie deren Berichtigung oder Löschung verlangen, indem du uns kontaktierst. Wir antworten innerhalb einer angemessenen Frist.",
          ],
          list: [],
          tail: [],
        },
      ],
      contact: {
        heading: "Kontakt",
        before: "Fragen zu dieser Erklärung? Schreib uns an ",
        link: "godinezwittwer.dev@gmail.com",
        after: ".",
        href: "mailto:godinezwittwer.dev@gmail.com",
      },
    },
  },
  meta: {
    titleHome: "Godinez & Wittwer — Landingpages & Websites, sauber gebaut",
    titleAbout: "Über uns — Godinez & Wittwer",
    titleProjects: "Unsere Projekte — Godinez & Wittwer",
    titleNotFound: "Seite nicht gefunden — Godinez & Wittwer",
    titleTerms: "AGB — Godinez & Wittwer",
    titlePrivacy: "Datenschutzerklärung — Godinez & Wittwer",
  },
  error: {
    title: "Etwas ist schiefgelaufen.",
    reload: "Neu laden",
  },
  notFound: {
    code: "404",
    title: "Diese Seite hat sich verlaufen.",
    body: "Der Link ist defekt oder die Seite wurde verschoben. Bringen wir dich zurück auf festen Boden.",
    cta: "Zur Startseite",
  },
}

export const translations: Record<Lang, Content> = { en, de }
