import { useState } from "react";
import type { PhoneShot } from "../data/content";

/**
 * App screenshots drawn as an annotated "elevation": phones fanned on a
 * drafting grid, with numbered balloons pinned to features and a legend.
 * Hovering or focusing a legend item highlights its balloon, and vice versa.
 * On small screens the phones become a flat swipeable row.
 */
export function PhoneShowcase({ shots, caption, fig }: { shots: PhoneShot[]; caption: string; fig: string }) {
  const [active, setActive] = useState<number | null>(null);
  const callouts = shots.flatMap((s) => s.callouts ?? []).sort((a, b) => a.n - b.n);
  // Fan: outer phones tilt away, the middle one sits forward.
  const pose = (i: number) => {
    if (shots.length < 3) return "";
    if (i === 0) return "lg:-rotate-[7deg] lg:translate-y-8";
    if (i === shots.length - 1) return "lg:rotate-[7deg] lg:translate-y-8";
    return "lg:z-10 lg:-translate-y-2 lg:scale-[1.06]";
  };

  return (
    <figure className="min-w-0">
      <div className="grid grid-cols-[minmax(0,1fr)] gap-6 lg:grid-cols-[minmax(0,1.45fr)_minmax(0,1fr)] lg:items-center lg:gap-10">
        {/* Stage */}
        <div className="sheet-grid relative border border-line-strong px-3 pb-6 pt-8 lg:px-6 lg:pb-14 lg:pt-12">
          <p className="label absolute left-3 top-2 lg:left-4">Elevation · not to scale</p>
          <ul className="flex snap-x gap-4 overflow-x-auto pb-2 lg:justify-center lg:gap-0 lg:overflow-visible lg:pb-0">
            {shots.map((s, i) => (
              <li
                key={s.webp}
                className={`relative w-[150px] shrink-0 snap-center transition-transform duration-300 sm:w-[170px] lg:-mx-3 lg:w-[31%] lg:max-w-[200px] ${pose(i)}`}
              >
                <a
                  href={s.webp}
                  target="_blank"
                  rel="noopener"
                  className="block cursor-zoom-in overflow-hidden rounded-[22px] border-[3px] border-[#1d1d24] bg-[#0b0b0f] shadow-[0_24px_48px_-16px_rgb(0_0_0/0.55)]"
                >
                  <picture>
                    {s.avif ? <source srcSet={s.avif} type="image/avif" /> : null}
                    <img
                      src={s.webp}
                      width={s.width}
                      height={s.height}
                      alt={s.alt}
                      loading="lazy"
                      decoding="async"
                      className="block h-auto w-full"
                    />
                  </picture>
                  <span className="sr-only"> (open full-size image in a new tab)</span>
                </a>
                {(s.callouts ?? []).map((c) => (
                  <span
                    key={c.n}
                    aria-hidden="true"
                    onMouseEnter={() => setActive(c.n)}
                    onMouseLeave={() => setActive(null)}
                    style={{ left: `${c.x}%`, top: `${c.y}%` }}
                    className={`absolute flex h-6 w-6 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 font-mono text-[0.6875rem] font-semibold shadow-md transition-transform duration-150 ${
                      active === c.n
                        ? "scale-125 border-on-accent bg-accent text-on-accent"
                        : "border-[#0b0b0f] bg-accent text-on-accent"
                    }`}
                  >
                    {c.n}
                  </span>
                ))}
              </li>
            ))}
          </ul>
        </div>

        {/* Legend */}
        <ol className="space-y-1">
          {callouts.map((c) => (
            <li
              key={c.n}
              onMouseEnter={() => setActive(c.n)}
              onMouseLeave={() => setActive(null)}
              className={`grid grid-cols-[2rem_1fr] items-baseline rounded px-2 py-1.5 text-[0.9375rem] transition-colors ${
                active === c.n ? "bg-paper-2 text-ink" : "text-ink-2"
              }`}
            >
              <span className={`balloon h-6 w-6 text-[0.6875rem] ${active === c.n ? "bg-accent text-on-accent" : ""}`} aria-hidden="true">
                {c.n}
              </span>
              <span>
                <span className="sr-only">Callout {c.n}: </span>
                {c.label}
              </span>
            </li>
          ))}
        </ol>
      </div>
      <figcaption className="label mt-4">
        Fig. {fig}: {caption}
      </figcaption>
    </figure>
  );
}
