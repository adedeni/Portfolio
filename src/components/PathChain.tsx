import { useEffect, useState } from "react";
import { path } from "../data/content";

declare const __BUILD_MONTH__: string;

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const ym = (s: string) => {
  const [y, m] = s.split("-").map(Number);
  return y * 12 + (m - 1);
};
const label = (s: string) => {
  const [y, m] = s.split("-").map(Number);
  return `${MONTHS[m - 1]} ${y}`;
};
const span = (months: number) => {
  const y = Math.floor(months / 12);
  const m = months % 12;
  return { short: [y ? `${y}y` : "", m ? `${m}m` : ""].filter(Boolean).join(" ") || "0m", long: [y ? `${y} year${y > 1 ? "s" : ""}` : "", m ? `${m} month${m > 1 ? "s" : ""}` : ""].filter(Boolean).join(" ") };
};

/**
 * Career path as an engineering "dimension chain", drawn to scale from the
 * first milestone to the build date. Horizontal on wide screens, a rail below.
 */
export function PathChain() {
  // Server render uses the build month; the browser corrects it to the current month.
  const [today, setToday] = useState(__BUILD_MONTH__);
  useEffect(() => setToday(new Date().toISOString().slice(0, 7)), []);
  const start = ym(path[0].date);
  const end = Math.max(ym(today), ym(path[path.length - 1].date));
  const total = Math.max(1, end - start);
  const items = path.map((p, i) => {
    const here = ym(p.date);
    const next = i < path.length - 1 ? ym(path[i + 1].date) : end;
    return { ...p, x: ((here - start) / total) * 100, w: ((next - here) / total) * 100, gap: span(next - here), last: i === path.length - 1 };
  });

  return (
    <figure data-observe="" className="chain border-t border-line pt-6">
      <figcaption className="label">
        Fig. 7.1: Path, {label(path[0].date)} to today · dimension chain, to scale
      </figcaption>

      <div className="relative mt-6 lg:mx-4 lg:h-[220px]">
        {/* Chain area; the right strip is kept for the Today marker */}
        <div className="relative lg:absolute lg:inset-y-0 lg:left-0 lg:right-36">
        {/* The measured line, with an arrow to today (wide screens) */}
        <div aria-hidden="true" className="chain-line absolute left-0 right-0 top-1/2 hidden h-px bg-ink-3 lg:block">
          <span className="absolute -right-1 -top-[4.5px] h-2.5 w-2.5 bg-ink-3 [clip-path:polygon(0_0,100%_50%,0_100%)]" />
        </div>

        <ol className="lg:absolute lg:inset-0">
          {items.map((p, i) => {
            const above = i % 2 === 0;
            return (
              <li
                key={p.date}
                data-reveal=""
                style={{ ["--x" as string]: `${p.x}%`, ["--w" as string]: `${p.w}%`, ["--i" as string]: i + 2 }}
                className="relative border-l border-line-strong pb-7 pl-6 lg:absolute lg:bottom-0 lg:left-[var(--x)] lg:top-0 lg:w-[var(--w)] lg:border-0 lg:p-0"
              >
                {/* Tick on the line (wide) / dot on the rail (narrow) */}
                <span aria-hidden="true" className="absolute -left-[5px] top-1.5 h-2.5 w-2.5 rounded-full bg-accent lg:-left-px lg:top-[calc(50%-14px)] lg:h-7 lg:w-0.5 lg:rounded-none lg:bg-ink" />

                <div
                  className={`lg:absolute lg:w-44 ${i === 0 ? "lg:left-0" : "lg:left-0 lg:-translate-x-1/2 lg:text-center"} ${
                    above ? "lg:bottom-[calc(50%+22px)]" : "lg:top-[calc(50%+22px)]"
                  }`}
                >
                  <p className="font-mono text-[0.8125rem] text-accent">{label(p.date)}</p>
                  <p className="mt-0.5 text-[0.9375rem] font-semibold leading-snug text-ink [font-stretch:108%]">{p.title}</p>
                  <p className="text-[0.875rem] text-ink-2">{p.org}</p>
                </div>

                {/* Segment length to the next milestone (or to today) */}
                <p className="mt-2 font-mono text-[0.75rem] text-ink-3 lg:absolute lg:left-1/2 lg:top-1/2 lg:mt-0 lg:-translate-x-1/2 lg:-translate-y-1/2 lg:bg-paper lg:px-1.5">
                  <span aria-hidden="true">
                    <span className="lg:hidden">↓ </span>
                    {p.gap.short}
                    {p.last ? <span className="lg:hidden"> · ongoing</span> : null}
                  </span>
                  <span className="sr-only">
                    {p.last ? `${p.gap.long} so far` : `${p.gap.long} until the next milestone`}
                  </span>
                </p>
              </li>
            );
          })}
        </ol>
        </div>

        {/* Today marker, at the arrow tip */}
        <p className="pl-6 font-mono text-[0.8125rem] text-ink-2 lg:absolute lg:right-0 lg:top-1/2 lg:w-32 lg:-translate-y-1/2 lg:p-0">
          Today · {label(today)}
        </p>
      </div>
    </figure>
  );
}
