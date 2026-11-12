import { caseStudies, sheets } from "./data/content";
import { Background } from "./components/Background";
import { CaseStudy } from "./components/CaseStudy";
import { ChannelDiagram } from "./components/ChannelDiagram";
import { Contact } from "./components/Contact";
import { Experience } from "./components/Experience";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { SendCheck } from "./components/SendCheck";
import { PlotTape } from "./components/PlotTape";
import { Skills } from "./components/Skills";
import { StorefrontEditor } from "./components/StorefrontEditor";
import { WorkSchedule } from "./components/WorkSchedule";
import { useEffect } from "react";
import { startReveal } from "./reveal";

declare const __BUILD_YEAR__: number;

export function App() {
  // Start scroll-in motion after React has rendered (dev) or hydrated (prod).
  useEffect(() => startReveal(), []);
  // Number keys jump between sheets (1 = first sheet), unless the visitor is typing.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey || e.defaultPrevented) return;
      const t = e.target as HTMLElement | null;
      if (t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName))) return;
      const sheet = sheets[Number(e.key) - 1];
      if (!/^[1-9]$/.test(e.key) || !sheet) return;
      document.getElementById(sheet.id)?.scrollIntoView();
      history.replaceState(null, "", sheet.id === "top" ? location.pathname : `#${sheet.id}`);
      const cap = document.querySelector<HTMLElement>(`kbd[data-key="${e.key}"]`);
      if (cap) {
        cap.dataset.pressed = "";
        window.setTimeout(() => delete cap.dataset.pressed, 220);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
  const [vtu, pmc] = caseStudies;
  return (
    <>
      <a
        href="#main"
        className="sr-only z-[100] bg-ink px-4 py-2 font-mono text-sm text-paper focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Skip to content
      </a>
      <Header />
      <main id="main" className="flex flex-col gap-6 px-4 py-6 sm:gap-10 sm:px-6 sm:py-10">
        <Hero />
        <PlotTape />
        <CaseStudy study={vtu} fig="2.1" detail={<StorefrontEditor />} />
        <CaseStudy
          study={pmc}
          fig="3.2"
          detail={
            <>
              <ChannelDiagram />
              <SendCheck />
            </>
          }
        />
        <WorkSchedule />
        <Experience />
        <Skills />
        <Background />
      </main>
      <div className="px-4 pb-6 sm:px-6 sm:pb-10">
        <Contact year={__BUILD_YEAR__} />
      </div>
    </>
  );
}
