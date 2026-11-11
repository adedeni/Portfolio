import type { CSSProperties } from "react";

/** Props for an element that rises into place when scrolled into view. */
export const reveal = (i = 0) => ({ "data-reveal": "", style: { "--i": i } as CSSProperties });

/**
 * Marks [data-reveal] / [data-observe] elements with data-inview once they
 * enter the viewport. CSS does the rest (see "Motion" in index.css).
 */
export function startReveal() {
  const targets = document.querySelectorAll<HTMLElement>("[data-reveal], [data-observe], .sheet");
  const show = (el: Element) => el.setAttribute("data-inview", "");
  if (!("IntersectionObserver" in window)) {
    targets.forEach(show);
    return;
  }
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          show(e.target);
          io.unobserve(e.target);
        }
      }
    },
    { rootMargin: "0px 0px -8% 0px", threshold: 0.12 },
  );
  targets.forEach((el) => io.observe(el));
}
