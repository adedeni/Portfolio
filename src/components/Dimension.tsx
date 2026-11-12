import { useEffect, useRef } from "react";
import type { Metric } from "../data/content";

/** "50,000+" -> { prefix: "", target: 50000, decimals: 0, grouped: true, suffix: "+" } */
function parse(value: string) {
  const m = value.match(/^(\D*)([\d,]*\.?\d+)(.*)$/);
  if (!m) return null;
  const digits = m[2].replace(/,/g, "");
  return { prefix: m[1], target: Number(digits), decimals: digits.split(".")[1]?.length ?? 0, grouped: m[2].includes(","), suffix: m[3] };
}

/**
 * Counts the figure up as its dimension line draws. Only for metrics that start
 * below the fold: ones already on screen keep their pre-rendered value, so
 * nothing flashes back to zero on load. Screen readers always get the final value.
 */
function useCountUp(value: string, delay: number) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = ref.current;
    const p = parse(value);
    if (!el || !p || p.target < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) return;
    if (el.getBoundingClientRect().top < window.innerHeight) return;
    const format = (n: number) =>
      p.prefix + n.toLocaleString("en-US", { minimumFractionDigits: p.decimals, maximumFractionDigits: p.decimals, useGrouping: p.grouped }) + p.suffix;
    // Hold the final width so the line and label don't shift while digits change.
    el.style.minWidth = `${el.offsetWidth}px`;
    el.textContent = format(0);
    let frame = 0;
    let timer = 0;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        timer = window.setTimeout(() => {
          const start = performance.now();
          const tick = (now: number) => {
            const t = Math.min(1, (now - start) / 1100);
            el.textContent = format(p.target * (1 - Math.pow(1 - t, 4)));
            if (t < 1) frame = requestAnimationFrame(tick);
            else el.textContent = value;
          };
          frame = requestAnimationFrame(tick);
        }, delay);
      },
      { threshold: 0.6 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      window.clearTimeout(timer);
      cancelAnimationFrame(frame);
      el.textContent = value;
    };
  }, [value, delay]);
  return ref;
}

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
  const ref = useCountUp(metric.value, delay);
  return (
    <div data-reveal="" style={{ ["--dim-delay" as string]: `${delay}ms`, ["--i" as string]: Math.round(delay / 150) }}>
      <div className="dim">
        <span className="dim-line" aria-hidden="true" />
        <span
          className={`dim-value display tabular-nums ${
            size === "lg" ? "text-[1.5rem] sm:text-[2.5rem]" : "text-[1.5rem] sm:text-[1.875rem]"
          }`}
        >
          <span className="sr-only">{metric.value}</span>
          <span ref={ref} aria-hidden="true" className="inline-block text-center">
            {metric.value}
          </span>
        </span>
      </div>
      <p className="mt-1.5 text-center text-[0.9375rem] leading-snug text-ink-2">{metric.label}</p>
    </div>
  );
}
