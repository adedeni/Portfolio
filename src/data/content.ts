/**
 * All site content lives here. Edit this file to change copy, projects,
 * links or experience. Components only read from it.
 *
 * Placeholders:
 *  - A link with `href: null` renders as a clearly marked "link pending" label.
 *  - A screenshot with `kind: "pending"` renders as a hatched placeholder figure.
 *  To supply a screenshot, add WebP/AVIF files to /public/images (see README)
 *  and replace the pending entry with `{ kind: "image", ... }`.
 */

export type LinkItem = {
  label: string;
  /** null = not supplied yet; renders as a marked placeholder */
  href: string | null;
};

export type Screenshot =
  | {
      kind: "image";
      /** Path under /public, e.g. "/images/pmcsms-dashboard.webp" */
      webp: string;
      /** Optional AVIF version, preferred by browsers that support it */
      avif?: string;
      width: number;
      height: number;
      alt: string;
      caption: string;
    }
  | { kind: "pending"; caption: string; needed: string };

export type Metric = { value: string; label: string };

export type CaseStudy = {
  id: string;
  name: string;
  kind: string;
  url: LinkItem;
  metrics: Metric[];
  problem: string;
  role: string;
  built: string[];
  outcome: string;
  stack: string[];
  screenshot: Screenshot;
};

export type ShippedProject = {
  name: string;
  summary: string;
  contribution: string[];
  stack: string[];
  platforms: string;
  links: LinkItem[];
};

export type Job = {
  company: string;
  companyNote?: string;
  role: string;
  start: string;
  end: string;
  points: string[];
  /** Named projects shown as highlight boxes under the job. */
  highlights?: { name: string; href: string; text: string }[];
};

export const site = {
  url: "https://adedeni.netlify.app/",
  title: "Olayode Adeshina, Software Engineer · Full-Stack & Mobile",
  description:
    "I build full-stack web and Flutter mobile apps for fintech, telecom and EdTech, including platforms used by 50,000+ businesses (PMCSMS) and 10,000+ entrepreneurs (VTUNowNow).",
  ogImage: "https://adedeni.netlify.app/og-image.png",
};

export const person = {
  name: "Olayode Adeshina",
  handle: "adedeni",
  initials: "OA",
  role: "Software Engineer · Full-Stack & Mobile",
  headline:
    "I build full-stack web and Flutter mobile apps for fintech, telecom and EdTech.",
  intro:
    "4+ years building mobile and full-stack web apps, from Laravel and Node.js backends and payment integrations to Flutter apps on Android and iOS.",
  sectors: ["Fintech", "Telecom", "EdTech"],
  experience: "4+ years",
  location: "Nigeria",
  availability: "Open to remote and hybrid roles",
  current: "Full-stack Engineer, NCDF Group",
};

export const contact = {
  email: "adeshinaolayodemubaraq@gmail.com",
  phone: { display: "+234 903 617 6161", href: "tel:+2349036176161" },
  linkedin: {
    display: "linkedin.com/in/adeshina-olayode",
    href: "https://www.linkedin.com/in/adeshina-olayode/",
  },
  github: { display: "github.com/adedeni", href: "https://github.com/adedeni" },
  cv: {
    href: "/olayode-adeshina-cv.pdf",
    downloadName: "Olayode-Adeshina-CV.pdf",
    meta: "PDF · 2 pages · 357 KB",
  },
};

/** Headline proof shown on the first screen. */
export const heroMetrics: Metric[] = [
  { value: "50,000+", label: "businesses on PMCSMS" },
  { value: "10,000+", label: "entrepreneurs on VTUNowNow" },
];

export const caseStudies: CaseStudy[] = [
  {
    id: "vtunownow",
    name: "VTUNowNow",
    kind: "White-label VTU business platform",
    url: { label: "vtunownow.com", href: "https://vtunownow.com" },
    metrics: [
      { value: "10,000+", label: "entrepreneurs running their own brand" },
      { value: "5", label: "vendor integrations, auto-fulfilled" },
    ],
    problem:
      "Entrepreneurs want to sell airtime, data, electricity and bill payments under their own brand. Most of them aren't technical, so they need the platform and the storefront to work without touching code.",
    role: "I built the backend, the vendor integrations and the visual template editor, and wrote the user guide.",
    built: [
      "Laravel/MySQL backend for the platform.",
      "Vendor integrations with MTN, Airtel, 9mobile, DSTV and Spectranet, with automated transaction fulfilment.",
      "A visual template editor in React, TypeScript, Vite and Tailwind. It loads the vendor's storefront in a sandboxed iframe and talks to it over a postMessage bridge, so vendors change colours, content and backgrounds live.",
      "A Node.js bundling pipeline that brings the Vite build into the existing PHP platform, plus six PHP API endpoints and a database table for saved edits.",
      "A 14-section user guide for vendors.",
    ],
    outcome:
      "10,000+ entrepreneurs run airtime, data, electricity and bill-payment businesses on the platform, and non-technical vendors restyle their storefronts themselves.",
    stack: ["Laravel", "MySQL", "React", "TypeScript", "Vite", "Tailwind", "Node.js", "PHP"],
    screenshot: {
      kind: "pending",
      caption: "VTUNowNow template editor in production",
      needed: "Screenshot of the editor with a vendor storefront loaded, about 1600×1000",
    },
  },
  {
    id: "pmcsms",
    name: "PMCSMS",
    kind: "Bulk SMS and multi-channel messaging platform",
    url: { label: "pmcsms.com", href: "https://pmcsms.com" },
    metrics: [
      { value: "50,000+", label: "businesses using the platform" },
      { value: "98.6%", label: "message delivery rate" },
      { value: "3", label: "channels: SMS, email, voice" },
    ],
    problem:
      "Businesses need to reach large customer lists by SMS, email and voice, under their own sender ID, without messaging numbers on the Do-Not-Disturb list, and with a clear view of what was delivered.",
    role: "I built the platform's messaging features and its wallet top-up system.",
    built: [
      "SMS, email and voice broadcast campaigns from one platform.",
      "Sender ID management, DND filtering and scheduled delivery.",
      "A real-time analytics dashboard for delivery.",
      "Wallet top-up by bank transfer, card and USSD.",
    ],
    outcome:
      "Used by 50,000+ businesses, with a 98.6% message delivery rate.",
    stack: ["Laravel", "PHP", "MySQL", "JavaScript"],
    screenshot: {
      kind: "pending",
      caption: "PMCSMS analytics dashboard",
      needed: "Screenshot of the real-time analytics dashboard, about 1600×1000",
    },
  },
];

export const shippedProjects: ShippedProject[] = [
  {
    name: "Autobiz.app",
    summary: "Multi-brand digital services platform.",
    contribution: [
      "Backend for authentication, service workflows and payments.",
      "Payments via PayPal, Visa/Mastercard and crypto.",
    ],
    stack: ["Flutter", "Firebase", "PHP/Laravel", "MySQL"],
    platforms: "Android · iOS",
    links: [
      { label: "Website", href: "https://autobiz.app/" },
      { label: "Google Play", href: "https://play.google.com/store/apps/details?id=com.cdlp.autobiz" },
      { label: "App Store", href: "https://apps.apple.com/ng/app/autobizapp/id6754074392" },
    ],
  },
  {
    name: "SimServers.io",
    summary: "SIM and telecom management platform.",
    contribution: [
      "Real-time SIM provisioning, monitoring and control.",
      "REST APIs for third-party telecom vendors.",
      "FCM push notifications.",
    ],
    stack: ["Flutter", "PHP", "FCM"],
    platforms: "Android · iOS",
    links: [
      { label: "Website", href: "https://simservers.io/" },
      { label: "Google Play", href: "https://play.google.com/store/apps/details?id=com.cdlp.simserver" },
      { label: "App Store", href: "https://apps.apple.com/ng/app/simservers-io/id6753812596" },
    ],
  },
  {
    name: "Bubu Browser",
    summary: "Mobile browser with news aggregation.",
    contribution: [
      "Multi-tab browsing, bookmarks and a download manager.",
      "5 search engines, push notifications and video ads.",
    ],
    stack: ["Flutter", "Firebase", "PHP API", "MySQL"],
    platforms: "Android",
    links: [
      { label: "Website", href: "https://bububrowser.netlify.app/" },
      {
        label: "Google Play",
        href: "https://play.google.com/store/apps/details?id=com.jacombeventures.bububrowser",
      },
    ],
  },
];

export const experience: Job[] = [
  {
    company: "NCDF Group",
    companyNote: "Nigerian Capital Development Fund",
    role: "Full-stack Engineer",
    start: "Jun 2026",
    end: "Present",
    points: [
      "I lead development of fintech, EdTech, e-commerce and investment platforms.",
      "I build Flutter/Dart apps for Android and iOS.",
      "I build web services with TypeScript, React, PHP and Bootstrap.",
    ],
    highlights: [
      {
        name: "ImpactKnowledge",
        href: "https://impactknowledge.net",
        text: "An EdTech platform with courses, exams, payments and a mobile app. I led its development alone.",
      },
      {
        name: "Aldrenor",
        href: "https://www.aldrenor.com",
        text: "A news and analysis platform covering Africa, with video, podcasts and a newsletter. I led development and built the frontend, the admin, and the video and podcast features, on a Node.js backend with PostgreSQL.",
      },
      {
        name: "LifeCome Health",
        href: "https://www.lifecomelive.com",
        text: "A health and care platform with online GP appointments by secure video, in-person clinics, wellbeing and care plans. I led development and built the frontend, the admin and the video features, on a Node.js backend with PostgreSQL.",
      },
    ],
  },
  {
    company: "CDLPHUB Solutions LTD",
    role: "Full-stack Developer",
    start: "Jan 2026",
    end: "Jun 2026",
    points: [
      "I built Flutter/Dart mobile apps.",
      "I built web solutions with JavaScript, Bootstrap and PHP.",
    ],
  },
  {
    company: "Maysync Group",
    role: "Software Engineer",
    start: "Feb 2023",
    end: "Dec 2025",
    points: [
      "I built React + Tailwind frontends with PHP (Laravel) and Python backends.",
      "I worked on API design and integration that improved reliability and reduced response latency.",
    ],
  },
];

export const skills: { area: string; items: string[] }[] = [
  {
    area: "Frontend",
    items: ["React", "JavaScript", "TypeScript", "HTML", "CSS", "Tailwind", "Bootstrap"],
  },
  { area: "Mobile", items: ["Flutter", "Dart", "Android", "iOS"] },
  {
    area: "Backend",
    items: ["PHP (Laravel)", "Node.js", "Python", "MySQL", "Firebase", "REST APIs"],
  },
  { area: "Tools", items: ["Git/GitHub", "CI/CD", "Payment gateway integration"] },
];

export const education = [
  {
    degree: "MSc Civil Engineering",
    school: "University of Ibadan",
    date: "Mar 2025",
    detail: "GPA 6.88/7.00 · Departmental Best Graduating Student",
  },
  {
    degree: "B.Tech Agricultural Engineering",
    school: "LAUTECH",
    date: "Jun 2021",
    detail: "Second Class Upper · top 3% of 120",
  },
];

export const memberships = [
  "Graduate Member, Nigeria Society of Engineers",
  "Member, Nigerian Institution of Agricultural Engineers",
];

/** Section index ("drawing index"). Order = page order. */
export const sheets = [
  { id: "top", no: "01", title: "General arrangement" },
  { id: "vtunownow", no: "02", title: "Case study: VTUNowNow" },
  { id: "pmcsms", no: "03", title: "Case study: PMCSMS" },
  { id: "work", no: "04", title: "More shipped work" },
  { id: "experience", no: "05", title: "Experience" },
  { id: "skills", no: "06", title: "Skills" },
  { id: "background", no: "07", title: "Engineering background" },
  { id: "contact", no: "08", title: "Contact" },
] as const;

export type SheetId = (typeof sheets)[number]["id"];
