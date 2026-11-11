import type { ReactNode } from "react";
import { sheets, type SheetId } from "../data/content";

/**
 * A numbered drawing sheet. Renders the header strip ("SHEET 02 / 08")
 * and a ruled paper panel.
 */
export function Sheet({
  id,
  kicker,
  aside,
  children,
  className = "",
  as: Tag = "section",
  labelledBy,
}: {
  id: SheetId;
  kicker?: string;
  aside?: ReactNode;
  children: ReactNode;
  className?: string;
  as?: "section" | "header" | "footer";
  labelledBy?: string;
}) {
  const index = sheets.findIndex((s) => s.id === id);
  const sheet = sheets[index];
  return (
    <Tag
      id={id}
      aria-labelledby={labelledBy}
      className={`sheet mx-auto w-full max-w-[1200px] ${className}`}
    >
      <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-1 border-b border-line-strong px-4 py-2 sm:px-6">
        <p className="label">
          <span className="text-ink">Sheet {sheet.no}</span> / {String(sheets.length).padStart(2, "0")}
          <span aria-hidden="true"> · </span>
          {kicker ?? sheet.title}
        </p>
        {aside ? <div className="label">{aside}</div> : null}
      </div>
      {children}
    </Tag>
  );
}
