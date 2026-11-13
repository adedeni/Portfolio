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
  return { entered: entries.length, valid: [...valid], invalid, duplicates };
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
            <label htmlFor="sc-recipients" className="label mb-1.5 block text-ink">
              Recipients
            </label>
            <textarea id="sc-recipients" rows={3} spellCheck={false} value={recipients} onChange={(e) => setRecipients(e.target.value)} className={field} />
          </div>
          <div>
            <label htmlFor="sc-message" className="label mb-1.5 block text-ink">
              Message
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
            <Line k="Recipients">
              <strong className="font-semibold text-ink">{r.valid.length}</strong> to send, from {r.entered} entered
              {r.duplicates ? ` · ${r.duplicates} duplicate${r.duplicates > 1 ? "s" : ""} removed` : ""}
              {r.invalid.length ? (
                <span className="mt-1 block text-accent">
                  {r.invalid.length} invalid: <span className="font-mono text-[0.8125rem]">{r.invalid.slice(0, 3).join(", ")}</span>
                  {r.invalid.length > 3 ? " …" : ""}
                </span>
              ) : null}
            </Line>
            <Line k="Message">
              <strong className="font-semibold text-ink">{m.pages}</strong> page{m.pages === 1 ? "" : "s"} · {m.length} character{m.length === 1 ? "" : "s"} ·{" "}
              {m.gsm ? "GSM" : <span className="text-accent">Unicode</span>}
              {m.gsm ? null : (
                <span className="mt-1 block">
                  {m.offenders.slice(0, 6).map((ch) => (
                    <code key={ch} className="mr-1 border border-accent px-1.5 font-mono text-[0.8125rem] text-accent">
                      {ch}
                    </code>
                  ))}
                  shrinks a page from 160 to 70 characters
                </span>
              )}
              <Pages length={m.length} pages={m.pages} perPage={m.perPage} />
            </Line>
            <Line k="Billed">
              <span className="display text-[1.5rem] text-ink tabular-nums">{units.toLocaleString("en-US")}</span> unit{units === 1 ? "" : "s"}
              <span className="ml-2 font-mono text-[0.8125rem] text-ink-3">
                = {m.pages} × {r.valid.length}
              </span>
            </Line>
          </dl>
        </div>
      </div>

      <p className="border-t border-line px-4 py-5 text-sm text-ink-3 sm:px-6 lg:px-10">
        Numbers are normalised and de-duplicated so nobody is billed twice, and characters that would force Unicode are caught
        before pricing. Page lengths follow the GSM standard; sample numbers only, nothing is sent.
      </p>
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

function Line({ k, children }: { k: string; children: ReactNode }) {
  return (
    <div className="grid grid-cols-[92px_1fr] gap-3 px-3 py-3">
      <dt className="label pt-0.5">{k}</dt>
      <dd className="text-[0.9375rem] leading-snug text-ink-2">{children}</dd>
    </div>
  );
}
