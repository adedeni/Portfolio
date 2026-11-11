/**
 * PMCSMS schematic: wallet → campaign controls → three channels → analytics.
 * Built from HTML boxes so it reflows from a vertical stack (mobile)
 * to a left-to-right flow (desktop column stays vertical; it reads top-down).
 */
function Box({ title, items, strong }: { title: string; items?: string[]; strong?: boolean }) {
  return (
    <div className={`border bg-paper px-3 py-2 ${strong ? "border-ink" : "border-line-strong"}`}>
      <p className="label text-ink">{title}</p>
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
        <Box title="Wallet top-up" items={["Bank transfer", "Card", "USSD"]} />
        <Arrow />
        <Box title="Campaign" items={["Sender ID", "DND filter", "Schedule"]} strong />
        <Arrow />
        <div className="grid grid-cols-3 gap-2">
          {["SMS", "Email", "Voice"].map((c) => (
            <div key={c} className="border border-line-strong bg-paper px-2 py-2 text-center font-mono text-sm">
              {c}
            </div>
          ))}
        </div>
        <Arrow />
        <Box title="Real-time analytics" items={["98.6% delivered"]} />
      </div>
      <figcaption className="label mt-3">Fig. 3.1: Message flow (schematic)</figcaption>
    </figure>
  );
}
