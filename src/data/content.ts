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
      /** Path under /public, e.g. "/images/pmcsms-compose.webp" */
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

/** A numbered marker on a screenshot; x/y are percentages of the image. */
export type Callout = { n: number; x: number; y: number; label: string };
export type PhoneShot = { webp: string; avif?: string; width: number; height: number; alt: string; callouts?: Callout[] };

export type ShippedProject = {
  name: string;
  summary: string;
  contribution: string[];
  stack: string[];
  platforms: string;
  links: LinkItem[];
  /** Optional app screenshots (portrait), shown under the row */
  screenshots?: { caption: string; shots: PhoneShot[] };
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
  whatsapp: { display: "WhatsApp", href: "https://wa.me/2349036176161" },
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
      kind: "image",
      webp: "/images/vtunownow-editor.webp",
      avif: "/images/vtunownow-editor.avif",
      width: 1600,
      height: 1000,
      alt: "The VTUNowNow template editor: a sidebar of colour pickers and text fields on the left, and a live vendor storefront preview on the right with the edited headline highlighted.",
      caption: "VTUNowNow template editor, run locally with a sample storefront",
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
    role: "I built the platform end to end: messaging, the wallet top-up system and the real-time analytics dashboard.",
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
      kind: "image",
      webp: "/images/pmcsms-compose.webp",
      avif: "/images/pmcsms-compose.avif",
      width: 1600,
      height: 1320,
      alt: "The PMCSMS Send Bulk SMS screen: a sender ID picker, a recipients box showing four numbers in international format with a 4 recipients badge, group and file upload options, and a message with a live page and character counter.",
      caption: "PMCSMS Send Bulk SMS screen, rendered locally with sample data",
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
    stack: ["Flutter", "Firebase", "PHP", "MySQL"],
    platforms: "Android · iOS",
    links: [
      { label: "Website", href: "https://simservers.io/" },
      { label: "Google Play", href: "https://play.google.com/store/apps/details?id=com.cdlp.simserver" },
      { label: "App Store", href: "https://apps.apple.com/ng/app/simservers-io/id6753812596" },
    ],
  },
  {
    name: "Bubu Browser",
    summary: "Mobile browser with news aggregation and a built-in social network.",
    contribution: [
      "The whole app: Flutter client, PHP API and MySQL, with Firebase.",
      "Multi-tab browsing, bookmarks and a download manager.",
      "5 search engines, push notifications and video ads.",
      "A social layer: posts, a feed, profiles, followers and alerts.",
      "Verification requests, blocked users, community guidelines and in-app reporting.",
    ],
    stack: ["Flutter", "Firebase", "PHP API", "MySQL"],
    platforms: "Android",
    screenshots: {
      caption: "Bubu Browser: home, profile and account menu",
      shots: [
        {
          webp: "/images/bubu-home.webp",
          avif: "/images/bubu-home.avif",
          width: 480,
          height: 1043,
          alt: "Bubu Browser home screen: a search bar, a grid of shortcut tiles to news and social sites, and a row of video reels.",
          callouts: [
            { n: 1, x: 82, y: 18, label: "Search the web with any of 5 search engines" },
            { n: 2, x: 8, y: 37, label: "Shortcut tiles to news and social sites" },
            { n: 3, x: 12, y: 66, label: "Reels: short videos on the home screen" },
            { n: 4, x: 58, y: 92, label: "Browser controls with a multi-tab switcher" },
          ],
        },
        {
          webp: "/images/bubu-profile.webp",
          avif: "/images/bubu-profile.avif",
          width: 480,
          height: 1043,
          alt: "Bubu Browser profile screen with post, follower and following counts, and a post below.",
          callouts: [{ n: 5, x: 88, y: 35, label: "Profiles with posts and followers" }],
        },
        {
          webp: "/images/bubu-menu.webp",
          avif: "/images/bubu-menu.avif",
          width: 480,
          height: 1043,
          alt: "Bubu Browser account menu with posts, verification, profile editing, notification settings, blocked users and help.",
          callouts: [{ n: 6, x: 90, y: 60, label: "Account menu: verification, notifications and blocked users" }],
        },
      ],
    },
    links: [
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
      "I lead development of fintech, EdTech, health, media, e-commerce and investment platforms.",
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
        name: "LifeComeLive",
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

/**
 * Skills, each with where it was used (project or employer names as they appear on the site).
 * The Skills section shows this as a cross-reference; leave usedIn empty to show a plain tag.
 */
export type Skill = { name: string; usedIn?: string[] };
export const skills: { area: string; items: Skill[] }[] = [
  {
    area: "Frontend",
    items: [
      { name: "React", usedIn: ["VTUNowNow", "NCDF Group", "Maysync Group"] },
      { name: "JavaScript", usedIn: ["PMCSMS", "CDLPHUB Solutions LTD"] },
      { name: "TypeScript", usedIn: ["VTUNowNow", "NCDF Group"] },
      { name: "HTML" },
      { name: "CSS" },
      { name: "Tailwind", usedIn: ["VTUNowNow", "Maysync Group"] },
      { name: "Bootstrap", usedIn: ["NCDF Group", "CDLPHUB Solutions LTD"] },
    ],
  },
  {
    area: "Mobile",
    items: [
      { name: "Flutter", usedIn: ["Autobiz.app", "SimServers.io", "Bubu Browser", "NCDF Group", "CDLPHUB Solutions LTD"] },
      { name: "Dart", usedIn: ["Autobiz.app", "SimServers.io", "Bubu Browser", "NCDF Group", "CDLPHUB Solutions LTD"] },
      { name: "Android", usedIn: ["Autobiz.app", "SimServers.io", "Bubu Browser"] },
      { name: "iOS", usedIn: ["Autobiz.app", "SimServers.io"] },
    ],
  },
  {
    area: "Backend",
    items: [
      { name: "PHP (Laravel)", usedIn: ["VTUNowNow", "PMCSMS", "Autobiz.app", "SimServers.io", "Bubu Browser", "NCDF Group", "Maysync Group"] },
      { name: "Node.js", usedIn: ["VTUNowNow", "Aldrenor", "LifeComeLive"] },
      { name: "Python", usedIn: ["Maysync Group"] },
      { name: "MySQL", usedIn: ["VTUNowNow", "PMCSMS", "Autobiz.app", "SimServers.io", "Bubu Browser"] },
      { name: "PostgreSQL", usedIn: ["Aldrenor", "LifeComeLive"] },
      { name: "Firebase", usedIn: ["Autobiz.app", "SimServers.io", "Bubu Browser"] },
      { name: "REST APIs", usedIn: ["VTUNowNow", "SimServers.io", "Maysync Group"] },
    ],
  },
  {
    area: "Tools",
    items: [
      { name: "Git/GitHub" },
      { name: "CI/CD" },
      { name: "Payment gateway integration", usedIn: ["Autobiz.app", "PMCSMS"] },
    ],
  },
];

/** Where each project or employer lives on the page, for cross-reference links. */
export const anchors: Record<string, string> = {
  VTUNowNow: "#vtunownow",
  PMCSMS: "#pmcsms",
  "Autobiz.app": "#work",
  "SimServers.io": "#work",
  "Bubu Browser": "#work",
  "NCDF Group": "#experience",
  "CDLPHUB Solutions LTD": "#experience",
  "Maysync Group": "#experience",
  Aldrenor: "#experience",
  LifeComeLive: "#experience",
};

/** Career milestones for the Background timeline (YYYY-MM). The chain runs to the build date. */
export const path: { date: string; title: string; org: string }[] = [
  { date: "2021-06", title: "B.Tech Agricultural Engineering", org: "LAUTECH" },
  { date: "2023-02", title: "Software Engineer", org: "Maysync Group" },
  { date: "2025-03", title: "MSc Civil Engineering", org: "University of Ibadan" },
  { date: "2026-01", title: "Full-stack Developer", org: "CDLPHUB" },
  { date: "2026-06", title: "Full-stack Engineer", org: "NCDF Group" },
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
