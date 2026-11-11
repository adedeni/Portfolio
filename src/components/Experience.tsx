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
              <li key={job.company} className={`grid grid-cols-[minmax(0,1fr)] gap-x-6 gap-y-2 border-b border-line-strong py-6 ${cols}`}>
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
                </div>
                {job.highlights?.length ? (
                  // Full-width band under the row, so long highlights don't leave the left columns empty.
                  <div className="mt-4 border-l-2 border-accent bg-paper-2 px-4 py-4 text-ink-2 md:col-[2/-1] md:px-5">
                    <p className="label flex items-center gap-2 text-ink">
                      <Icon icon={Star} size={14} className="text-accent" />
                      {job.highlights.length === 1 ? "Highlight" : "Highlights"}
                    </p>
                    <ul className="mt-3 grid divide-y divide-line lg:grid-cols-3 lg:divide-x lg:divide-y-0">
                      {job.highlights.map((h) => (
                        <li key={h.name} className="py-4 first:pt-0 last:pb-0 lg:px-8 lg:py-0 lg:first:pl-0 lg:last:pr-0">
                          <p>
                            <ExtLink link={{ label: h.name, href: h.href }} className="font-semibold text-ink" />
                          </p>
                          <p className="mt-1 text-[0.9375rem]">{h.text}</p>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </Sheet>
  );
}
