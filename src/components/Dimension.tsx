import type { Metric } from "../data/content";

/** A metric drawn as a dimension line: |<—— 50,000+ ——>| with its label below. */
export function Dimension({
  metric,
  delay = 150,
  size = "lg",
}: {
  metric: Metric;
  delay?: number;
  size?: "lg" | "md";
}) {
  return (
    <div data-reveal="" style={{ ["--dim-delay" as string]: `${delay}ms`, ["--i" as string]: Math.round(delay / 150) }}>
      <div className="dim">
        <span className="dim-line" aria-hidden="true" />
        <span
          className={`dim-value display tabular-nums ${
            size === "lg" ? "text-[1.5rem] sm:text-[2.5rem]" : "text-[1.5rem] sm:text-[1.875rem]"
          }`}
        >
          {metric.value}
        </span>
      </div>
      <p className="mt-1.5 text-center text-[0.9375rem] leading-snug text-ink-2">{metric.label}</p>
    </div>
  );
}
