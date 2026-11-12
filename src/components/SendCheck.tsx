import { useMemo, useState, type ReactNode } from "react";
import { Check, Eraser, RotateCcw, TriangleAlert } from "lucide-react";
import { Icon } from "./Icon";

/**
 * Detail C: a working model of the checks PMCSMS runs before a message is queued.
 *
 *  1. Recipients are normalised to international format and de-duplicated.
 *  2. The message is checked against the GSM 7-bit alphabet. One character outside
 *     it switches the whole message to UCS-2, and a page drops from 160 to 70 characters.
 *  3. Pages are counted, and the send is billed as pages x recipients.
 *
 * Page lengths here are the GSM standard; in production they are configured per gateway.
 * Nothing is sent from this page.
 */

const GSM_BASIC =
  "@£$¥èéùìòÇ\nØø\rÅåΔ_ΦΓΛΩΠΨΣΘΞ ÆæßÉ!\"#¤%&'()*+,-./0123456789:;<=>?¡ABCDEFGHIJKLMNOPQRSTUVWXYZÄÖÑÜ§¿abcdefghijklmnopqrstuvwxyzäöñüà";
/** These are in the alphabet but cost two characters each. */
const GSM_EXTENDED = "^{}\\[~]|€";

/** Typographic characters that word processors and phones insert, with their plain equivalents. */
const PLAIN: Record<string, string> = { "‘": "'", "’": "'", "“": '"', "”": '"', "–": "-", "—": "-", "…": "...", " ": " " };

const NETWORKS: Record<string, string[]> = {
  MTN: ["0803", "0806", "0703", "0706", "0810", "0813", "0814", "0816", "0903", "0906", "0913", "0916"],
  Airtel: ["0802", "0808", "0701", "0708", "0812", "0901", "0902", "0907", "0912"],
  Glo: ["0805", "0807", "0705", "0811", "0815", "0905", "0915"],
  "9mobile": ["0809", "0817", "0818", "0908", "0909"],
};

const SAMPLE_RECIPIENTS = "08030000001, 0803 000 0001, +2348020000002\n2347050000003, 08090000004, 0812345";
const SAMPLE_MESSAGE = "Hi Ada, your order has shipped — track it at example.com/t/2048. Thanks for shopping with us 🎉";

function checkRecipients(raw: string) {
  const entries = raw.split(/[\n,;]+/).map((s) => s.trim()).filter(Boolean);
  const valid = new Set<string>();
  const invalid: string[] = [];
  let duplicates = 0;
  for (const entry of entries) {
    const digits = entry.replace(/\D/g, "");
    let local: string | null = null;
    if (/^0[789][01]\d{8}$/.test(digits)) local = digits;
    else if (/^234[789][01]\d{8}$/.test(digits)) local = "0" + digits.slice(3);
    else if (/^[789][01]\d{8}$/.test(digits)) local = "0" + digits;
    if (!local) invalid.push(entry);
    else if (valid.has(local)) duplicates++;
    else valid.add(local);
  }
  const networks: Record<string, number> = {};
  for (const n of valid) {
    const name = Object.keys(NETWORKS).find((k) => NETWORKS[k].includes(n.slice(0, 4))) ?? "Other";
    networks[name] = (networks[name] ?? 0) + 1;
  }
  return { entered: entries.length, valid: [...valid], invalid, duplicates, networks };
}

function checkMessage(message: string) {
  const offenders: string[] = [];
  let gsmLength = 0;
  for (const ch of Array.from(message)) {
    if (GSM_BASIC.includes(ch)) gsmLength += 1;
    else if (GSM_EXTENDED.includes(ch)) gsmLength += 2;
    else if (!offenders.includes(ch)) offenders.push(ch);
  }
  const gsm = offenders.length === 0;
  const length = gsm ? gsmLength : message.length;
  const [single, multi] = gsm ? [160, 153] : [70, 67];
  const pages = length === 0 ? 0 : length <= single ? 1 : Math.ceil(length / multi);
  const perPage = pages > 1 ? multi : single;
  return { gsm, offenders, length, pages, perPage };
}

/** Swap typographic characters for plain ones, then drop anything still outside the alphabet. */
function toGsm(message: string) {
  return Array.from(message)
    .map((ch) => PLAIN[ch] ?? ch)
    .join("")
    .split("")
    .filter((ch) => GSM_BASIC.includes(ch) || GSM_EXTENDED.includes(ch))
    .join("")
    .replace(/ {2,}/g, " ")
    .trim();
}

export function SendCheck() {
  const [recipients, setRecipients] = useState(SAMPLE_RECIPIENTS);
  const [message, setMessage] = useState(SAMPLE_MESSAGE);
  const r = useMemo(() => checkRecipients(recipients), [recipients]);
  const m = useMemo(() => checkMessage(message), [message]);
  const units = m.pages * r.valid.length;
  const ready = r.valid.length > 0 && m.pages > 0 && m.gsm;
  const changed = recipients !== SAMPLE_RECIPIENTS || message !== SAMPLE_MESSAGE;
  const field = "w-full resize-y border border-line-strong bg-paper-2 p-3 font-mono text-[0.8125rem] leading-relaxed text-ink outline-none focus:border-accent";

  return (
    <div className="no-print border-t border-line-strong">
      <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-1 border-b border-line px-4 py-2 sm:px-6 lg:px-10">
        <h3 className="label text-ink">Detail C: Pre-send check (working model)</h3>
        <p className="label">Try it: edit the numbers or the message</p>
      </div>

      <div className="grid gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-12 lg:px-10 lg:py-10">
        <div className="flex flex-col gap-5">
          <div>
            <label htmlFor="sc-recipients" className="label mb-1.5 flex items-center gap-2 text-ink">
              <Balloon n={1} /> Recipients
            </label>
            <textarea id="sc-recipients" rows={3} spellCheck={false} value={recipients} onChange={(e) => setRecipients(e.target.value)} className={field} />
            <p className="mt-1 text-[0.8125rem] text-ink-3">Any Nigerian format, separated by commas or new lines.</p>
          </div>
          <div>
            <label htmlFor="sc-message" className="label mb-1.5 flex items-center gap-2 text-ink">
              <Balloon n={2} /> Message
            </label>
            <textarea id="sc-message" rows={4} value={message} onChange={(e) => setMessage(e.target.value)} className={field} />
            <div className="mt-2 flex flex-wrap gap-2">
              <button type="button" disabled={m.gsm} onClick={() => setMessage(toGsm(message))} className="btn btn-ghost min-h-9 px-2.5 py-1 text-xs disabled:opacity-40">
                <Icon icon={Eraser} size={14} />
                Convert to GSM characters
              </button>
              <button
                type="button"
                disabled={!changed}
                onClick={() => {
                  setRecipients(SAMPLE_RECIPIENTS);
                  setMessage(SAMPLE_MESSAGE);
                }}
                className="btn btn-ghost min-h-9 px-2.5 py-1 text-xs disabled:opacity-40"
              >
                <Icon icon={RotateCcw} size={14} />
                Reset
              </button>
            </div>
          </div>
        </div>

        <div aria-live="polite" className="self-start border border-line-strong bg-paper">
          <p className="label flex items-center justify-between gap-3 border-b border-line-strong px-3 py-2 text-ink">
            Check sheet
            <span className={`inline-flex items-center gap-1.5 ${ready ? "text-ink" : "text-accent"}`}>
              <Icon icon={ready ? Check : TriangleAlert} size={14} />
              {ready ? "Ready to queue" : "Needs attention"}
            </span>
          </p>
          <dl className="divide-y divide-line">
            <Line k="Recipients" n={1}>
              <strong className="font-semibold text-ink">{r.valid.length}</strong> to send, from {r.entered} entered
              {r.duplicates ? ` · ${r.duplicates} duplicate${r.duplicates > 1 ? "s" : ""} removed` : ""}
              {r.invalid.length ? (
                <span className="mt-1 block text-accent">
                  {r.invalid.length} not a valid number: <span className="font-mono text-[0.8125rem]">{r.invalid.slice(0, 3).join(", ")}</span>
                  {r.invalid.length > 3 ? " …" : ""}
                </span>
              ) : null}
              {r.valid.length ? (
                <span className="mt-2 flex flex-wrap gap-1.5">
                  {Object.entries(r.networks).map(([name, count]) => (
                    <span key={name} className="tag text-[0.75rem]">
                      {name} ×{count}
                    </span>
                  ))}
                </span>
              ) : null}
            </Line>
            <Line k="Encoding" n={2}>
              {m.gsm ? (
                <>
                  <strong className="font-semibold text-ink">GSM 7-bit</strong> · 160 characters on one page, 153 per page after that
                </>
              ) : (
                <>
                  <strong className="font-semibold text-accent">Unicode (UCS-2)</strong> · a page holds 70 characters instead of 160
                  <span className="mt-1 block">
                    Caused by:{" "}
                    {m.offenders.slice(0, 6).map((ch) => (
                      <code key={ch} className="mr-1 border border-accent px-1.5 font-mono text-[0.8125rem] text-accent">
                        {ch}
                      </code>
                    ))}
                  </span>
                </>
              )}
            </Line>
            <Line k="Pages" n={3}>
              <strong className="font-semibold text-ink">{m.pages}</strong> page{m.pages === 1 ? "" : "s"} · {m.length} character{m.length === 1 ? "" : "s"}
              <Pages length={m.length} pages={m.pages} perPage={m.perPage} />
            </Line>
            <Line k="Billed" n={3}>
              <span className="display text-[1.5rem] text-ink tabular-nums">{units.toLocaleString("en-US")}</span> unit{units === 1 ? "" : "s"}
              <span className="ml-2 font-mono text-[0.8125rem] text-ink-3">
                = {m.pages} page{m.pages === 1 ? "" : "s"} × {r.valid.length} recipient{r.valid.length === 1 ? "" : "s"}
              </span>
            </Line>
          </dl>
        </div>
      </div>

      <div className="border-t border-line px-4 pb-10 pt-6 sm:px-6 lg:px-10">
        <ol className="grid gap-x-10 gap-y-4 text-[0.9375rem] text-ink-2 md:grid-cols-2">
          <Note n={1} title="Normalise and de-duplicate.">
            Numbers arrive in every format. Each is converted to one international form, so the same person entered twice is
            messaged, and billed, once.
          </Note>
          <Note n={2} title="Guard the encoding.">
            One emoji or curly quote switches the whole message to Unicode and a page shrinks from 160 characters to 70. The
            check catches it before the customer pays more than double for the same text.
          </Note>
          <Note n={3} title="Price before sending.">
            Pages × recipients gives the units, priced per network and route. The wallet is debited once, and a repeat of the
            same send within five minutes is rejected as a duplicate.
          </Note>
          <Note n={4} title="Refund what never left.">
            If a send fails before it reaches a gateway, the wallet is refunded automatically and the customer is told.
          </Note>
        </ol>
        <p className="mt-6 max-w-[80ch] text-sm text-ink-3">
          A working model of the PMCSMS pre-send checks, rebuilt for this page. Page lengths are the GSM standard; in
          production they are set per gateway. Networks are read from the number prefix. The sample numbers are placeholders,
          and nothing is sent.
        </p>
      </div>
    </div>
  );
}

/** The message drawn as its pages, each filled to how much of it is used. */
function Pages({ length, pages, perPage }: { length: number; pages: number; perPage: number }) {
  if (!pages) return null;
  const shown = Math.min(pages, 6);
  return (
    <span className="mt-2 flex items-center gap-1.5" aria-hidden="true">
      {Array.from({ length: shown }, (_, i) => {
        const used = Math.max(0, Math.min(perPage, length - i * perPage));
        return (
          <span key={i} className="h-3 max-w-16 flex-1 border border-line-strong">
            <span className="block h-full bg-accent transition-[width] duration-300" style={{ width: `${(used / perPage) * 100}%` }} />
          </span>
        );
      })}
      {pages > shown ? <span className="font-mono text-xs text-ink-3">+{pages - shown}</span> : null}
    </span>
  );
}

function Line({ k, n, children }: { k: string; n: number; children: ReactNode }) {
  return (
    <div className="grid grid-cols-[92px_1fr] gap-3 px-3 py-3">
      <dt className="label flex items-start gap-1.5 pt-0.5">
        <span className="sr-only">Callout {n}: </span>
        {k}
      </dt>
      <dd className="text-[0.9375rem] leading-snug text-ink-2">{children}</dd>
    </div>
  );
}

function Balloon({ n }: { n: number }) {
  return (
    <span className="balloon h-5 w-5 text-[0.6875rem]" aria-hidden="true">
      {n}
    </span>
  );
}

function Note({ n, title, children }: { n: number; title: string; children: ReactNode }) {
  return (
    <li className="grid grid-cols-[2.25rem_1fr]">
      <span className="balloon" aria-hidden="true">
        {n}
      </span>
      <p>
        <span className="sr-only">Callout {n}: </span>
        <strong className="font-semibold text-ink">{title}</strong> {children}
      </p>
    </li>
  );
}
