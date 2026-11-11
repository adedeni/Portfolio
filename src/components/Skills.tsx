import { skills } from "../data/content";
import { Sheet } from "./Sheet";
import { AppWindow, Server, Smartphone, Wrench, type LucideIcon } from "lucide-react";
import { Icon } from "./Icon";
import { reveal } from "../reveal";

const areaIcons: Record<string, LucideIcon> = {
  Frontend: AppWindow,
  Mobile: Smartphone,
  Backend: Server,
  Tools: Wrench,
};

export function Skills() {
  return (
    <Sheet id="skills" kicker="Material schedule" labelledBy="skills-title">
      <div className="px-4 pb-10 pt-8 sm:px-6 lg:px-10 lg:pb-12 lg:pt-10">
        <h2 id="skills-title" className="display text-[clamp(2rem,1.5rem+2.4vw,3.25rem)]">
          Skills
        </h2>
        <dl className="mt-8 grid border-l border-t border-line-strong sm:grid-cols-2 lg:grid-cols-4">
          {skills.map((g, i) => (
            <div key={g.area} {...reveal(i)} className="border-b border-r border-line-strong p-4 sm:p-5">
              <dt className="flex items-baseline justify-between">
                <span className="flex items-center gap-2 text-[1.125rem] font-semibold [font-stretch:112%]">
                  <Icon icon={areaIcons[g.area] ?? Wrench} size={18} className="text-accent" />
                  {g.area}
                </span>
                <span aria-hidden="true" className="font-mono text-xs text-ink-3">
                  M-{String(i + 1).padStart(2, "0")}
                </span>
              </dt>
              <dd className="mt-3">
                <ul className="flex flex-wrap gap-2">
                  {g.items.map((s) => (
                    <li key={s} className="tag">
                      {s}
                    </li>
                  ))}
                </ul>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </Sheet>
  );
}
