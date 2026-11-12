import { useEffect, useRef, useState } from "react";
import { contact, person } from "../data/content";
import { ThemeToggle } from "./ThemeToggle";
import { FileDown, Menu as MenuIcon, X } from "lucide-react";
import { Icon } from "./Icon";

const nav = [
  { href: "#vtunownow", label: "Work", sections: ["vtunownow", "pmcsms", "work"] },
  { href: "#experience", label: "Experience", sections: ["experience"] },
  { href: "#skills", label: "Skills", sections: ["skills"] },
  { href: "#background", label: "Background", sections: ["background"] },
  { href: "#contact", label: "Contact", sections: ["contact"] },
];

/** Which nav item matches the section 40% of the way down the screen (the last one at page bottom). */
function useCurrentSection() {
  const [current, setCurrent] = useState<string | null>(null);
  useEffect(() => {
    const ids = nav.flatMap((n) => n.sections);
    let frame = 0;
    const update = () => {
      frame = 0;
      const probe = window.innerHeight * 0.4;
      const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;
      let found: string | null = atBottom ? ids[ids.length - 1] : null;
      if (!found) {
        for (const id of ids) {
          const r = document.getElementById(id)?.getBoundingClientRect();
          if (r && r.top <= probe && r.bottom > probe) {
            found = id;
            break;
          }
        }
      }
      setCurrent(found);
      // Reading progress, drawn as a pen line under the header (see .scroll-progress).
      const max = document.documentElement.scrollHeight - window.innerHeight;
      document.documentElement.style.setProperty("--progress", max > 0 ? Math.min(1, window.scrollY / max).toFixed(4) : "0");
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);
  return nav.find((n) => current && n.sections.includes(current))?.href ?? null;
}

export function Header() {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const headerRef = useRef<HTMLElement>(null);
  const active = useCurrentSection();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    // Close when tapping anywhere outside the header.
    const onPointer = (e: PointerEvent) => {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
    };
  }, [open]);

  return (
    <header ref={headerRef} className="sticky top-0 z-50 border-b border-line-strong bg-paper/95 backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-[1240px] items-center gap-3 px-4 sm:px-6">
        <a href="#top" className="mr-auto flex items-center gap-2.5 no-underline">
          <span
            aria-hidden="true"
            className="flex h-8 w-8 items-center justify-center border border-ink font-mono text-xs font-medium"
          >
            {person.initials}
          </span>
          <span className="sr-only sm:not-sr-only sm:text-[0.9375rem] sm:font-semibold sm:[font-stretch:112%]">
            {person.name}
          </span>
        </a>

        <nav aria-label="Primary" className="hidden lg:block">
          <ul className="flex items-center gap-6 font-mono text-[0.8125rem]">
            {nav.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  aria-current={active === item.href ? "true" : undefined}
                  className="relative py-1 no-underline transition-colors hover:text-accent aria-[current=true]:text-accent"
                >
                  {item.label}
                  <span
                    aria-hidden="true"
                    className={`absolute -bottom-0.5 left-0 h-px w-full origin-left bg-accent transition-transform duration-300 ${
                      active === item.href ? "scale-x-100" : "scale-x-0"
                    }`}
                  />
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <a href={contact.cv.href} download={contact.cv.downloadName} className="btn btn-ghost min-h-10 px-3">
            <Icon icon={FileDown} />
            CV
            <span className="sr-only"> (download PDF)</span>
          </a>
          <button
            ref={buttonRef}
            type="button"
            className="btn btn-ghost min-h-10 px-3 lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen((v) => !v)}
          >
            <Icon icon={open ? X : MenuIcon} />
            {open ? "Close" : "Menu"}
          </button>
        </div>
      </div>

      <span aria-hidden="true" className="scroll-progress no-print" />

      {/* Always rendered so it can slide open; inert and hidden from assistive tech while closed. */}
      <nav
        id="mobile-nav"
        aria-label="Primary"
        inert={!open}
        data-open={open ? "" : undefined}
        className="mobile-nav bg-paper lg:hidden"
      >
        <div>
          <ul className="mx-auto max-w-[1240px] divide-y divide-line border-t border-line-strong px-4 sm:px-6">
            {nav.map((item, i) => (
              <li key={item.href} style={{ ["--i" as string]: i }}>
                <a
                  href={item.href}
                  onClick={() => setOpen(false)}
                  aria-current={active === item.href ? "true" : undefined}
                  className="group flex min-h-12 items-center gap-3 font-mono text-sm no-underline aria-[current=true]:text-accent"
                >
                  <span className="text-xs text-ink-3 group-aria-[current=true]:text-accent">{String(i + 1).padStart(2, "0")}</span>
                  {item.label}
                  <span aria-hidden="true" className="ml-auto text-ink-3 transition-transform group-hover:translate-x-1">
                    →
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </header>
  );
}
