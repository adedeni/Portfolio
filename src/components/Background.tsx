import { education, memberships } from "../data/content";
import { Sheet } from "./Sheet";
import { Award, BadgeCheck, GraduationCap } from "lucide-react";
import { Icon } from "./Icon";
import { reveal } from "../reveal";

export function Background() {
  return (
    <Sheet id="background" kicker="Engineering background" labelledBy="background-title">
      <div className="grid gap-10 px-4 pb-10 pt-8 sm:px-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-12 lg:px-10 lg:pb-12 lg:pt-10">
        <div>
          <h2 id="background-title" className="display text-[clamp(2rem,1.5rem+2.4vw,3.25rem)]">
            From civil engineering to software
          </h2>
          <p className="mt-4 max-w-[52ch] text-ink-2">
            I trained as an engineer before I moved into software. I hold an MSc in Civil Engineering from the University of
            Ibadan, where I was the departmental best graduating student. That's where the drawing-sheet look of this site
            comes from.
          </p>
        </div>
        <div>
          <ol className="border-t border-ink">
            {education.map((e, i) => (
              <li key={e.degree} {...reveal(i)} className="grid gap-x-6 gap-y-1 border-b border-line-strong py-5 sm:grid-cols-[7rem_1fr]">
                <p className="font-mono text-[0.875rem] text-ink-2 sm:pt-0.5">{e.date}</p>
                <div>
                  <h3 className="flex items-center gap-2 text-[1.25rem] font-semibold leading-tight [font-stretch:112%]">
                    <Icon icon={GraduationCap} size={20} className="text-accent" />
                    {e.degree}
                  </h3>
                  <p className="text-ink-2">{e.school}</p>
                  <p className="mt-1 flex items-start gap-2 font-mono text-[0.875rem] text-ink">
                    <Icon icon={Award} size={15} className="mt-0.5" />
                    {e.detail}
                  </p>
                </div>
              </li>
            ))}
          </ol>
          <h3 className="label mt-6 flex items-center gap-2 text-ink">
            <Icon icon={BadgeCheck} size={15} />
            Professional memberships
          </h3>
          <ul className="mt-2 space-y-1 text-ink-2">
            {memberships.map((m) => (
              <li key={m} className="grid grid-cols-[1rem_1fr]">
                <span aria-hidden="true" className="text-ink-3">–</span>
                <span>{m}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Sheet>
  );
}
