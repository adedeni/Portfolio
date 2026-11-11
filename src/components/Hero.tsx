import { contact, heroMetrics, person, sheets } from "../data/content";
import { Dimension } from "./Dimension";
import { Sheet } from "./Sheet";
import { FileDown, Mail, Phone } from "lucide-react";
import { GitHubIcon, Icon, LinkedInIcon } from "./Icon";

export function Hero() {
  return (
    <Sheet id="top" kicker="General arrangement" aside={<span>Scale 1:1</span>} labelledBy="hero-title">
      <div className="sheet-grid relative">
        {/* Zone ruler along the top edge, as on a drawing border */}
        <div aria-hidden="true" className="hidden grid-cols-8 border-b border-line lg:grid">
          {Array.from({ length: 8 }, (_, i) => (
            <span key={i} className="border-r border-line py-0.5 text-center font-mono text-[0.625rem] text-ink-3 last:border-r-0">
              {i + 1}
            </span>
          ))}
        </div>

        <div className="grid gap-10 px-4 pb-8 pt-6 sm:px-6 sm:pb-10 sm:pt-8 lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-12 lg:px-10 lg:pb-12 lg:pt-12">
          <div className="flex flex-col">
            <h1 id="hero-title" className="order-1">
              <span className="block text-[1rem] font-semibold [font-stretch:112%] sm:text-[1.125rem]">
                {person.name}
                <span className="label mt-1 block font-normal sm:ml-2 sm:mt-0 sm:inline sm:align-[1px]">{person.role}</span>
              </span>
              <span className="display mt-3 block text-balance text-[clamp(1.95rem,1.15rem+3.6vw,4.1rem)]">
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
              </p>
            </div>
          </div>

          <aside aria-label="Summary" className="flex flex-col gap-6">
            <TitleBlock />
            <nav aria-label="Drawing index" className="border border-line-strong bg-paper">
              <p className="label border-b border-line-strong px-3 py-2 text-ink">Drawing index</p>
              <ol className="divide-y divide-line">
                {sheets.slice(1).map((s) => (
                  <li key={s.id}>
                    <a
                      href={`#${s.id}`}
                      className="group flex items-baseline gap-3 px-3 py-1.5 text-[0.9375rem] no-underline hover:bg-paper-2"
                    >
                      <span className="font-mono text-xs text-ink-3">{s.no}</span>
                      <span className="group-hover:underline">{s.title}</span>
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
          </aside>
        </div>
      </div>
    </Sheet>
  );
}

function TitleBlock() {
  const rows: [string, string][] = [
    ["Role", person.role],
    ["Sectors", person.sectors.join(" · ")],
    ["Experience", person.experience],
    ["Currently", person.current],
    ["Based", `${person.location}. ${person.availability}`],
  ];
  return (
    <div className="border border-line-strong bg-paper">
      <p className="label border-b border-line-strong px-3 py-2 text-ink">Title block</p>
      <dl className="divide-y divide-line">
        {rows.map(([k, v]) => (
          <div key={k} className="grid grid-cols-[92px_1fr] gap-3 px-3 py-2">
            <dt className="label pt-0.5">{k}</dt>
            <dd className="text-[0.9375rem] leading-snug">{v}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
