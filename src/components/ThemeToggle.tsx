/**
 * Blueprint / Paper switch. Blueprint is the default (set on <html> in
 * index.html); a saved "light" choice is applied before first paint.
 * This only flips and persists the choice.
 * Labels are swapped with CSS so server and client markup match.
 */
export function ThemeToggle() {
  const toggle = () => {
    const root = document.documentElement;
    const current = root.dataset.theme === "light" ? "light" : "dark";
    const next = current === "dark" ? "light" : "dark";
    root.dataset.theme = next;
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute("content", next === "dark" ? "#0c2638" : "#f6f4ee");
    try {
      localStorage.setItem("theme", next);
    } catch {
      /* storage unavailable: theme still applies for this visit */
    }
  };
  return (
    <button type="button" onClick={toggle} className="btn btn-ghost min-h-10 px-3">
      <span className="theme-icon-dark">
        <BlueprintIcon />
        <span className="sr-only">Switch to </span><span className="sr-only sm:not-sr-only">Blueprint</span>
        <span className="sr-only"> (dark) theme</span>
      </span>
      <span className="theme-icon-light">
        <PaperIcon />
        <span className="sr-only">Switch to </span><span className="sr-only sm:not-sr-only">Paper</span>
        <span className="sr-only"> (light) theme</span>
      </span>
    </button>
  );
}

function BlueprintIcon() {
  return (
    <svg aria-hidden="true" width="14" height="14" viewBox="0 0 14 14" className="inline-block sm:mr-1.5 align-[-2px]">
      <rect x="0.5" y="0.5" width="13" height="13" fill="currentColor" />
      <path d="M3 3.5h8M3 7h8M3 10.5h5" stroke="var(--paper)" strokeWidth="1" />
    </svg>
  );
}
function PaperIcon() {
  return (
    <svg aria-hidden="true" width="14" height="14" viewBox="0 0 14 14" className="inline-block sm:mr-1.5 align-[-2px]">
      <rect x="0.5" y="0.5" width="13" height="13" fill="none" stroke="currentColor" />
      <path d="M3 3.5h8M3 7h8M3 10.5h5" stroke="currentColor" strokeWidth="1" />
    </svg>
  );
}
