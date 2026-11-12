import { caseStudies, person, shippedProjects } from "../data/content";

/**
 * A strip of plotter tape between the first two sheets: the headline figures
 * from the page, running past like a print log. Decorative, since every item
 * is stated in full elsewhere, so it is hidden from assistive tech.
 */
export function PlotTape() {
  const items = [
    ...caseStudies.flatMap((c) => c.metrics.map((m) => `${c.name} · ${m.value} ${m.label}`)),
    `${shippedProjects.length} more products in production`,
    `${person.experience} in production`,
    person.availability,
  ];
  const run = (hidden: boolean) => (
    <div className="tape-run" aria-hidden={hidden || undefined}>
      {items.map((t) => (
        <span key={t} className="tape-item">
          {t}
          <i />
        </span>
      ))}
    </div>
  );
  return (
    <div aria-hidden="true" className="tape no-print mx-auto flex w-full max-w-[1200px] items-stretch border border-line-strong bg-paper">
      <span className="label flex shrink-0 items-center gap-2 border-r border-line-strong bg-paper-2 px-3 text-ink">
        <span className="tape-led" />
        Plot log
      </span>
      <div className="tape-track flex min-w-0 flex-1 overflow-hidden py-2">
        {run(false)}
        {run(true)}
      </div>
    </div>
  );
}
