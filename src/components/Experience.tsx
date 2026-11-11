import { experience } from "../data/content";
import { ExtLink } from "./ExtLink";
import { Sheet } from "./Sheet";
import { Star } from "lucide-react";
import { Icon } from "./Icon";

const cols = "md:grid-cols-[3rem_10rem_minmax(0,1fr)_minmax(0,1.6fr)]";

export function Experience() {
  const revs = experience.map((_, i) => String.fromCharCode(65 + experience.length - 1 - i));
  return (
    <Sheet id="experience" kicker="Revision table" labelledBy="experience-title">
      <div className="px-4 pb-10 pt-8 sm:px-6 lg:px-10 lg:pb-12 lg:pt-10">
        <h2 id="experience-title" className="display text-[clamp(2rem,1.5rem+2.4vw,3.25rem)]">
          Experience
        </h2>
        <div className="mt-8 border-t border-ink">
          <div aria-hidden="true" className={`label hidden gap-6 border-b border-line-strong py-2 md:grid ${cols}`}>
            <span>Rev</span>
            <span>Date</span>
            <span>Organisation · role</span>
            <span>Description</span>
          </div>
          <ol>
            {experience.map((job, i) => (
              <li key={job.company} className={`grid gap-x-6 gap-y-2 border-b border-line-strong py-6 ${cols}`}>
                <span
                  aria-hidden="true"
                  className="flex h-8 w-8 items-center justify-center border border-ink font-mono text-sm font-medium"
                >
                  {revs[i]}
                </span>
                <p className="font-mono text-[0.875rem] text-ink-2 md:pt-1">
                  {job.start} – {job.end}
                </p>
                <div>
                  <h3 className="text-[1.25rem] font-semibold leading-tight [font-stretch:112%]">{job.company}</h3>
                  {job.companyNote ? <p className="text-[0.875rem] text-ink-3">{job.companyNote}</p> : null}
                  <p className="mt-1 font-mono text-[0.875rem] text-ink">{job.role}</p>
                </div>
                <div className="text-ink-2">
                  <ul className="space-y-1.5">
                    {job.points.map((pt) => (
                      <li key={pt} className="grid grid-cols-[1rem_1fr]">
                        <span aria-hidden="true" className="text-ink-3">–</span>
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                  {job.highlights?.length ? (
                    <div className="mt-4 border-l-2 border-accent bg-paper-2 px-4 py-3">
                      <p className="label flex items-center gap-2 text-ink">
                        <Icon icon={Star} size={14} className="text-accent" />
                        {job.highlights.length === 1 ? "Highlight" : "Highlights"}
                      </p>
                      <ul className="mt-1 divide-y divide-line">
                        {job.highlights.map((h) => (
                          <li key={h.name} className="py-2.5 first:pt-1 last:pb-0">
                            <p>
                              <ExtLink link={{ label: h.name, href: h.href }} className="font-semibold text-ink" />
                            </p>
                            <p className="mt-0.5">{h.text}</p>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </Sheet>
  );
}
