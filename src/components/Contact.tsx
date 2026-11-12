import { useEffect, useState, type ReactNode } from "react";
import { contact, experience, person, sheets } from "../data/content";
import { Sheet } from "./Sheet";
import { ArrowUpRight, Check, Copy, FileDown, FileText, Mail, Phone } from "lucide-react";
import { GitHubIcon, Icon, LinkedInIcon, WhatsAppIcon } from "./Icon";
import { reveal } from "../reveal";

export function Contact({ year: buildYear }: { year: number }) {
  // Built pages carry the build year; correct it in the browser if the site hasn't been rebuilt since.
  const [year, setYear] = useState(buildYear);
  useEffect(() => setYear(new Date().getFullYear()), []);
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(contact.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Older browsers / insecure contexts: fall back to a temporary textarea.
      const ta = document.createElement("textarea");
      ta.value = contact.email;
      ta.setAttribute("readonly", "");
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      const ok = document.execCommand("copy");
      ta.remove();
      setCopied(ok);
      if (ok) window.setTimeout(() => setCopied(false), 2000);
      else window.prompt("Copy this email address:", contact.email);
    }
  };

  const rows = [
    {
      k: "Email",
      icon: Mail,
      v: (
        <span className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <a href={`mailto:${contact.email}`} className="ink-link break-all">
            {contact.email}
          </a>
          <button type="button" onClick={copy} className="btn btn-ghost min-h-9 px-2.5 py-1 text-xs">
            <Icon icon={copied ? Check : Copy} size={14} />
            {copied ? "Copied" : "Copy"}
            <span className="sr-only"> email address</span>
          </button>
          <span className="sr-only" aria-live="polite">
            {copied ? "Email address copied" : ""}
          </span>
        </span>
      ),
    },
    {
      k: "Phone",
      icon: Phone,
      v: (
        <a href={contact.phone.href} className="ink-link">
          {contact.phone.display}
        </a>
      ),
    },
    {
      k: "WhatsApp",
      icon: WhatsAppIcon,
      v: (
        <a href={contact.whatsapp.href} target="_blank" rel="noopener noreferrer" className="ink-link">
          Chat on WhatsApp
          <Icon icon={ArrowUpRight} size={14} className="ml-0.5 inline-block align-[-2px]" />
          <span className="sr-only"> (opens in a new tab)</span>
        </a>
      ),
    },
    {
      k: "LinkedIn",
      icon: LinkedInIcon,
      v: (
        <a href={contact.linkedin.href} target="_blank" rel="noopener noreferrer" className="ink-link">
          {contact.linkedin.display}
          <Icon icon={ArrowUpRight} size={14} className="ml-0.5 inline-block align-[-2px]" />
          <span className="sr-only"> (opens in a new tab)</span>
        </a>
      ),
    },
    {
      k: "GitHub",
      icon: GitHubIcon,
      v: (
        <a href={contact.github.href} target="_blank" rel="noopener noreferrer" className="ink-link">
          {contact.github.display}
          <Icon icon={ArrowUpRight} size={14} className="ml-0.5 inline-block align-[-2px]" />
          <span className="sr-only"> (opens in a new tab)</span>
        </a>
      ),
    },
    {
      k: "CV",
      icon: FileText,
      v: (
        <a href={contact.cv.href} download={contact.cv.downloadName} className="ink-link">
          Download CV <span className="text-ink-3">({contact.cv.meta})</span>
        </a>
      ),
    },
  ];

  return (
    <Sheet id="contact" as="footer" kicker="Contact" labelledBy="contact-title">
      <div className="grid gap-10 px-4 pb-10 pt-8 sm:px-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-12 lg:px-10 lg:pb-12 lg:pt-10">
        <div>
          <h2 id="contact-title" className="display text-balance text-[clamp(2rem,1.4rem+2.8vw,3.6rem)]">
            Hiring for a senior full-stack or mobile role? Let's talk.
          </h2>
          <p className="mt-4 max-w-[46ch] text-ink-2">
            Based in {person.location}. {person.availability}. Email is the fastest way to reach me.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a href={`mailto:${contact.email}`} className="btn btn-primary">
              <Icon icon={Mail} />
              Email me
            </a>
            <a href={contact.cv.href} download={contact.cv.downloadName} className="btn btn-ghost">
              <Icon icon={FileDown} />
              Download CV
              <span className="sr-only"> ({contact.cv.meta})</span>
            </a>
          </div>
        </div>
        <dl className="self-start border-t border-ink">
          {rows.map((r, i) => (
            <div key={r.k} {...reveal(i)} className="grid gap-1 border-b border-line-strong py-3 sm:grid-cols-[6.5rem_1fr] sm:gap-4">
              <dt className="label flex items-center gap-2 pt-0.5">
                <Icon icon={r.icon} size={15} />
                {r.k}
              </dt>
              <dd>{r.v}</dd>
            </div>
          ))}
        </dl>
      </div>

      {/* Drawing title block */}
      <div className="grid border-t border-line-strong font-mono text-[0.75rem] sm:grid-cols-2 lg:grid-cols-[1.2fr_1.4fr_1fr_0.8fr]">
        <TB k="Drawn by" v={`${person.name} (${person.handle})`} />
        <TB k="Title" v="Portfolio · Full-Stack & Mobile" />
        <TB k="Built with" v="React · TypeScript · Tailwind. No trackers." />
        <TB
          k="Sheet"
          v={
            <>
              {sheets.length} of {sheets.length} · © {year} ·{" "}
              <a href="#top" className="ink-link no-print whitespace-nowrap">
                ↑ Sheet 01
              </a>
            </>
          }
        />
      </div>
      {/* Drawing number, as printed along the bottom edge of a sheet */}
      <div className="flex items-center gap-4 border-t border-line-strong px-4 py-2.5 sm:px-6">
        <p className="label shrink-0 text-ink">
          Dwg no. OA-PF-{year} · Rev {String.fromCharCode(64 + experience.length)}
        </p>
        <span aria-hidden="true" className="barcode h-6 min-w-0 flex-1" />
        <p className="label hidden shrink-0 sm:block">End of set</p>
      </div>
    </Sheet>
  );
}

function TB({ k, v }: { k: string; v: ReactNode }) {
  return (
    <div className="border-b border-line px-4 py-2.5 sm:px-6 lg:border-b-0 lg:border-r lg:last:border-r-0">
      <p className="label text-[0.6875rem]">{k}</p>
      <p className="mt-0.5 text-ink">{v}</p>
    </div>
  );
}
