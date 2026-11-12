import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { ArrowUpRight, Check, ChevronLeft, RotateCcw, Save, Star, X } from "lucide-react";
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
type PlanItem = { size: string; price: string; featured?: boolean };
type Editable = {
  id: string;
  label: string;
  /** text/textarea/image mirror production; font/toggle/list were added for this page */
  type: "text" | "textarea" | "image" | "font" | "toggle" | "list";
  section: string;
  selectors: string[];
  default: string | PlanItem[];
  /** CSS variable for "font" fields */
  variable?: string;
};

/** System font stacks only, so saved pages stay self-contained. */
const FONTS: Record<string, { label: string; stack: string }> = {
  modern: { label: "Modern", stack: 'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif' },
  rounded: { label: "Rounded", stack: 'ui-rounded, "SF Pro Rounded", "Arial Rounded MT Bold", ui-sans-serif, system-ui, sans-serif' },
  serif: { label: "Classic serif", stack: 'ui-serif, "New York", Georgia, Cambria, "Times New Roman", serif' },
  mono: { label: "Technical", stack: 'ui-monospace, "SF Mono", Menlo, Consolas, monospace' },
};
const MAX_PLANS = 8;
type TemplateConfig = { id: string; name: string; description: string; cssVars: CssVar[]; editables: Editable[] };
type Loaded = { config: TemplateConfig; html: string };
type LogEntry = { key: number; dir: "out" | "in"; type: string; detail: string };
type Snapshot = { bytes: number; removedNodes: number; cleaned: number; url: string };

const DEFAULT_SLUG = "template-1";
type TemplateCard = { template_slug: string; template_name: string; template_description: string; cssVars: CssVar[]; html: string };

/** Same role as get_user_templates in the production API: the list behind the picker. */
async function fetchTemplates(): Promise<TemplateCard[]> {
  const res = await fetch("/storefront/templates.json");
  if (!res.ok) throw new Error(`templates.json: HTTP ${res.status}`);
  const list = (await res.json()).data as Omit<TemplateCard, "cssVars">[];
  // The picker shows each template's colours, read from its config.json.
  return Promise.all(
    list.map(async (t) => {
      const [cfg, html] = await Promise.all([
        fetch(`/storefront/${t.template_slug}/config.json`).then((r) => (r.ok ? (r.json() as Promise<TemplateConfig>) : null)),
        fetch(`/storefront/${t.template_slug}/bundle.html`).then((r) => (r.ok ? r.text() : "")),
      ]);
      // Thumbnails are static pictures: drop scripts so the script-free sandbox has nothing to block.
      return { ...t, cssVars: cfg?.cssVars ?? [], html: html.replace(/<script[\s\S]*?<\/script>/gi, "") };
    }),
  );
}

/** Same shape as fetchTemplate() in the production editor. */
async function fetchTemplate(slug: string): Promise<Loaded> {
  const BASE = `/storefront/${slug}`;
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
  const [slug, setSlug] = useState(DEFAULT_SLUG);
  const [view, setView] = useState<"editor" | "picker">("editor");
  const [cards, setCards] = useState<TemplateCard[] | null>(null);

  useEffect(() => {
    let alive = true;
    setState({ status: "loading" });
    fetchTemplate(slug)
      .then((d) => alive && setState({ status: "ready", ...d }))
      .catch((e: Error) => alive && setState({ status: "error", message: e.message }));
    return () => {
      alive = false;
    };
  }, [slug]);

  useEffect(() => {
    if (view !== "picker" || cards) return;
    fetchTemplates()
      .then(setCards)
      .catch(() => setCards([]));
  }, [view, cards]);

  const choose = (next: string) => {
    if (next !== slug) setSlug(next);
    else setRun((n) => n + 1);
    setView("editor");
  };

  return (
    <div className="no-print border-t border-line-strong">
      <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-1 border-b border-line px-4 py-2 sm:px-6 lg:px-10">
        <h3 className="label text-ink">Detail A: Template editor (working model)</h3>
        <p className="label">Try it: edit the store, then save to see the finished page</p>
      </div>

      <div className="px-4 py-8 sm:px-6 lg:px-10 lg:py-10">
        {view === "picker" ? (
          <TemplatePicker cards={cards} current={slug} onSelect={choose} onCancel={() => setView("editor")} />
        ) : state.status === "ready" ? (
          // Remounting with a new key is the Reset.
          <LoadedEditor
            key={`${state.config.id}-${run}`}
            config={state.config}
            html={state.html}
            onReset={() => setRun((n) => n + 1)}
            onBack={() => setView("picker")}
          />
        ) : (
          <div className="flex h-[560px] flex-col items-center justify-center gap-3 border border-ink bg-[#0f0f0f] text-center">
            {state.status === "loading" ? (
              <>
                <span className="h-7 w-7 animate-spin rounded-full border-2 border-[#2a2a2a] border-t-[#ffe600]" />
                <p className="text-sm text-[#a3a3a3]">Loading template…</p>
                <noscript>
                  <p className="max-w-[40ch] text-sm text-[#f0f0f0]">The editor needs JavaScript. Turn it on to try it.</p>
                </noscript>
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
            generated from it: pick another template under ‹ Templates and the panel rebuilds itself, with no editor
            changes.
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
          A working model of the VTUNowNow editor, rebuilt for this page on the same config format, message protocol and save
          step as production. The font, show/hide and price-list controls go further than the production editor and were added
          for this page. The storefront brands are fictional.
        </p>
      </div>
    </div>
  );
}

function LoadedEditor({
  config,
  html,
  onReset,
  onBack,
}: {
  config: TemplateConfig;
  html: string;
  onReset: () => void;
  onBack: () => void;
}) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const [fields, setFields] = useState<Record<string, string>>(() =>
    Object.fromEntries(config.editables.map((e) => [e.id, typeof e.default === "string" ? e.default : JSON.stringify(e.default)])),
  );
  const [colors, setColors] = useState(() => Object.fromEntries(config.cssVars.map((v) => [v.variable, v.default])));
  const [active, setActive] = useState<string | null>(null);
  const [log, setLog] = useState<LogEntry[]>([]);
  const [snapshot, setSnapshot] = useState<Snapshot | null>(null);
  // Edits made after the last save, so the saved page may be out of date
  const [dirty, setDirty] = useState(false);
  // Brief "Saved" confirmation in the top bar
  const [justSaved, setJustSaved] = useState(false);
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
        type === "UPDATE_CSS_VAR"
          ? `${payload.variable}: ${payload.variable === "--font-family" ? payload.value.split(",")[0] : payload.value}`
          : type === "UPDATE_VISIBILITY"
            ? `${payload.selector} → ${payload.value === "off" ? "hidden" : "shown"}`
            : type === "UPDATE_LIST"
              ? `${payload.selector} ← ${(() => { try { return (JSON.parse(payload.value) as unknown[]).length; } catch { return 0; } })()} items`
          : type === "UPDATE_TEXT"
            ? `${payload.selector} ← "${payload.value}"`
            : type === "UPDATE_IMAGE"
              ? `${payload.selector} ← ${payload.value ? `image (${Math.max(1, Math.round(payload.value.length / 1024))} KB)` : "removed"}`
              : payload.editableId;
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
    setDirty(true);
    setFields((f) => ({ ...f, [e.id]: value }));
    e.selectors.forEach((selector) => enqueue(`text:${selector}`, "UPDATE_TEXT", { selector, value }));
  };
  const updateImage = (e: Editable, value: string) => {
    setDirty(true);
    setFields((f) => ({ ...f, [e.id]: value }));
    setActive(e.id);
    e.selectors.forEach((selector) => send("UPDATE_IMAGE", { selector, value }));
  };
  const updateColor = (variable: string, value: string) => {
    setDirty(true);
    setColors((c) => ({ ...c, [variable]: value }));
    enqueue(`css:${variable}`, "UPDATE_CSS_VAR", { variable, value });
  };
  const focusField = (id: string, highlight = true) => {
    if (active === id) return;
    setActive(id);
    if (highlight) send("HIGHLIGHT_ELEMENT", { editableId: id });
  };
  const updateFont = (e: Editable, key: string) => {
    setDirty(true);
    setFields((f) => ({ ...f, [e.id]: key }));
    send("UPDATE_CSS_VAR", { variable: e.variable ?? "--font-family", value: FONTS[key]?.stack ?? FONTS.modern.stack });
  };
  const updateToggle = (e: Editable, on: boolean) => {
    setDirty(true);
    setFields((f) => ({ ...f, [e.id]: on ? "on" : "off" }));
    e.selectors.forEach((selector) => send("UPDATE_VISIBILITY", { selector, value: on ? "on" : "off" }));
  };
  const updateList = (e: Editable, items: PlanItem[]) => {
    setDirty(true);
    const value = JSON.stringify(items.slice(0, MAX_PLANS));
    setFields((f) => ({ ...f, [e.id]: value }));
    e.selectors.forEach((selector) => enqueue(`list:${selector}`, "UPDATE_LIST", { selector, value }));
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
        setDirty(true);
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

  const save = (): string | null => {
    const doc = iframeRef.current?.contentDocument;
    if (!doc) return null;
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
    setDirty(false);
    setJustSaved(true);
    window.setTimeout(() => setJustSaved(false), 2200);
    return url;
  };

  /** Save, then open the result straight away (runs inside the click, so it isn't blocked as a pop-up). */
  const saveAndOpen = () => {
    const url = save();
    if (url) window.open(url, "_blank", "noopener");
  };

  const sections = [...new Set(config.editables.map((e) => e.section))];

  return (
    <div className="flex flex-col gap-4">
      {/* Editor window, styled like the production editor */}
      <div className="overflow-hidden border border-ink bg-[#0f0f0f] text-[#f0f0f0]">
        <div className="flex items-center justify-between gap-3 border-b border-[#2a2a2a] px-3 py-2 sm:px-4">
          <div className="flex min-w-0 items-center gap-1.5 text-sm">
            <button
              type="button"
              onClick={onBack}
              className="flex shrink-0 items-center gap-1 rounded px-1 py-1 text-[#a3a3a3] hover:text-[#ffe600]"
            >
              <Icon icon={ChevronLeft} size={14} />
              <span className="sr-only sm:not-sr-only">Templates</span>
            </button>
            <span className="hidden text-[#555] sm:inline">/</span>
            <span className="truncate font-semibold">{config.name}</span>
            <Balloon n={1} className="ml-1 shrink-0" />
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onReset}
              className="flex items-center gap-1.5 rounded border border-[#2a2a2a] px-2.5 py-1.5 text-xs text-[#a3a3a3] hover:border-[#555] hover:text-[#f0f0f0]"
            >
              <Icon icon={RotateCcw} size={13} />
              <span className="sr-only sm:not-sr-only">Reset</span>
            </button>
            {snapshot ? (
              <a
                href={snapshot.url}
                target="_blank"
                rel="noopener"
                className="pop-in flex items-center gap-1.5 rounded border border-[#ffe600] px-2.5 py-1.5 text-xs font-semibold text-[#ffe600] hover:bg-[#1a1a00]"
              >
                <span className="hidden sm:inline">View page</span>
                <span className="sm:hidden">View</span>
                <Icon icon={ArrowUpRight} size={13} />
                <span className="sr-only"> (opens the saved page in a new tab)</span>
              </a>
            ) : null}
            <button
              type="button"
              onClick={() => void save()}
              className="flex items-center gap-1.5 rounded bg-[#ffe600] px-3 py-1.5 text-xs font-semibold text-[#111] hover:bg-[#fff04d]"
            >
              <Icon icon={justSaved ? Check : Save} size={13} />
              {justSaved ? "Saved" : "Save"}
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
                        {e.type === "toggle" ? null : e.type === "list" ? (
                          <p id={`label-${e.id}`} className="mb-1 flex items-center gap-2 text-xs text-[#a3a3a3]">
                            {e.label}
                            {isActive ? <span className="text-[0.6875rem] text-[#ffe600]">● active</span> : null}
                          </p>
                        ) : (
                          <label htmlFor={`input-${e.id}`} className="mb-1 flex items-center gap-2 text-xs text-[#a3a3a3]">
                            {e.label}
                            {isActive ? <span className="text-[0.6875rem] text-[#ffe600]">● active</span> : null}
                          </label>
                        )}
                        {e.type === "font" ? (
                          <select
                            id={`input-${e.id}`}
                            value={fields[e.id] ?? "modern"}
                            onFocus={() => focusField(e.id, false)}
                            onChange={(ev) => updateFont(e, ev.target.value)}
                            className={common.className}
                          >
                            {Object.entries(FONTS).map(([key, f]) => (
                              <option key={key} value={key}>
                                {f.label}
                              </option>
                            ))}
                          </select>
                        ) : e.type === "toggle" ? (
                          <ToggleField
                            id={`input-${e.id}`}
                            label={e.label}
                            on={(fields[e.id] ?? "on") !== "off"}
                            onFocus={() => focusField(e.id, false)}
                            onChange={(on) => updateToggle(e, on)}
                          />
                        ) : e.type === "list" ? (
                          <ListField
                            labelledBy={`label-${e.id}`}
                            items={(() => {
                              try {
                                return JSON.parse(fields[e.id] ?? "[]") as PlanItem[];
                              } catch {
                                return [];
                              }
                            })()}
                            onFocus={() => focusField(e.id)}
                            onChange={(items) => updateList(e, items)}
                          />
                        ) : e.type === "image" ? (
                          <ImageField
                            id={`input-${e.id}`}
                            value={fields[e.id] ?? ""}
                            brand={fields.brand_name ?? config.name}
                            onFocus={() => focusField(e.id)}
                            onChange={(v) => updateImage(e, v)}
                          />
                        ) : e.type === "textarea" ? (
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
              title={`${config.name} template preview (editable)`}
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

        <div className="order-first border border-line-strong bg-paper-2 lg:order-none" aria-live="polite">
          <div className="flex items-center gap-2 border-b border-line-strong px-3 py-2">
            <Balloon n={4} />
            <p className="label text-ink">Save · html_snapshot</p>
          </div>
          {snapshot ? (
            <div className="px-3 py-3">
              {dirty ? (
                <p className="mb-3 flex items-start gap-2 text-[0.875rem] text-ink">
                  <span aria-hidden="true" className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-accent" />
                  You've changed the store since saving. Save again to update the page.
                </p>
              ) : null}
              <div className="flex flex-wrap gap-2">
                {dirty ? (
                  <button type="button" onClick={saveAndOpen} className="btn btn-primary">
                    <Icon icon={Save} />
                    Save and view again
                    <Icon icon={ArrowUpRight} size={14} />
                    <span className="sr-only"> (opens in a new tab)</span>
                  </button>
                ) : (
                  <a href={snapshot.url} target="_blank" rel="noopener" className="btn btn-primary">
                    Open the saved page
                    <Icon icon={ArrowUpRight} size={14} />
                    <span className="sr-only"> (opens in a new tab)</span>
                  </a>
                )}
              </div>
              <div className="mt-3 space-y-1 font-mono text-[0.75rem] leading-relaxed text-ink-2">
                <p>
                  <span className="text-ink">{(snapshot.bytes / 1024).toFixed(1)} KB</span> of clean HTML ·{" "}
                  {snapshot.removedNodes} editor-only nodes removed · {snapshot.cleaned} regions un-editable again
                </p>
                <p className="truncate text-ink-3">
                  POST vtunownow.php · action=save_template · template_slug={config.id} · not sent from this page
                </p>
              </div>
            </div>
          ) : (
            <div className="px-3 py-3">
              <p className="text-[0.9375rem] text-ink">
                See the result: Save turns your edits into the finished, standalone storefront a vendor would publish.
              </p>
              <button type="button" onClick={saveAndOpen} className="btn btn-primary mt-3">
                <Icon icon={Save} />
                Save and view the page
                <Icon icon={ArrowUpRight} size={14} />
                <span className="sr-only"> (opens in a new tab)</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function TemplatePicker({
  cards,
  current,
  onSelect,
  onCancel,
}: {
  cards: TemplateCard[] | null;
  current: string;
  onSelect: (slug: string) => void;
  onCancel: () => void;
}) {
  return (
    <div className="overflow-hidden border border-ink bg-[#0f0f0f] text-[#f0f0f0]">
      <div className="flex items-center justify-between gap-3 border-b border-[#2a2a2a] px-3 py-2 sm:px-4">
        <p className="flex items-center gap-2 text-sm font-semibold">
          Templates
          <Balloon n={1} />
        </p>
        <button
          type="button"
          onClick={onCancel}
          className="flex items-center gap-1.5 rounded border border-[#2a2a2a] px-2.5 py-1.5 text-xs text-[#a3a3a3] hover:border-[#555] hover:text-[#f0f0f0]"
        >
          <Icon icon={ChevronLeft} size={13} />
          Back to editor
        </button>
      </div>
      <div className="overflow-y-auto p-4 md:h-[560px] md:p-6">
        <p className="mb-5 max-w-[60ch] text-sm text-[#a3a3a3]">
          Choose a template. The editor fetches its <code className="font-mono text-[#f0f0f0]">bundle.html</code> and{" "}
          <code className="font-mono text-[#f0f0f0]">config.json</code>, then builds the sidebar from the config.
        </p>
        {cards === null ? (
          <p className="text-sm text-[#a3a3a3]">Loading templates…</p>
        ) : cards.length === 0 ? (
          <p className="text-sm text-[#f0f0f0]">Couldn't load the template list.</p>
        ) : (
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {cards.map((t) => {
              const isCurrent = t.template_slug === current;
              return (
                <li
                  key={t.template_slug}
                  className={`group relative flex h-full flex-col gap-3 rounded-lg border p-4 transition-colors has-[button:hover]:border-[#ffe600] has-[button:hover]:bg-[#1a1a00] has-[button:focus-visible]:outline has-[button:focus-visible]:outline-2 has-[button:focus-visible]:outline-[#ffe600] ${
                    isCurrent ? "border-[#ffe600]" : "border-[#2a2a2a] bg-[#141414]"
                  }`}
                >
                  <Thumbnail html={t.html} name={t.template_name} />
                  <span className="flex gap-1.5" aria-hidden="true">
                    {t.cssVars.map((v) => (
                      <span key={v.variable} className="h-4 w-4 rounded-full border border-[#2a2a2a]" style={{ backgroundColor: v.default }} />
                    ))}
                  </span>
                  <button
                    type="button"
                    onClick={() => onSelect(t.template_slug)}
                    aria-current={isCurrent ? "true" : undefined}
                    className="flex-1 text-left outline-none after:absolute after:inset-0 after:content-['']"
                  >
                    <span className="block text-sm font-semibold group-has-[button:hover]:text-[#ffe600]">{t.template_name}</span>
                    <span className="mt-1 block text-xs leading-relaxed text-[#a3a3a3]">{t.template_description}</span>
                  </button>
                  <span className="flex items-center justify-between border-t border-[#2a2a2a] pt-2 font-mono text-[0.6875rem] text-[#a3a3a3]">
                    {t.template_slug}
                    {isCurrent ? <span className="text-[#ffe600]">current</span> : <span aria-hidden="true">→</span>}
                  </span>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}

/** A static, script-free preview of a template, scaled down to fit its card. */
function Thumbnail({ html, name }: { html: string; name: string }) {
  const boxRef = useRef<HTMLSpanElement>(null);
  const [scale, setScale] = useState(0.25);
  useEffect(() => {
    const el = boxRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => setScale(entry.contentRect.width / 1280));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return (
    <span ref={boxRef} className="relative block aspect-[16/10] w-full overflow-hidden rounded border border-[#2a2a2a] bg-white" aria-hidden="true">
      {html ? (
        <iframe
          srcDoc={html}
          sandbox=""
          tabIndex={-1}
          title={`${name} template thumbnail`}
          loading="lazy"
          className="pointer-events-none absolute left-0 top-0 origin-top-left border-0"
          style={{ width: 1280, height: 800, transform: `scale(${scale})` }}
        />
      ) : null}
    </span>
  );
}

const IMAGE_TYPES = ["image/png", "image/jpeg", "image/webp", "image/gif", "image/svg+xml"];

/** Read an uploaded logo; raster images are scaled to at most 256px so snapshots stay small. */
async function readLogo(file: File): Promise<string> {
  if (!IMAGE_TYPES.includes(file.type)) throw new Error("Use a PNG, JPEG, WebP, GIF or SVG image.");
  if (file.size > 2 * 1024 * 1024) throw new Error("Use an image under 2 MB.");
  if (file.type === "image/svg+xml") {
    return new Promise((resolve, reject) => {
      const r = new FileReader();
      r.onload = () => resolve(String(r.result));
      r.onerror = () => reject(new Error("Couldn't read that file."));
      r.readAsDataURL(file);
    });
  }
  const bmp = await createImageBitmap(file);
  const scale = Math.min(1, 256 / Math.max(bmp.width, bmp.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bmp.width * scale);
  canvas.height = Math.round(bmp.height * scale);
  canvas.getContext("2d")?.drawImage(bmp, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL("image/png");
}

/** A simple generated mark, so visitors can try the logo field without a file. */
function sampleLogo(brand: string) {
  const letter = (brand.trim()[0] ?? "S").toUpperCase().replace(/[^A-Z0-9]/, "S");
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#1f2937"/><stop offset="1" stop-color="#4338ca"/></linearGradient></defs><rect width="64" height="64" rx="16" fill="url(#g)"/><circle cx="32" cy="32" r="19" fill="none" stroke="#facc15" stroke-width="4"/><text x="32" y="41" text-anchor="middle" font-family="Arial, sans-serif" font-size="24" font-weight="700" fill="#fff">${letter}</text></svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

function ImageField({
  id,
  value,
  brand,
  onFocus,
  onChange,
}: {
  id: string;
  value: string;
  brand: string;
  onFocus: () => void;
  onChange: (value: string) => void;
}) {
  const [error, setError] = useState("");
  const onFile = async (file: File | undefined) => {
    if (!file) return;
    try {
      setError("");
      onChange(await readLogo(file));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Couldn't use that image.");
    }
  };
  return (
    <div>
      {value ? (
        <div className="flex items-center gap-3">
          <img src={value} alt="Current logo" width={40} height={40} className="h-10 w-10 rounded border border-[#2a2a2a] bg-white object-cover" />
          <button
            type="button"
            onFocus={onFocus}
            onClick={() => onChange("")}
            className="rounded border border-[#2a2a2a] px-2.5 py-1 text-xs text-[#a3a3a3] hover:border-[#555] hover:text-[#f0f0f0]"
          >
            Remove
          </button>
        </div>
      ) : (
        <label className="flex cursor-pointer items-center justify-center gap-2 rounded border border-dashed border-[#2a2a2a] py-2 text-xs text-[#a3a3a3] transition-colors hover:border-[#ffe600] hover:bg-[#1a1a00] hover:text-[#ffe600] has-focus-visible:border-[#ffe600] has-focus-visible:text-[#ffe600]">
          <span aria-hidden="true">+</span> Upload image
          <input
            id={id}
            type="file"
            accept={IMAGE_TYPES.join(",")}
            onFocus={onFocus}
            onChange={(ev) => {
              void onFile(ev.target.files?.[0]);
              ev.target.value = "";
            }}
            className="sr-only"
          />
        </label>
      )}
      {!value ? (
        <button type="button" onFocus={onFocus} onClick={() => onChange(sampleLogo(brand))} className="mt-1.5 text-[0.6875rem] text-[#a3a3a3] underline underline-offset-2 hover:text-[#ffe600]">
          or use a sample logo
        </button>
      ) : null}
      <p className="mt-1 text-[0.6875rem] text-[#f87171]" aria-live="polite">
        {error}
      </p>
    </div>
  );
}

/** On/off switch for showing a template section. */
function ToggleField({
  id,
  label,
  on,
  onFocus,
  onChange,
}: {
  id: string;
  label: string;
  on: boolean;
  onFocus: () => void;
  onChange: (on: boolean) => void;
}) {
  return (
    <button
      id={id}
      type="button"
      role="switch"
      aria-checked={on}
      onFocus={onFocus}
      onClick={() => onChange(!on)}
      className="flex w-full items-center justify-between gap-3 rounded py-1 text-left text-xs text-[#d4d4d4]"
    >
      {label}
      <span
        aria-hidden="true"
        className={`relative h-5 w-9 shrink-0 rounded-full border transition-colors ${on ? "border-[#ffe600] bg-[#ffe600]" : "border-[#3a3a3a] bg-[#1a1a1a]"}`}
      >
        <span className={`absolute top-0.5 h-3.5 w-3.5 rounded-full transition-all ${on ? "left-[18px] bg-[#111]" : "left-0.5 bg-[#888]"}`} />
      </span>
    </button>
  );
}

/** Editable price list: name and price per plan, one marked "Most popular". */
function ListField({
  labelledBy,
  items,
  onFocus,
  onChange,
}: {
  labelledBy: string;
  items: PlanItem[];
  onFocus: () => void;
  onChange: (items: PlanItem[]) => void;
}) {
  const set = (i: number, patch: Partial<PlanItem>) => onChange(items.map((it, j) => (j === i ? { ...it, ...patch } : it)));
  const feature = (i: number) => onChange(items.map((it, j) => ({ ...it, featured: j === i ? !it.featured : false })));
  const input = "min-w-0 rounded border border-[#2a2a2a] bg-[#1a1a1a] px-2 py-1.5 text-[0.8125rem] text-[#f0f0f0] outline-none focus:border-[#ffe600]";
  return (
    <div role="group" aria-labelledby={labelledBy} className="space-y-1.5">
      {items.map((it, i) => (
        <div key={i} className="grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto_auto] items-center gap-1.5">
          <input aria-label={`Plan ${i + 1} name`} value={it.size} maxLength={24} onFocus={onFocus} onChange={(ev) => set(i, { size: ev.target.value })} className={input} />
          <input aria-label={`Plan ${i + 1} price`} value={it.price} maxLength={24} onFocus={onFocus} onChange={(ev) => set(i, { price: ev.target.value })} className={input} />
          <button
            type="button"
            aria-pressed={!!it.featured}
            aria-label={`Mark plan ${i + 1} as most popular`}
            title="Most popular"
            onFocus={onFocus}
            onClick={() => feature(i)}
            className={`grid h-7 w-7 place-items-center rounded border text-xs ${it.featured ? "border-[#ffe600] text-[#ffe600]" : "border-[#2a2a2a] text-[#777] hover:text-[#d4d4d4]"}`}
          >
            <Icon icon={Star} size={13} className={it.featured ? "fill-current" : ""} />
          </button>
          <button
            type="button"
            aria-label={`Remove plan ${i + 1}`}
            disabled={items.length <= 1}
            onFocus={onFocus}
            onClick={() => onChange(items.filter((_, j) => j !== i))}
            className="grid h-7 w-7 place-items-center rounded border border-[#2a2a2a] text-xs text-[#999] hover:text-[#f0f0f0] disabled:opacity-40"
          >
            <Icon icon={X} size={13} />
          </button>
        </div>
      ))}
      <button
        type="button"
        disabled={items.length >= MAX_PLANS}
        onFocus={onFocus}
        onClick={() => onChange([...items, { size: "New plan", price: "₦0" }])}
        className="mt-1 w-full rounded border border-dashed border-[#2a2a2a] py-1.5 text-xs text-[#a3a3a3] hover:border-[#ffe600] hover:text-[#ffe600] disabled:opacity-40"
      >
        + Add plan {items.length >= MAX_PLANS ? `(max ${MAX_PLANS})` : ""}
      </button>
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
