import { useEffect, useState } from "react";
import { Group as PanelGroup, Panel, Separator as PanelSeparator } from "react-resizable-panels";
import { ComposePanel } from "@/components/studio/compose-panel";
import { JobDock } from "@/components/studio/job-dock";
import { LayoutGrid } from "@/components/studio/layout-grid";
import { LiveCanvas } from "@/components/studio/live-canvas";
import { StyleGrid } from "@/components/studio/style-grid";
import { t } from "@/lib/studio/i18n";
import { useStudio } from "@/lib/studio/store";
import { cn } from "@/lib/utils";

function useDesktopLayout() {
  const [desktop, setDesktop] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const apply = () => setDesktop(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);
  return desktop;
}

export function StudioWorkspace() {
  const lang = useStudio((s) => s.lang);
  const copy = t(lang);
  const tab = useStudio((s) => s.studioTab);
  const setTab = useStudio((s) => s.setStudioTab);
  const selected = useStudio((s) => s.selected.length);
  const layoutOn = useStudio((s) => Boolean(s.layoutId));
  const live = useStudio(
    (s) => s.jobs.filter((j) => j.status === "queued" || j.status === "running").length,
  );
  const hasJobs = useStudio((s) => s.jobs.length > 0);
  const desktop = useDesktopLayout();
  const leftKind = tab === "layouts" ? "layouts" : "styles";

  const libraryTabs = (
    <div className="flex shrink-0 gap-1 px-3 pt-2 sm:px-5">
      {(
        [
          ["styles", copy.styles, selected],
          ["layouts", copy.layouts, layoutOn ? 1 : 0],
        ] as const
      ).map(([id, label, count]) => (
        <button
          key={id}
          type="button"
          onClick={() => setTab(id)}
          className={cn(
            "h-9 rounded-full px-3 text-sm font-medium",
            leftKind === id ? "bg-ink text-bg" : "bg-bg-elevated text-ink-muted hover:text-ink",
          )}
        >
          {label}
          {count > 0 ? <span className="ml-1 font-mono text-xs tabular-nums">{count}</span> : null}
        </button>
      ))}
    </div>
  );

  const tabs = (
    <div className="flex shrink-0 px-3 pt-2 pb-1">
      <div className="flex w-full rounded-full bg-bg-elevated p-1 shadow-[var(--shadow-border)]">
        {(
          [
            ["styles", copy.styles, selected],
            ["layouts", copy.layouts, layoutOn ? 1 : 0],
            ["results", copy.results, live],
          ] as const
        ).map(([id, label, count]) => (
          <button
            key={id}
            type="button"
            onClick={() => setTab(id)}
            className={cn(
              "relative h-10 flex-1 rounded-full text-sm font-medium transition-colors duration-150",
              tab === id ? "bg-surface text-ink shadow-[var(--shadow-border)]" : "text-ink-muted",
            )}
          >
            {label}
            {count > 0 ? (
              <span className="ml-1 font-mono text-xs text-stamp tabular-nums">{count}</span>
            ) : null}
          </button>
        ))}
      </div>
    </div>
  );

  if (desktop) {
    return (
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
        <ComposePanel />
        <div className="flex min-h-0 flex-1 overflow-hidden">
          <PanelGroup orientation="horizontal" className="h-full w-full" id="handraw-studio">
            <Panel id="styles" defaultSize="42%" minSize="28%" className="flex min-h-0 flex-col">
              {libraryTabs}
              {leftKind === "layouts" ? <LayoutGrid compact={false} /> : <StyleGrid compact={false} />}
            </Panel>
            <PanelSeparator className="relative w-3 bg-transparent outline-none">
              <span className="pointer-events-none absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-line" />
            </PanelSeparator>
            <Panel id="results" defaultSize="58%" minSize="32%" className="flex min-h-0 flex-col">
              <LiveCanvas />
            </Panel>
          </PanelGroup>
        </div>
        {hasJobs ? <JobDock /> : null}
      </div>
    );
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      {tabs}
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
        {tab === "layouts" ? <LayoutGrid compact /> : tab === "styles" ? <StyleGrid compact /> : <LiveCanvas />}
      </div>
      {hasJobs ? <JobDock /> : null}
      <ComposePanel />
    </div>
  );
}
