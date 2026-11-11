import type { ReactNode } from "react";
import type { LinkItem } from "../data/content";

/** External link, or a clearly marked placeholder when the URL isn't supplied yet. */
export function ExtLink({
  link,
  className = "",
  children,
}: {
  link: LinkItem;
  className?: string;
  children?: ReactNode;
}) {
  if (!link.href) {
    return (
      <span
        className={`inline-flex items-center gap-1.5 border border-dashed border-line-strong px-1.5 font-mono text-[0.8125rem] text-ink-3 ${className}`}
        title="Link to be supplied"
      >
        {children ?? link.label}
        <span className="text-[0.6875rem] uppercase tracking-wider">· link pending</span>
      </span>
    );
  }
  return (
    <a
      href={link.href}
      target="_blank"
      rel="noopener noreferrer"
      className={`ink-link ${className}`}
    >
      {children ?? link.label}
      <span aria-hidden="true"> ↗</span>
      <span className="sr-only"> (opens in a new tab)</span>
    </a>
  );
}
