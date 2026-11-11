import { useCallback, useEffect, useId, useRef, useState, type ReactNode } from "react";

/**
 * Detail A: a working model of the VTUNowNow template-editor pattern.
 * The storefront runs in a sandboxed iframe (opaque origin). The editor sends
 * small patches over postMessage; the storefront validates, applies and acks.
 */

type Background = "solid" | "tint" | "pattern";
type Corners = "sharp" | "soft" | "round";
type EditorState = {
  brandColor: string;
  storeName: string;
  headline: string;
  background: Background;
  corners: Corners;
};
type Field = keyof EditorState;
type LogEntry = { key: number; dir: "out" | "in"; text: string };

const INITIAL: EditorState = {
  brandColor: "#0f766e",
  storeName: "Sunrise Data Hub",
  headline: "Cheap data. Instant airtime.",
  background: "solid",
  corners: "soft",
};

const SWATCHES = [
  { name: "Teal", hex: "#0f766e" },
  { name: "Orange", hex: "#c2410c" },
  { name: "Indigo", hex: "#4338ca" },
  { name: "Green", hex: "#15803d" },
  { name: "Magenta", hex: "#be185d" },
  { name: "Gold", hex: "#facc15" },
];

const BACKGROUNDS: { value: Background; label: string }[] = [
  { value: "solid", label: "Solid" },
  { value: "tint", label: "Tint" },
  { value: "pattern", label: "Pattern" },
];
const CORNERS: { value: Corners; label: string }[] = [
  { value: "sharp", label: "Sharp" },
  { value: "soft", label: "Soft" },
  { value: "round", label: "Round" },
];

const FIELDS: Field[] = ["brandColor", "storeName", "headline", "background", "corners"];
const isField = (v: unknown): v is Field => typeof v === "string" && (FIELDS as string[]).includes(v);

function describe(patch: Partial<EditorState>) {
  return Object.entries(patch)
    .map(([k, v]) => `${k}: ${JSON.stringify(v)}`)
    .join(", ");
}

export function StorefrontEditor() {
  const uid = useId();
  const frameRef = useRef<HTMLIFrameElement>(null);
  const [state, setState] = useState<EditorState>(INITIAL);
  const stateRef = useRef(state);
  const [connected, setConnected] = useState(false);
  const [contrast, setContrast] = useState<{ onBrand: string; ratio: number } | null>(null);
  const [log, setLog] = useState<LogEntry[]>([]);
  const seq = useRef(0);
  const logKey = useRef(0);
  const sentAt = useRef(new Map<number, number>());
  const queued = useRef<Partial<EditorState>>({});
  const frame = useRef<number | null>(null);
  const inputs = useRef<Partial<Record<Field, HTMLElement | null>>>({});

  const pushLog = useCallback((dir: LogEntry["dir"], text: string) => {
    setLog((l) => [...l.slice(-6), { key: ++logKey.current, dir, text }]);
  }, []);

  const post = useCallback(
    (patch: Partial<EditorState>) => {
      const win = frameRef.current?.contentWindow;
      if (!win || Object.keys(patch).length === 0) return;
      const id = ++seq.current;
      sentAt.current.set(id, performance.now());
      // Sandboxed frame has an opaque origin, so targetOrigin must be "*".
      // Replies are trusted only if they come from this frame's window.
      win.postMessage({ type: "editor:apply", id, patch }, "*");
      pushLog("out", `#${id} apply { ${describe(patch)} }`);
    },
    [pushLog],
  );

  // Coalesce rapid changes (e.g. dragging the colour picker) into one message per frame.
  const update = useCallback(
    (patch: Partial<EditorState>) => {
      setState((s) => {
        const next = { ...s, ...patch };
        stateRef.current = next;
        return next;
      });
      queued.current = { ...queued.current, ...patch };
      if (frame.current === null) {
        frame.current = requestAnimationFrame(() => {
          frame.current = null;
          const p = queued.current;
          queued.current = {};
          post(p);
        });
      }
    },
    [post],
  );

  useEffect(() => {
    const onMessage = (e: MessageEvent) => {
      if (!frameRef.current || e.source !== frameRef.current.contentWindow) return;
      const d = e.data as { type?: unknown; id?: unknown; applied?: unknown; meta?: unknown; field?: unknown };
      if (!d || typeof d !== "object") return;

      if (d.type === "storefront:ready") {
        setConnected(true);
        pushLog("in", "ready (handshake)");
        // Replay the full state so nothing is lost if the frame loaded late.
        post(stateRef.current);
      } else if (d.type === "storefront:ack" && typeof d.id === "number") {
        const t0 = sentAt.current.get(d.id);
        sentAt.current.delete(d.id);
        const ms = t0 === undefined ? null : performance.now() - t0;
        const applied = Array.isArray(d.applied) ? d.applied.length : 0;
        const meta = d.meta as { onBrand?: unknown; contrast?: unknown } | undefined;
        if (meta && typeof meta.onBrand === "string" && typeof meta.contrast === "number") {
          setContrast({ onBrand: meta.onBrand, ratio: meta.contrast });
        }
        pushLog("in", `#${d.id} ack · ${applied} field${applied === 1 ? "" : "s"}${ms === null ? "" : ` · ${ms.toFixed(1)} ms`}`);
      } else if (d.type === "storefront:select" && isField(d.field)) {
        pushLog("in", `select ${d.field}`);
        const el = inputs.current[d.field];
        el?.focus();
      }
    };
    window.addEventListener("message", onMessage);
    // If the frame loaded before we started listening, ask it to announce itself again.
    frameRef.current?.contentWindow?.postMessage({ type: "editor:hello" }, "*");
    return () => {
      window.removeEventListener("message", onMessage);
      if (frame.current !== null) cancelAnimationFrame(frame.current);
    };
  }, [post, pushLog]);

  const reset = () => update(INITIAL);
  const aa = contrast ? contrast.ratio >= 4.5 : null;

  return (
    <div className="border-t border-line-strong">
      <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-1 border-b border-line px-4 py-2 sm:px-6 lg:px-10">
        <h3 className="label text-ink">Detail A: Live storefront editor (working model)</h3>
        <p className="label">Try it: change the brand</p>
      </div>

      <div className="grid gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[300px_minmax(0,1fr)] lg:gap-10 lg:px-10 lg:py-10">
        {/* Controls */}
        <div className="order-2 lg:order-1">
          <div className="flex items-center gap-2">
            <span className="balloon" aria-hidden="true">1</span>
            <p className="label text-ink">Editor</p>
          </div>

          <fieldset className="mt-4">
            <legend className="label mb-2">Brand colour</legend>
            <div className="flex flex-wrap items-center gap-2">
              {SWATCHES.map((s, i) => (
                <button
                  key={s.hex}
                  type="button"
                  ref={i === 0 ? (el) => void (inputs.current.brandColor = el) : undefined}
                  aria-pressed={state.brandColor === s.hex}
                  aria-label={`${s.name} ${s.hex}`}
                  onClick={() => update({ brandColor: s.hex })}
                  className="h-9 w-9 border border-line-strong p-0.5 aria-pressed:border-ink aria-pressed:ring-2 aria-pressed:ring-ink"
                >
                  <span className="block h-full w-full" style={{ background: s.hex }} />
                </button>
              ))}
              <label className="relative flex h-9 items-center gap-2 border border-line-strong px-2 font-mono text-xs">
                <input
                  type="color"
                  value={state.brandColor}
                  onChange={(e) => update({ brandColor: e.target.value })}
                  className="h-6 w-6 cursor-pointer border-0 bg-transparent p-0"
                />
                Custom
              </label>
            </div>
            <p className="mt-2 font-mono text-xs text-ink-3" aria-live="polite">
              {contrast
                ? `Text on brand: ${contrast.onBrand === "#ffffff" ? "white" : "near-black"} · ${contrast.ratio.toFixed(2)}:1 ${aa ? "(passes AA)" : "(below AA)"}`
                : " "}
            </p>
          </fieldset>

          <div className="mt-5">
            <label htmlFor={`${uid}-name`} className="label mb-1.5 block">
              Store name
            </label>
            <input
              id={`${uid}-name`}
              ref={(el) => void (inputs.current.storeName = el)}
              value={state.storeName}
              maxLength={28}
              onChange={(e) => update({ storeName: e.target.value })}
              className="w-full border border-line-strong bg-paper px-3 py-2 text-[0.9375rem]"
            />
          </div>
          <div className="mt-4">
            <label htmlFor={`${uid}-headline`} className="label mb-1.5 block">
              Headline
            </label>
            <input
              id={`${uid}-headline`}
              ref={(el) => void (inputs.current.headline = el)}
              value={state.headline}
              maxLength={48}
              onChange={(e) => update({ headline: e.target.value })}
              className="w-full border border-line-strong bg-paper px-3 py-2 text-[0.9375rem]"
            />
          </div>

          <Segmented
            legend="Hero background"
            name={`${uid}-bg`}
            options={BACKGROUNDS}
            value={state.background}
            onChange={(v) => update({ background: v })}
            firstRef={(el) => void (inputs.current.background = el)}
          />
          <Segmented
            legend="Corners"
            name={`${uid}-corners`}
            options={CORNERS}
            value={state.corners}
            onChange={(v) => update({ corners: v })}
            firstRef={(el) => void (inputs.current.corners = el)}
          />

          <button type="button" onClick={reset} className="btn btn-ghost mt-5 w-full">
            Reset
          </button>
        </div>

        {/* Preview + log */}
        <div className="order-1 flex min-w-0 flex-col gap-4 lg:order-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="balloon" aria-hidden="true">2</span>
              <p className="label text-ink">Storefront · sandboxed iframe</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="balloon" aria-hidden="true">4</span>
              <p className="label" role="status">
                <span
                  aria-hidden="true"
                  className={`mr-1.5 inline-block h-2 w-2 rounded-full align-[1px] ${connected ? "bg-accent" : "border border-ink-3"}`}
                />
                {connected ? "Connected" : "Waiting for storefront"}
              </p>
            </div>
          </div>
          <div className="border border-ink bg-white">
            <div aria-hidden="true" className="flex items-center gap-1.5 border-b border-ink/20 px-3 py-1.5">
              <span className="h-2 w-2 rounded-full bg-[#d4d4d4]" />
              <span className="h-2 w-2 rounded-full bg-[#d4d4d4]" />
              <span className="h-2 w-2 rounded-full bg-[#d4d4d4]" />
              <span className="ml-2 truncate font-mono text-[0.6875rem] text-[#555]">vendor-storefront (sample)</span>
            </div>
            <iframe
              ref={frameRef}
              src="/storefront/index.html"
              title="Sample vendor storefront, live preview"
              sandbox="allow-scripts"
              loading="lazy"
              className="block h-[480px] w-full sm:h-[540px]"
            />
          </div>

          <div className="border border-line-strong bg-paper-2">
            <div className="flex items-center gap-2 border-b border-line-strong px-3 py-2">
              <span className="balloon" aria-hidden="true">3</span>
              <p className="label text-ink">postMessage bridge · last 7 messages</p>
            </div>
            <ol aria-label="Message log" className="min-h-[9.5rem] space-y-0.5 px-3 py-2 font-mono text-[0.75rem] leading-relaxed">
              {log.length === 0 ? (
                <li className="text-ink-3">Waiting for the storefront to load…</li>
              ) : (
                log.map((m) => (
                  <li key={m.key} className="truncate">
                    <span className={m.dir === "out" ? "text-accent" : "text-ink"} aria-hidden="true">
                      {m.dir === "out" ? "→ " : "← "}
                    </span>
                    <span className="sr-only">{m.dir === "out" ? "Sent: " : "Received: "}</span>
                    <span className="text-ink-2">{m.text}</span>
                  </li>
                ))
              )}
            </ol>
          </div>
        </div>
      </div>

      <div className="border-t border-line px-4 pb-10 pt-6 sm:px-6 lg:px-10">
        <ol className="grid gap-x-10 gap-y-4 text-[0.9375rem] text-ink-2 md:grid-cols-2">
          <Note n={1}>
            <strong className="font-semibold text-ink">Editor.</strong> React + TypeScript. Each change becomes a small patch,
            and rapid changes like dragging the colour picker are merged into one message per frame.
          </Note>
          <Note n={2}>
            <strong className="font-semibold text-ink">Sandboxed storefront.</strong> The iframe has{" "}
            <code className="font-mono text-[0.85em]">sandbox="allow-scripts"</code> only, so it runs with an opaque origin and
            can't read this page, its cookies or its storage.
          </Note>
          <Note n={3}>
            <strong className="font-semibold text-ink">postMessage bridge.</strong> Both sides check{" "}
            <code className="font-mono text-[0.85em]">event.source</code> and the message shape before acting. The storefront
            accepts only known fields and writes text with <code className="font-mono text-[0.85em]">textContent</code>, never as HTML.
          </Note>
          <Note n={4}>
            <strong className="font-semibold text-ink">Handshake.</strong> The storefront announces when it's ready and the
            editor replays the full state, so nothing is lost if the frame loads late. Click the store name or headline in the
            preview to jump to its control.
          </Note>
        </ol>
        <p className="mt-6 max-w-[80ch] text-sm text-ink-3">
          A simplified rebuild of the pattern I used for the VTUNowNow editor, written for this page. It isn't production code,
          and the sample store is fictional.
        </p>
      </div>
    </div>
  );
}

function Note({ n, children }: { n: number; children: ReactNode }) {
  return (
    <li className="grid grid-cols-[2.25rem_1fr]">
      <span className="balloon" aria-hidden="true">
        {n}
      </span>
      <p>
        <span className="sr-only">Callout {n}: </span>
        {children}
      </p>
    </li>
  );
}

function Segmented<T extends string>({
  legend,
  name,
  options,
  value,
  onChange,
  firstRef,
}: {
  legend: string;
  name: string;
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
  firstRef?: (el: HTMLInputElement | null) => void;
}) {
  return (
    <fieldset className="mt-4">
      <legend className="label mb-1.5">{legend}</legend>
      <div className="grid grid-cols-3 border border-line-strong">
        {options.map((o, i) => (
          <label
            key={o.value}
            className="relative cursor-pointer border-line-strong text-center font-mono text-xs not-first:border-l has-checked:bg-ink has-checked:text-paper has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-(--focus)"
          >
            <input
              type="radio"
              name={name}
              value={o.value}
              checked={value === o.value}
              onChange={() => onChange(o.value)}
              ref={i === 0 ? firstRef : undefined}
              className="sr-only"
            />
            <span className="block py-2">{o.label}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
