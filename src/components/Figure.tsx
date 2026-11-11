import type { Screenshot } from "../data/content";

/** A project screenshot, or a hatched "to be supplied" placeholder. */
export function Figure({ shot, fig }: { shot: Screenshot; fig: string }) {
  if (shot.kind === "pending") {
    return (
      <figure>
        <div className="hatch flex aspect-[16/10] w-full items-center justify-center border border-line-strong p-4">
          <div className="max-w-[28ch] border border-line-strong bg-paper px-4 py-3 text-center">
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
    <figure>
      <picture>
        {shot.avif ? <source srcSet={shot.avif} type="image/avif" /> : null}
        <img
          src={shot.webp}
          width={shot.width}
          height={shot.height}
          alt={shot.alt}
          loading="lazy"
          decoding="async"
          className="h-auto w-full border border-line-strong"
        />
      </picture>
      <figcaption className="label mt-2">
        Fig. {fig}: {shot.caption}
      </figcaption>
    </figure>
  );
}
