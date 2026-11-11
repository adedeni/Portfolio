import type { LucideIcon } from "lucide-react";
import { ChartColumn, Mail, MessageSquareText, Phone, Send, Wallet } from "lucide-react";

/**
 * Detail B: PMCSMS message flow, drawn as a schematic.
 * Wallet funds a campaign → three checks → fan-out to SMS / Email / Voice →
 * delivery reports (DLR) flow back into real-time analytics.
 * Wide screens get a left-to-right drawing; narrow screens a top-to-bottom one.
 */

const DESCRIPTION =
  "Message flow: a wallet topped up by bank transfer, card or USSD funds a campaign. Each campaign passes three checks, sender ID, DND filter and schedule, then fans out to SMS, email and voice. Delivery reports from each channel flow back into the real-time analytics dashboard.";

type BoxProps = {
  x: number;
  y: number;
  w: number;
  h: number;
  title: string;
  lines?: string[];
  icon?: LucideIcon;
  strong?: boolean;
  center?: boolean;
  i?: number;
};

function Box({ x, y, w, h, title, lines = [], icon: Glyph, strong, center, i = 0 }: BoxProps) {
  const cx = x + w / 2;
  return (
    <g className="dg-box" style={{ ["--i" as string]: i }}>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        fill="var(--paper)"
        stroke={strong ? "var(--ink)" : "var(--line-strong)"}
        strokeWidth={strong ? 1.5 : 1}
      />
      {center ? (
        <>
          {Glyph ? (
            <Glyph x={cx - 9} y={y + 10} width={18} height={18} stroke="var(--accent)" strokeWidth={1.5} absoluteStrokeWidth />
          ) : null}
          <text x={cx} y={y + (Glyph ? 44 : h / 2 + 4)} textAnchor="middle" className="dg-sans">
            {title}
          </text>
        </>
      ) : (
        <>
          {Glyph ? (
            <Glyph x={x + 12} y={y + 12} width={15} height={15} stroke="var(--accent)" strokeWidth={1.5} absoluteStrokeWidth />
          ) : null}
          <text x={x + (Glyph ? 34 : 12)} y={y + 24} className="dg-label">
            {title}
          </text>
          {lines.map((l, i) => (
            <text key={l} x={x + 12} y={y + 46 + i * 17} className="dg-sans">
              {l}
            </text>
          ))}
        </>
      )}
    </g>
  );
}

function Markers({ id }: { id: string }) {
  return (
    <defs>
      <marker id={`${id}-arrow`} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse">
        <path d="M0 1 9 5 0 9z" fill="var(--ink-3)" />
      </marker>
      <marker id={`${id}-accent`} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse">
        <path d="M0 1 9 5 0 9z" fill="var(--accent)" />
      </marker>
    </defs>
  );
}

const line = { stroke: "var(--ink-3)", strokeWidth: 1, fill: "none" } as const;
const dlr = { stroke: "var(--accent)", strokeWidth: 1.5, fill: "none", strokeDasharray: "6 5", className: "dg-dlr" } as const;
/** A connector that draws itself in order i. */
const draw = (i: number) => ({ className: "dg-draw", pathLength: 1, style: { ["--i" as string]: i } });

/** Left-to-right drawing for wide screens. */
function Horizontal() {
  const id = "dgh";
  const channels: [string, LucideIcon, number][] = [
    ["SMS", MessageSquareText, 20],
    ["Email", Mail, 122],
    ["Voice", Phone, 224],
  ];
  return (
    <svg viewBox="0 0 1100 340" className="hidden h-auto w-full lg:block" aria-hidden="true">
      <Markers id={id} />
      <Box i={0} x={0} y={108} w={170} h={84} title="WALLET TOP-UP" icon={Wallet} lines={["Bank transfer, card", "or USSD"]} />
      <path d="M170 150H204" {...line} {...draw(1)} markerEnd={`url(#${id}-arrow)`} />
      <Box i={2} x={206} y={108} w={170} h={84} title="CAMPAIGN" icon={Send} strong lines={["Recipients, groups", "and message"]} />
      <path d="M376 150H410" {...line} {...draw(3)} markerEnd={`url(#${id}-arrow)`} />

      {/* Checks, in series */}
      <text x={412} y={112} className="dg-label">CHECKS</text>
      <path d="M412 118H722" stroke="var(--line-strong)" strokeWidth={1} />
      <path d="M412 114V122M722 114V122" stroke="var(--line-strong)" strokeWidth={1} />
      <Box i={4} x={412} y={128} w={96} h={44} title="Sender ID" center />
      <path d="M508 150H519" {...line} {...draw(5)} markerEnd={`url(#${id}-arrow)`} />
      <Box i={6} x={519} y={128} w={96} h={44} title="DND filter" center />
      <path d="M615 150H626" {...line} {...draw(7)} markerEnd={`url(#${id}-arrow)`} />
      <Box i={8} x={626} y={128} w={96} h={44} title="Schedule" center />

      {/* Fan-out */}
      <path d="M722 150H760M760 48V252" {...line} {...draw(9)} />
      {channels.map(([label, glyph, y]) => (
        <g key={label}>
          <path d={`M760 ${y + 28}H794`} {...line} {...draw(10)} markerEnd={`url(#${id}-arrow)`} />
          <Box i={11} x={796} y={y} w={140} h={56} title={label} icon={glyph} center />
        </g>
      ))}

      {/* Delivery reports back into analytics */}
      <path d="M936 48H990M936 150H990M936 252H990M990 48V306" {...dlr} />
      <path d="M990 306H724" {...dlr} markerEnd={`url(#${id}-accent)`} />
      <text x={858} y={326} textAnchor="middle" className="dg-label dg-dlr-label" style={{ fill: "var(--accent)" }}>
        DELIVERY REPORTS (DLR)
      </text>
      <Box i={12} x={412} y={270} w={310} h={68} title="REAL-TIME ANALYTICS" icon={ChartColumn} lines={["Delivery by campaign and channel"]} strong />
    </svg>
  );
}

/** Top-to-bottom drawing for phones and tablets. */
function Vertical() {
  const id = "dgv";
  const col = (i: number) => i * 117;
  return (
    <svg viewBox="0 0 340 520" className="mx-auto block h-auto w-full max-w-[440px] lg:hidden" aria-hidden="true">
      <Markers id={id} />
      <Box i={0} x={0} y={0} w={340} h={66} title="WALLET TOP-UP" icon={Wallet} lines={["Bank transfer, card or USSD"]} />
      <path d="M170 66V92" {...line} {...draw(1)} markerEnd={`url(#${id}-arrow)`} />
      <Box i={2} x={0} y={94} w={340} h={66} title="CAMPAIGN" icon={Send} strong lines={["Recipients, groups and message"]} />
      <path d="M170 160V196" {...line} {...draw(3)} markerEnd={`url(#${id}-arrow)`} />

      <text x={0} y={190} className="dg-label">CHECKS</text>
      {["Sender ID", "DND filter", "Schedule"].map((t, i) => (
        <Box i={4} key={t} x={col(i)} y={198} w={106} h={44} title={t} center />
      ))}
      <path d="M106 220H117M223 220H234" {...line} {...draw(5)} />

      {/* Fan-out */}
      <path d="M170 242V266M53 266H287M53 266V282M170 266V282M287 266V282" {...line} {...draw(6)} />
      {(
        [
          ["SMS", MessageSquareText],
          ["Email", Mail],
          ["Voice", Phone],
        ] as [string, LucideIcon][]
      ).map(([t, g], i) => (
        <Box i={7} key={t} x={col(i)} y={284} w={106} h={58} title={t} icon={g} center />
      ))}

      {/* Delivery reports */}
      <path d="M53 342V370M170 342V370M287 342V370M53 370H287M170 370V424" {...dlr} markerEnd={`url(#${id}-accent)`} />
      <text x={180} y={394} className="dg-label dg-dlr-label" style={{ fill: "var(--accent)" }}>
        <tspan x={180}>DELIVERY</tspan>
        <tspan x={180} dy={14}>REPORTS (DLR)</tspan>
      </text>
      <Box i={8} x={0} y={426} w={340} h={70} title="REAL-TIME ANALYTICS" icon={ChartColumn} strong lines={["Delivery by campaign and channel"]} />
    </svg>
  );
}

export function ChannelDiagram() {
  return (
    <div className="border-t border-line-strong">
      <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-1 border-b border-line px-4 py-2 sm:px-6 lg:px-10">
        <h3 className="label text-ink">Detail B: Message flow (schematic)</h3>
        <p className="label">Not to scale</p>
      </div>
      <figure className="sheet-grid px-4 py-8 sm:px-6 lg:px-10 lg:py-10">
        <div role="img" aria-label={DESCRIPTION} className="diagram" data-observe="">
          <Horizontal />
          <Vertical />
        </div>
        <figcaption className="label mt-4">
          Fig. 3.1: How a campaign moves through PMCSMS. The dashed line is the delivery-report loop that feeds analytics.
        </figcaption>
      </figure>
    </div>
  );
}
