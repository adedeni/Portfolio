import type { ReactNode } from "react";
import { ArrowUpRight, Globe } from "lucide-react";
import type { CaseStudy as Study } from "../data/content";
import { Dimension } from "./Dimension";
import { ExtLink } from "./ExtLink";
import { Figure } from "./Figure";
import { Icon } from "./Icon";
import { Sheet } from "./Sheet";
import { reveal } from "../reveal";

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div {...reveal()} className="grid gap-1 border-t border-line py-4 sm:grid-cols-[120px_1fr] sm:gap-6">
      <dt className="label pt-1">{label}</dt>
      <dd className="text-ink-2">{children}</dd>
    </div>
  );
}

export function CaseStudy({
  study,
  fig,
  side,
  detail,
}: {
  study: Study;
  fig: string;
  side?: ReactNode;
  detail?: ReactNode;
}) {
  const titleId = `${study.id}-title`;
  return (
    <Sheet
      id={study.id as "vtunownow" | "pmcsms"}
      kicker="Case study"
      labelledBy={titleId}
      aside={<ExtLink link={study.url} className="normal-case tracking-normal text-ink" />}
    >
      <div className="px-4 pb-10 pt-8 sm:px-6 lg:px-10 lg:pb-12 lg:pt-10">
        <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-5">
          <div>
            <p className="label">{study.kind}</p>
            <h2 id={titleId} className="display mt-2 text-[clamp(2.4rem,1.6rem+3.6vw,4.6rem)]">
              {study.name}
            </h2>
          </div>
          {study.url.href ? (
            <a href={study.url.href} target="_blank" rel="noopener noreferrer" className="btn btn-ghost sm:mb-2">
              <Icon icon={Globe} />
              Visit {study.url.label}
              <Icon icon={ArrowUpRight} size={14} />
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          ) : null}
        </div>

        <div
          className="mt-8 grid gap-x-8 gap-y-6 sm:grid-cols-[repeat(var(--n),minmax(0,1fr))]"
          style={{ ["--n" as string]: study.metrics.length }}
        >
          {study.metrics.map((m, i) => (
            <Dimension key={m.label} metric={m} size="md" delay={100 + i * 200} />
          ))}
        </div>

        <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-12">
          <dl className="border-b border-line">
            <Row label="Problem">{study.problem}</Row>
            <Row label="My role">{study.role}</Row>
            <Row label="What I built">
              <ol className="space-y-2">
                {study.built.map((b, i) => (
                  <li key={b} className="grid grid-cols-[1.75rem_1fr]">
                    <span className="font-mono text-sm text-ink-3">{String(i + 1).padStart(2, "0")}</span>
                    <span>{b}</span>
                  </li>
                ))}
              </ol>
            </Row>
            <Row label="Outcome">
              <span className="text-ink">{study.outcome}</span>
            </Row>
            <Row label="Stack">
              <ul className="flex flex-wrap gap-2">
                {study.stack.map((s) => (
                  <li key={s} className="tag">
                    {s}
                  </li>
                ))}
              </ul>
            </Row>
          </dl>

          <div className="flex flex-col gap-8">
            {side}
            <Figure shot={study.screenshot} fig={fig} />
          </div>
        </div>
      </div>
      {detail}
    </Sheet>
  );
}
