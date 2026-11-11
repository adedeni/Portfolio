import { shippedProjects } from "../data/content";
import { ExtLink } from "./ExtLink";
import { PhoneShowcase } from "./PhoneShowcase";
import { Sheet } from "./Sheet";
import { Smartphone } from "lucide-react";
import { Icon } from "./Icon";

const cols = "md:grid-cols-[3rem_minmax(0,1.05fr)_minmax(0,1.6fr)_minmax(0,1fr)_minmax(0,1fr)]";

export function WorkSchedule() {
  return (
    <Sheet id="work" kicker="Schedule of works" labelledBy="work-title">
      <div className="px-4 pb-10 pt-8 sm:px-6 lg:px-10 lg:pb-12 lg:pt-10">
        <h2 id="work-title" className="display text-[clamp(2rem,1.5rem+2.4vw,3.25rem)]">
          More shipped work
        </h2>
        <p className="mt-3 max-w-[60ch] text-ink-2">Flutter apps and backends in production on the app stores.</p>

        <div className="mt-8 border-t border-ink">
          <div aria-hidden="true" className={`label hidden gap-6 border-b border-line-strong py-2 md:grid ${cols}`}>
            <span>No.</span>
            <span>Project</span>
            <span>What I built</span>
            <span>Stack</span>
            <span>Platform · links</span>
          </div>
          <ol>
            {shippedProjects.map((p, i) => (
              <li key={p.name} className={`grid grid-cols-[minmax(0,1fr)] gap-x-6 gap-y-3 border-b border-line-strong py-5 ${cols}`}>
                <span className="font-mono text-sm text-ink-3">W-{String(i + 1).padStart(2, "0")}</span>
                <div>
                  <h3 className="text-[1.25rem] font-semibold leading-tight [font-stretch:112%]">{p.name}</h3>
                  <p className="mt-1 text-[0.9375rem] text-ink-2">{p.summary}</p>
                </div>
                <div>
                  <p className="label mb-1 md:sr-only">What I built</p>
                  <ul className="space-y-1 text-[0.9375rem] text-ink-2">
                    {p.contribution.map((c) => (
                      <li key={c} className="grid grid-cols-[1rem_1fr]">
                        <span aria-hidden="true" className="text-ink-3">–</span>
                        <span>{c}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="label mb-1 md:sr-only">Stack</p>
                  <p className="font-mono text-[0.8125rem] leading-relaxed text-ink-2">{p.stack.join(" · ")}</p>
                </div>
                {p.screenshots ? (
                  <div className="order-last mt-2 min-w-0 md:col-[2/-1]">
                    <PhoneShowcase
                      shots={p.screenshots.shots}
                      caption={p.screenshots.caption}
                      fig={`4.${shippedProjects.filter((x) => x.screenshots).indexOf(p) + 1}`}
                    />
                  </div>
                ) : null}
                <div>
                  <p className="label mb-1 md:sr-only">Platform · links</p>
                  <p className="flex items-center gap-1.5 font-mono text-[0.8125rem] text-ink">
                    <Icon icon={Smartphone} size={15} />
                    {p.platforms}
                  </p>
                  <ul className="mt-1.5 flex flex-col items-start gap-1.5 text-[0.9375rem]">
                    {p.links.map((l) => (
                      <li key={l.label}>
                        <ExtLink link={l}>
                          {l.label}
                          <span className="sr-only">: {p.name}</span>
                        </ExtLink>
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </Sheet>
  );
}
