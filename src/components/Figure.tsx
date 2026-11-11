import type { Screenshot } from "../data/content";
import { ImagePlus } from "lucide-react";
import { Icon } from "./Icon";
import { reveal } from "../reveal";

/** A project screenshot, or a hatched "to be supplied" placeholder. */
export function Figure({ shot, fig }: { shot: Screenshot; fig: string }) {
  if (shot.kind === "pending") {
    return (
      <figure {...reveal(1)}>
        <div className="hatch flex aspect-[16/10] w-full items-center justify-center border border-line-strong p-4">
          <div className="max-w-[28ch] border border-line-strong bg-paper px-4 py-3 text-center">
            <Icon icon={ImagePlus} size={22} className="mx-auto mb-2 text-ink-3" />
            <p className="label text-ink">Placeholder: screenshot to be supplied</p>
            <p className="mt-1 text-sm text-ink-2">{shot.needed}</p>
          </div>
        </div>
        <figcaption className="label mt-2">
          Fig. {fig}: {shot.caption}
        </figcaption>
      </figure>
    );
  }
  return (
    <figure {...reveal(1)}>
      <a href={shot.webp} target="_blank" rel="noopener" className="group block cursor-zoom-in">
      <picture>
        {shot.avif ? <source srcSet={shot.avif} type="image/avif" /> : null}
        <img
          src={shot.webp}
          width={shot.width}
          height={shot.height}
          alt={shot.alt}
          loading="lazy"
          decoding="async"
          className="h-auto w-full border border-line-strong transition-opacity group-hover:opacity-90"
        />
      </picture>
      <span className="sr-only"> (open full-size image in a new tab)</span>
      </a>
      <figcaption className="label mt-2">
        Fig. {fig}: {shot.caption}
      </figcaption>
    </figure>
  );
}
