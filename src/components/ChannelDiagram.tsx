import { ChartColumn, Mail, MessageSquareText, Phone, Send, Wallet, type LucideIcon } from "lucide-react";
import { Icon } from "./Icon";

/**
 * PMCSMS schematic: wallet → campaign controls → three channels → analytics.
 * Built from HTML boxes so it reflows from a vertical stack (mobile)
 * to a left-to-right flow (desktop column stays vertical; it reads top-down).
 */
function Box({ title, items, strong, icon }: { title: string; items?: string[]; strong?: boolean; icon: LucideIcon }) {
  return (
    <div className={`border bg-paper px-3 py-2 ${strong ? "border-ink" : "border-line-strong"}`}>
      <p className="label flex items-center gap-2 text-ink">
        <Icon icon={icon} size={15} className="text-accent" />
        {title}
      </p>
      {items ? <p className="mt-0.5 text-[0.9375rem] leading-snug text-ink-2">{items.join(" · ")}</p> : null}
    </div>
  );
}

function Arrow() {
  return (
    <div aria-hidden="true" className="flex justify-center py-1">
      <svg width="12" height="22" viewBox="0 0 12 22">
        <path d="M6 0v19" stroke="var(--ink-3)" strokeWidth="1" />
        <path d="M1.5 15.5 6 21l4.5-5.5Z" fill="var(--ink-3)" />
      </svg>
    </div>
  );
}

export function ChannelDiagram() {
  return (
    <figure className="sheet-grid border border-line-strong p-4">
      <div role="img" aria-label="Flow: a wallet topped up by bank transfer, card or USSD funds campaigns. Each campaign uses a sender ID, DND filtering and scheduling, then goes out by SMS, email or voice. Delivery is reported on a real-time analytics dashboard.">
        <Box icon={Wallet} title="Wallet top-up" items={["Bank transfer", "Card", "USSD"]} />
        <Arrow />
        <Box icon={Send} title="Campaign" items={["Sender ID", "DND filter", "Schedule"]} strong />
        <Arrow />
        <div className="grid grid-cols-3 gap-2">
          {([["SMS", MessageSquareText], ["Email", Mail], ["Voice", Phone]] as const).map(([c, glyph]) => (
            <div key={c} className="flex flex-col items-center gap-1 border border-line-strong bg-paper px-2 py-2 text-center font-mono text-sm">
              <Icon icon={glyph} size={18} className="text-accent" />
              {c}
            </div>
          ))}
        </div>
        <Arrow />
        <Box icon={ChartColumn} title="Real-time analytics" items={["98.6% delivered"]} />
      </div>
      <figcaption className="label mt-3">Fig. 3.1: Message flow (schematic)</figcaption>
    </figure>
  );
}
