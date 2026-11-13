import { contact, heroMetrics, person, sheets } from "../data/content";
import { Dimension } from "./Dimension";
import { Sheet } from "./Sheet";
import { FileDown, Mail, Phone } from "lucide-react";
import { GitHubIcon, Icon, LinkedInIcon, WhatsAppIcon } from "./Icon";
import { reveal } from "../reveal";
import { useRef, type RefObject } from "react";

declare const __BUILD_MONTH__: string;

export function Hero() {
  const coords = useRef<HTMLSpanElement>(null);
  const needle = useRef<SVGGElement>(null);
  return (
    <Sheet
      id="top"
      kicker="General arrangement"
      labelledBy="hero-title"
      aside={
        <span>
          {/* CAD-style cursor readout, filled in by the pointer handler below */}
          <span aria-hidden="true" className="hidden tabular-nums lg:inline">
            <span ref={coords}>X 0000 · Y 0000</span> ·{" "}
          </span>
          Scale 1:1
        </span>
      }
    >
      <div
        className="sheet-grid grid-light relative"
        onPointerMove={(e) => {
          const r = e.currentTarget.getBoundingClientRect();
          e.currentTarget.style.setProperty("--mx", `${Math.round(e.clientX - r.left)}px`);
          e.currentTarget.style.setProperty("--my", `${Math.round(e.clientY - r.top)}px`);
          const pad = (n: number) => String(Math.max(0, Math.round(n))).padStart(4, "0");
          if (coords.current) coords.current.textContent = `X ${pad(e.clientX - r.left)} · Y ${pad(e.clientY - r.top)}`;
          // The compass needle in the drawing index turns to face the cursor.
          const c = needle.current?.ownerSVGElement?.getBoundingClientRect();
          if (c && needle.current) {
            const deg = (Math.atan2(e.clientY - (c.top + c.height / 2), e.clientX - (c.left + c.width / 2)) * 180) / Math.PI + 90;
            needle.current.style.rotate = `${deg.toFixed(1)}deg`;
          }
        }}
      >
        {/* Zone ruler along the top edge, as on a drawing border */}
        <div aria-hidden="true" className="hidden grid-cols-8 border-b border-line lg:grid">
          {Array.from({ length: 8 }, (_, i) => (
            <span key={i} className="border-r border-line py-0.5 text-center font-mono text-[0.625rem] text-ink-3 last:border-r-0">
              {i + 1}
            </span>
          ))}
        </div>

        <div className="grid gap-10 px-4 pb-8 pt-6 sm:px-6 sm:pb-10 sm:pt-8 lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-12 lg:px-10 lg:pb-12 lg:pt-10">
          <div className="relative flex flex-col">
            <h1 id="hero-title" className="order-1">
              <span className="block text-[1rem] font-semibold [font-stretch:112%] sm:text-[1.125rem]">
                {person.name}
                <span className="label mt-1 block font-normal sm:ml-2 sm:mt-0 sm:inline sm:align-[1px]">{person.role}</span>
              </span>
              <span className="display mt-3 block text-balance text-[clamp(1.95rem,1.2rem+2.9vw,3.5rem)]">
                {person.headline}
              </span>
            </h1>

            <p className="order-4 mt-6 max-w-[58ch] text-ink-2 sm:text-[1.125rem] lg:order-2">
              {person.intro} Based in {person.location}. {person.availability}.
            </p>

            <div className="order-2 mt-6 grid grid-cols-2 gap-4 sm:mt-8 sm:gap-8 lg:order-3 lg:max-w-[560px]">
              {heroMetrics.map((m, i) => (
                <Dimension key={m.label} metric={m} delay={200 + i * 250} />
              ))}
            </div>

            <div className="order-3 mt-6 flex flex-wrap gap-3 sm:mt-8 lg:order-4">
              <a href={`mailto:${contact.email}`} className="btn btn-primary">
                <Icon icon={Mail} />
                Email me
              </a>
              <a href={contact.cv.href} download={contact.cv.downloadName} className="btn btn-ghost">
                <Icon icon={FileDown} />
                Download CV
                <span className="sr-only"> ({contact.cv.meta})</span>
              </a>
              <p className="flex w-full flex-wrap gap-x-5 gap-y-1 pt-1 font-mono text-[0.875rem]">
                <a href={contact.linkedin.href} target="_blank" rel="noopener noreferrer" className="ink-link inline-flex items-center gap-1.5">
                  <Icon icon={LinkedInIcon} size={15} />
                  LinkedIn
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
                <a href={contact.github.href} target="_blank" rel="noopener noreferrer" className="ink-link inline-flex items-center gap-1.5">
                  <Icon icon={GitHubIcon} size={15} />
                  GitHub
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
                <a href={contact.phone.href} className="ink-link inline-flex items-center gap-1.5">
                  <Icon icon={Phone} size={15} />
                  {contact.phone.display}
                </a>
                <a href={contact.whatsapp.href} target="_blank" rel="noopener noreferrer" className="ink-link inline-flex items-center gap-1.5">
                  <Icon icon={WhatsAppIcon} size={15} />
                  {contact.whatsapp.display}
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              </p>
            </div>
            <Stamp />
          </div>

          <aside aria-label="Sheets" className="flex flex-col gap-6 lg:self-start">
            <nav aria-label="Drawing index" className="no-print border border-line-strong bg-paper">
              <p className="label flex items-center justify-between border-b border-line-strong px-3 py-2 text-ink">
                Drawing index
                <Compass needle={needle} />
              </p>
              <ol className="divide-y divide-line">
                {sheets.slice(1).map((s, i) => (
                  <li key={s.id} {...reveal(i + 1)}>
                    <a
                      href={`#${s.id}`}
                      className="group flex items-baseline gap-3 px-3 py-1.5 text-[0.9375rem] no-underline hover:bg-paper-2"
                    >
                      <kbd data-key={i + 2} className="keycap">{i + 2}</kbd>
                      <span className="group-hover:underline">{s.title}</span>
                      <span aria-hidden="true" className="ml-auto -translate-x-1 font-mono text-xs text-accent opacity-0 transition group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100">
                        →
                      </span>
                    </a>
                  </li>
                ))}
              </ol>
              <p className="label hidden border-t border-line px-3 py-2 lg:block">
                Press <kbd className="keycap">1</kbd>–<kbd className="keycap">{sheets.length}</kbd> to jump between sheets
              </p>
            </nav>
          </aside>
        </div>
      </div>
    </Sheet>
  );
}

/** Issue stamp, as on a released drawing. It lands with a thud once the page has loaded. */
function Stamp() {
  const [y, m] = __BUILD_MONTH__.split("-");
  const month = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"][Number(m) - 1];
  return (
    <p className="stamp-mark no-print absolute bottom-9 right-1 hidden lg:block">
      <span className="sr-only">Status: </span>
      <span className="block text-[0.625rem] tracking-[0.18em]">Issued for hire</span>
      <span className="display block text-[1.375rem] leading-none">Open to roles</span>
      <span className="block text-[0.625rem] tracking-[0.18em]">
        Remote · hybrid · {month} {y}
      </span>
    </p>
  );
}

/** North arrow; the needle turns to face the cursor (driven by the hero's pointer handler). */
function Compass({ needle }: { needle: RefObject<SVGGElement | null> }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" width="26" height="26" className="compass -my-1 hidden lg:block">
      <circle cx="12" cy="12" r="10.5" fill="none" stroke="var(--line-strong)" />
      <path d="M12 1.5v2.5M12 20v2.5M1.5 12H4M20 12h2.5" stroke="var(--line-strong)" />
      <g ref={needle}>
        <path d="M12 4.5 14.6 12H9.4z" fill="var(--accent)" />
        <path d="M12 19.5 14.6 12H9.4z" fill="var(--ink-3)" />
      </g>
      <circle cx="12" cy="12" r="1.2" fill="var(--paper)" stroke="var(--ink)" strokeWidth="0.8" />
    </svg>
  );
}
