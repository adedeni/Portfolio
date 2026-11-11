import { createLucideIcon, type LucideIcon } from "lucide-react";

/**
 * One place for icon styling: thin, even strokes like drawing linework.
 * Icons are decorative (aria-hidden); the adjacent text carries the meaning.
 */
export function Icon({
  icon: Glyph,
  size = 16,
  className = "",
}: {
  icon: LucideIcon;
  size?: number;
  className?: string;
}) {
  return (
    <Glyph
      size={size}
      strokeWidth={1.5}
      absoluteStrokeWidth
      aria-hidden="true"
      focusable="false"
      className={`shrink-0 ${className}`}
    />
  );
}

/* Brand marks drawn in the same stroke style (Lucide no longer ships them). */
export const GitHubIcon = createLucideIcon("github", [
  [
    "path",
    {
      d: "M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4",
      key: "body",
    },
  ],
  ["path", { d: "M9 18c-4.51 2-5-2-7-2", key: "tail" }],
]);

export const LinkedInIcon = createLucideIcon("linkedin", [
  ["path", { d: "M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z", key: "n" }],
  ["rect", { width: "4", height: "12", x: "2", y: "9", key: "i" }],
  ["circle", { cx: "4", cy: "4", r: "2", key: "dot" }],
]);
