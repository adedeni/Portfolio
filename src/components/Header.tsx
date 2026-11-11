import { useEffect, useRef, useState } from "react";
import { contact, person } from "../data/content";
import { ThemeToggle } from "./ThemeToggle";
import { FileDown, Menu as MenuIcon, X } from "lucide-react";
import { Icon } from "./Icon";

const nav = [
  { href: "#vtunownow", label: "Work" },
  { href: "#experience", label: "Experience" },
  { href: "#skills", label: "Skills" },
  { href: "#background", label: "Background" },
  { href: "#contact", label: "Contact" },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className="sticky top-0 z-50 border-b border-line-strong bg-paper/95 backdrop-blur-sm">
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
                <a href={item.href} className="ink-link no-underline hover:underline">
                  {item.label}
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

      <nav
        id="mobile-nav"
        aria-label="Primary"
        hidden={!open}
        className="border-t border-line-strong bg-paper lg:hidden"
      >
        <ul className="mx-auto max-w-[1240px] divide-y divide-line px-4 sm:px-6">
          {nav.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                onClick={() => setOpen(false)}
                className="flex min-h-12 items-center font-mono text-sm no-underline"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
