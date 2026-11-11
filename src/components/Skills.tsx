import { useState } from "react";
import { AppWindow, ArrowUpRight, Server, Smartphone, Wrench, type LucideIcon } from "lucide-react";
import { anchors, skills, type Skill } from "../data/content";
import { reveal } from "../reveal";
import { Icon } from "./Icon";
import { Sheet } from "./Sheet";

const areaIcons: Record<string, LucideIcon> = {
  Frontend: AppWindow,
  Mobile: Smartphone,
  Backend: Server,
  Tools: Wrench,
};

const all = skills.flatMap((g, gi) => g.items.map((s) => ({ ...s, area: g.area, code: `M-${String(gi + 1).padStart(2, "0")}` })));

/**
 * Skills as a material schedule with a cross-reference: pick a material (skill)
 * to see where it was used across projects and roles.
 */
export function Skills() {
  const [selected, setSelected] = useState("Flutter");
  const current = all.find((s) => s.name === selected) ?? all[0];
  const uses = current.usedIn ?? [];

  return (
    <Sheet id="skills" kicker="Material schedule" labelledBy="skills-title">
      <div className="px-4 pb-10 pt-8 sm:px-6 lg:px-10 lg:pb-12 lg:pt-10">
        <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-2">
          <h2 id="skills-title" className="display text-[clamp(2rem,1.5rem+2.4vw,3.25rem)]">
            Skills
          </h2>
          <p className="label max-w-[40ch]">Select a skill to see where I've used it</p>
        </div>

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
                    <li key={s.name}>
                      <SkillTag skill={s} active={s.name === selected} onSelect={() => setSelected(s.name)} />
                    </li>
                  ))}
                </ul>
              </dd>
            </div>
          ))}
        </dl>

        {/* Cross-reference panel */}
        <div
          {...reveal(4)}
          className="sheet-grid mt-6 grid gap-5 border border-dashed border-line-strong p-4 sm:p-5 md:grid-cols-[minmax(0,15rem)_minmax(0,1fr)] md:items-center md:gap-8"
        >
          <div aria-live="polite">
            <p className="label">
              Cross-reference · {current.code} · {current.area}
            </p>
            <p className="display mt-1 text-[clamp(1.6rem,1.2rem+1.6vw,2.4rem)]">{current.name}</p>
            <p className="mt-1 font-mono text-[0.8125rem] text-ink-2">
              Used in {uses.length} {uses.length === 1 ? "place" : "places"}
            </p>
          </div>
          <ul key={current.name} className="flex flex-wrap gap-2">
            {uses.map((u, i) => (
              <li key={u} className="xref-in" style={{ ["--i" as string]: i }}>
                <a
                  href={anchors[u] ?? "#work"}
                  className="group inline-flex items-center gap-2 border border-line-strong bg-paper px-3 py-2 text-[0.9375rem] no-underline transition-colors hover:border-accent hover:text-accent"
                >
                  {u}
                  <span className="font-mono text-[0.6875rem] text-ink-3 group-hover:text-accent">{anchors[u]}</span>
                  <Icon icon={ArrowUpRight} size={13} className="rotate-90 text-ink-3 group-hover:text-accent" />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Sheet>
  );
}

function SkillTag({ skill, active, onSelect }: { skill: Skill; active: boolean; onSelect: () => void }) {
  const count = skill.usedIn?.length ?? 0;
  if (!count) return <span className="tag">{skill.name}</span>;
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={active}
      className={`tag cursor-pointer transition-colors ${
        active ? "border-accent bg-accent text-on-accent" : "hover:border-accent hover:text-ink"
      }`}
    >
      {skill.name}
      <span className={`ml-1.5 font-mono text-[0.6875rem] ${active ? "text-on-accent" : "text-ink-3"}`}>
        ×{count}
        <span className="sr-only"> projects</span>
      </span>
    </button>
  );
}
