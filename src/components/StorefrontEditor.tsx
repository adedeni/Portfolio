import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { ArrowUpRight, ChevronLeft, RotateCcw, Save } from "lucide-react";
import { Icon } from "./Icon";

/**
 * Detail A: a small working model of the VTUNowNow template editor.
 *
 * It follows the production design:
 *  - a template ships bundle.html + config.json (cssVars, editables);
 *  - the sidebar is generated from config.json;
 *  - bundle.html runs in an iframe via srcdoc with an editor-only script;
 *  - the editor sends UPDATE_CSS_VAR / UPDATE_TEXT / HIGHLIGHT_ELEMENT and the
 *    preview replies with ELEMENT_CLICKED / FIELD_UPDATED;
 *  - Save clones the preview, strips editor-only nodes and editing attributes,
 *    and would POST the result as html_snapshot (not sent in this demo).
 */

type CssVar = { label: string; variable: string; default: string };
type Editable = {
  id: string;
  label: string;
  type: "text" | "textarea";
  section: string;
  selectors: string[];
  default: string;
};
type TemplateConfig = { id: string; name: string; description: string; cssVars: CssVar[]; editables: Editable[] };
type Loaded = { config: TemplateConfig; html: string };
type LogEntry = { key: number; dir: "out" | "in"; type: string; detail: string };
type Snapshot = { bytes: number; removedNodes: number; cleaned: number; url: string };

const TEMPLATE_SLUG = "template-3";
const BASE = `/storefront/${TEMPLATE_SLUG}`;

/** Same shape as fetchTemplate() in the production editor. */
async function fetchTemplate(): Promise<Loaded> {
  const [html, config] = await Promise.all([
    fetch(`${BASE}/bundle.html`).then((r) => {
      if (!r.ok) throw new Error(`bundle.html: HTTP ${r.status}`);
      return r.text();
    }),
    fetch(`${BASE}/config.json`).then((r) => {
      if (!r.ok) throw new Error(`config.json: HTTP ${r.status}`);
      return r.json() as Promise<TemplateConfig>;
    }),
  ]);
  return { config, html };
}

export function StorefrontEditor() {
  const [state, setState] = useState<
    { status: "loading" } | { status: "error"; message: string } | ({ status: "ready" } & Loaded)
  >({ status: "loading" });
  const [run, setRun] = useState(0);

  useEffect(() => {
    let alive = true;
    fetchTemplate()
      .then((d) => alive && setState({ status: "ready", ...d }))
      .catch((e: Error) => alive && setState({ status: "error", message: e.message }));
    return () => {
      alive = false;
    };
  }, []);

  return (
    <div className="border-t border-line-strong">
      <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-1 border-b border-line px-4 py-2 sm:px-6 lg:px-10">
        <h3 className="label text-ink">Detail A: Template editor (working model)</h3>
        <p className="label">Try it: change a colour, or type in the preview</p>
      </div>

      <div className="px-4 py-8 sm:px-6 lg:px-10 lg:py-10">
        {state.status === "ready" ? (
          // Remounting with a new key is the Reset.
          <LoadedEditor key={run} config={state.config} html={state.html} onReset={() => setRun((n) => n + 1)} />
        ) : (
          <div className="flex h-[560px] flex-col items-center justify-center gap-3 border border-ink bg-[#0f0f0f] text-center">
            {state.status === "loading" ? (
              <>
                <span className="h-7 w-7 animate-spin rounded-full border-2 border-[#2a2a2a] border-t-[#ffe600]" />
                <p className="text-sm text-[#a3a3a3]">Loading template…</p>
              </>
            ) : (
              <p className="text-sm text-[#f0f0f0]">Couldn't load the template ({state.message}).</p>
            )}
          </div>
        )}
      </div>

      <div className="border-t border-line px-4 pb-10 pt-6 sm:px-6 lg:px-10">
        <ol className="grid gap-x-10 gap-y-4 text-[0.9375rem] text-ink-2 md:grid-cols-2">
          <Note n={1} title="Template config.">
            Each template ships a <Code>config.json</Code> listing its colour variables and editable regions. The sidebar is
            generated from it, so a new template needs no editor changes.
          </Note>
          <Note n={2} title="Preview.">
            The template's <Code>bundle.html</Code> loads into an iframe through <Code>srcdoc</Code>, with a small editor-only
            script that makes regions editable in place. It runs with <Code>allow-scripts allow-same-origin</Code>, which the
            save step needs to read the document.
          </Note>
          <Note n={3} title="postMessage protocol.">
            The editor sends <Code>UPDATE_CSS_VAR</Code>, <Code>UPDATE_TEXT</Code> and <Code>HIGHLIGHT_ELEMENT</Code>. The
            preview replies with <Code>ELEMENT_CLICKED</Code> and <Code>FIELD_UPDATED</Code> when a vendor clicks or types
            straight into the page. Both sides check where a message came from.
          </Note>
          <Note n={4} title="Save.">
            The editor clones the preview, strips the editor-only script and editing attributes, and sends the clean HTML as{" "}
            <Code>html_snapshot</Code>. Colours persist as CSS variables on <Code>&lt;html&gt;</Code>. Here, nothing is sent.
          </Note>
        </ol>
        <p className="mt-6 max-w-[80ch] text-sm text-ink-3">
          A simplified working model of the VTUNowNow editor, rebuilt for this page with the same config format, message
          protocol and save step. The sample store is fictional.
        </p>
      </div>
    </div>
  );
}

function LoadedEditor({ config, html, onReset }: { config: TemplateConfig; html: string; onReset: () => void }) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const [fields, setFields] = useState(() => Object.fromEntries(config.editables.map((e) => [e.id, e.default])));
  const [colors, setColors] = useState(() => Object.fromEntries(config.cssVars.map((v) => [v.variable, v.default])));
  const [active, setActive] = useState<string | null>(null);
  const [log, setLog] = useState<LogEntry[]>([]);
  const [snapshot, setSnapshot] = useState<Snapshot | null>(null);
  const logKey = useRef(0);
  const queue = useRef(new Map<string, { type: string; payload: Record<string, string> }>());
  const frame = useRef<number | null>(null);

  const pushLog = useCallback((dir: LogEntry["dir"], type: string, detail: string) => {
    setLog((l) => [...l.slice(-6), { key: ++logKey.current, dir, type, detail }]);
  }, []);

  const send = useCallback(
    (type: string, payload: Record<string, string>) => {
      iframeRef.current?.contentWindow?.postMessage({ source: "template-editor", type, payload }, "*");
      const detail =
        type === "UPDATE_CSS_VAR" ? `${payload.variable}: ${payload.value}` : type === "UPDATE_TEXT" ? `${payload.selector} ← "${payload.value}"` : payload.editableId;
      pushLog("out", type, detail);
    },
    [pushLog],
  );

  // Rapid input (dragging a colour, typing) is merged into one message per key per frame.
  const enqueue = useCallback(
    (key: string, type: string, payload: Record<string, string>) => {
      queue.current.set(key, { type, payload });
      if (frame.current !== null) return;
      frame.current = requestAnimationFrame(() => {
        frame.current = null;
        const items = [...queue.current.values()];
        queue.current.clear();
        items.forEach((m) => send(m.type, m.payload));
      });
    },
    [send],
  );

  const updateField = (e: Editable, value: string) => {
    setFields((f) => ({ ...f, [e.id]: value }));
    e.selectors.forEach((selector) => enqueue(`text:${selector}`, "UPDATE_TEXT", { selector, value }));
  };
  const updateColor = (variable: string, value: string) => {
    setColors((c) => ({ ...c, [variable]: value }));
    enqueue(`css:${variable}`, "UPDATE_CSS_VAR", { variable, value });
  };
  const focusField = (id: string) => {
    if (active === id) return;
    setActive(id);
    send("HIGHLIGHT_ELEMENT", { editableId: id });
  };

  // Scroll the sidebar (not the page) to a field.
  const revealField = (id: string) => {
    const panel = panelRef.current;
    const el = panel?.querySelector<HTMLElement>(`#field-${CSS.escape(id)}`);
    if (panel && el) panel.scrollTo({ top: el.offsetTop - 48, behavior: "smooth" });
  };

  useEffect(() => {
    const onMessage = (e: MessageEvent) => {
      if (!iframeRef.current || e.source !== iframeRef.current.contentWindow) return;
      const d = e.data as { source?: unknown; type?: unknown; payload?: { editableId?: unknown; value?: unknown } };
      if (!d || d.source !== "template-iframe" || !d.payload || typeof d.payload.editableId !== "string") return;
      const id = d.payload.editableId;
      if (!config.editables.some((x) => x.id === id)) return;

      if (d.type === "ELEMENT_CLICKED") {
        pushLog("in", "ELEMENT_CLICKED", id);
        setActive(id);
        revealField(id);
      } else if (d.type === "FIELD_UPDATED" && typeof d.payload.value === "string") {
        const value = d.payload.value;
        pushLog("in", "FIELD_UPDATED", `${id} = "${value}"`);
        setActive(id);
        setFields((f) => ({ ...f, [id]: value }));
      }
    };
    window.addEventListener("message", onMessage);
    return () => {
      window.removeEventListener("message", onMessage);
      if (frame.current !== null) cancelAnimationFrame(frame.current);
    };
  }, [config.editables, pushLog]);

  useEffect(() => () => void (snapshot && URL.revokeObjectURL(snapshot.url)), [snapshot]);

  const save = () => {
    const doc = iframeRef.current?.contentDocument;
    if (!doc) return;
    const clone = doc.documentElement.cloneNode(true) as HTMLElement;
    const editorNodes = clone.querySelectorAll("[data-editor-only]");
    editorNodes.forEach((el) => el.remove());
    const editable = clone.querySelectorAll("[contenteditable]");
    editable.forEach((el) => {
      el.removeAttribute("contenteditable");
      el.removeAttribute("spellcheck");
      el.removeAttribute("data-editable-active");
    });
    clone.querySelectorAll("[data-editable-active]").forEach((el) => el.removeAttribute("data-editable-active"));
    const out = `<!doctype html>\n${clone.outerHTML}`;
    const url = URL.createObjectURL(new Blob([out], { type: "text/html" }));
    setSnapshot({ bytes: new Blob([out]).size, removedNodes: editorNodes.length, cleaned: editable.length, url });
    pushLog("out", "save_template", `html_snapshot ${(new Blob([out]).size / 1024).toFixed(1)} KB (not sent)`);
  };

  const sections = [...new Set(config.editables.map((e) => e.section))];

  return (
    <div className="flex flex-col gap-4">
      {/* Editor window, styled like the production editor */}
      <div className="overflow-hidden border border-ink bg-[#0f0f0f] text-[#f0f0f0]">
        <div className="flex items-center justify-between gap-3 border-b border-[#2a2a2a] px-3 py-2 sm:px-4">
          <p className="flex min-w-0 items-center gap-1.5 text-sm">
            <Icon icon={ChevronLeft} size={14} className="text-[#a3a3a3]" />
            <span className="hidden text-[#a3a3a3] sm:inline">Templates</span>
            <span className="hidden text-[#555] sm:inline">/</span>
            <span className="truncate font-semibold">{config.name}</span>
            <Balloon n={1} className="ml-1 shrink-0" />
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onReset}
              className="flex items-center gap-1.5 rounded border border-[#2a2a2a] px-2.5 py-1.5 text-xs text-[#a3a3a3] hover:border-[#555] hover:text-[#f0f0f0]"
            >
              <Icon icon={RotateCcw} size={13} />
              <span className="sr-only sm:not-sr-only">Reset</span>
            </button>
            <button
              type="button"
              onClick={save}
              className="flex items-center gap-1.5 rounded bg-[#ffe600] px-3 py-1.5 text-xs font-semibold text-[#111] hover:bg-[#fff04d]"
            >
              <Icon icon={Save} size={13} />
              Save
              <Balloon n={4} className="ml-0.5 hidden border-[#111] bg-[#ffe600] text-[#111] sm:inline-flex" />
            </button>
          </div>
        </div>

        <div className="flex flex-col md:h-[560px] md:flex-row">
          {/* Sidebar generated from config.json */}
          <div
            ref={panelRef}
            className="relative max-h-[300px] shrink-0 overflow-y-auto border-b border-[#2a2a2a] md:max-h-none md:w-[270px] md:border-b-0 md:border-r"
          >
            <PanelSection title="Colours">
              {config.cssVars.map((v) => (
                <label key={v.variable} className="flex items-center justify-between gap-3 px-4 py-1.5">
                  <span className="text-xs text-[#a3a3a3]">{v.label}</span>
                  <span className="flex items-center gap-2">
                    <span className="font-mono text-xs text-[#a3a3a3]">{colors[v.variable]}</span>
                    <input
                      type="color"
                      value={colors[v.variable]}
                      onChange={(e) => updateColor(v.variable, e.target.value)}
                      className="h-6 w-6 cursor-pointer rounded border-2 border-[#2a2a2a] bg-transparent p-0 hover:border-[#ffe600]"
                    />
                  </span>
                </label>
              ))}
            </PanelSection>
            {sections.map((section) => (
              <PanelSection key={section} title={section}>
                {config.editables
                  .filter((e) => e.section === section)
                  .map((e) => {
                    const isActive = active === e.id;
                    const common = {
                      id: `input-${e.id}`,
                      value: fields[e.id] ?? "",
                      onFocus: () => focusField(e.id),
                      className: `w-full rounded border bg-[#1a1a1a] px-2.5 py-1.5 text-[0.8125rem] text-[#f0f0f0] outline-none focus:border-[#ffe600] ${
                        isActive ? "border-[#ffe600]" : "border-[#2a2a2a]"
                      }`,
                    };
                    return (
                      <div
                        key={e.id}
                        id={`field-${e.id}`}
                        className={`px-4 py-2 transition-colors ${isActive ? "bg-[#1a1a00]" : ""}`}
                      >
                        <label htmlFor={`input-${e.id}`} className="mb-1 flex items-center gap-2 text-xs text-[#a3a3a3]">
                          {e.label}
                          {isActive ? <span className="text-[0.6875rem] text-[#ffe600]">● active</span> : null}
                        </label>
                        {e.type === "textarea" ? (
                          <textarea {...common} rows={2} onChange={(ev) => updateField(e, ev.target.value)} />
                        ) : (
                          <input {...common} onChange={(ev) => updateField(e, ev.target.value)} />
                        )}
                      </div>
                    );
                  })}
              </PanelSection>
            ))}
          </div>

          {/* Preview */}
          <div className="relative min-w-0 flex-1 bg-white">
            <Balloon n={2} className="absolute right-2 top-2 z-10" />
            <iframe
              ref={iframeRef}
              srcDoc={html}
              sandbox="allow-scripts allow-same-origin"
              title={`${config.name} template preview (sample store, editable)`}
              className="block h-[460px] w-full md:h-full"
            />
          </div>
        </div>
      </div>

      {/* Message log + save result */}
      <div className="grid grid-cols-[minmax(0,1fr)] gap-4 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        <div className="border border-line-strong bg-paper-2">
          <div className="flex items-center gap-2 border-b border-line-strong px-3 py-2">
            <Balloon n={3} />
            <p className="label text-ink">postMessage · last 7 messages</p>
          </div>
          <ol aria-label="Message log" className="min-h-[9.5rem] space-y-0.5 px-3 py-2 font-mono text-[0.75rem] leading-relaxed">
            {log.length === 0 ? (
              <li className="text-ink-3">Change a colour or field, or click and type in the preview…</li>
            ) : (
              log.map((m) => (
                <li key={m.key} className="truncate">
                  <span aria-hidden="true" className={m.dir === "out" ? "text-accent" : "text-ink"}>
                    {m.dir === "out" ? "→ " : "← "}
                  </span>
                  <span className="sr-only">{m.dir === "out" ? "Sent " : "Received "}</span>
                  <span className="text-ink">{m.type}</span> <span className="text-ink-2">{m.detail}</span>
                </li>
              ))
            )}
          </ol>
        </div>

        <div className="border border-line-strong bg-paper-2" aria-live="polite">
          <div className="flex items-center gap-2 border-b border-line-strong px-3 py-2">
            <Balloon n={4} />
            <p className="label text-ink">Save · html_snapshot</p>
          </div>
          {snapshot ? (
            <div className="space-y-1.5 px-3 py-2 font-mono text-[0.75rem] leading-relaxed text-ink-2">
              <p>
                <span className="text-ink">{(snapshot.bytes / 1024).toFixed(1)} KB</span> of clean HTML
              </p>
              <p>
                {snapshot.removedNodes} editor-only nodes removed · {snapshot.cleaned} regions un-editable again
              </p>
              <p className="truncate">
                POST vtunownow.php · action=save_template · template_slug={TEMPLATE_SLUG}
              </p>
              <p className="text-ink-3">Not sent: this is a demo.</p>
              <a href={snapshot.url} target="_blank" rel="noopener" className="ink-link inline-flex items-center gap-1 text-ink">
                Open the saved page
                <Icon icon={ArrowUpRight} size={13} />
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            </div>
          ) : (
            <p className="px-3 py-2 font-mono text-[0.75rem] text-ink-3">Press Save to build the snapshot.</p>
          )}
        </div>
      </div>
    </div>
  );
}

function PanelSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="border-b border-[#2a2a2a] pb-2">
      <h4 className="px-4 pb-1 pt-3 text-[0.6875rem] font-semibold uppercase tracking-widest text-[#a3a3a3]">{title}</h4>
      {children}
    </section>
  );
}

function Balloon({ n, className = "" }: { n: number; className?: string }) {
  return (
    <span className={`balloon h-5 w-5 text-[0.6875rem] ${className}`} aria-hidden="true">
      {n}
    </span>
  );
}

function Code({ children }: { children: ReactNode }) {
  return <code className="font-mono text-[0.85em] text-ink">{children}</code>;
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
