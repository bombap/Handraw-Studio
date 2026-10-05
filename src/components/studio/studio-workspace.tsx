import { ComposePanel } from "@/components/studio/compose-panel";
import { JobDock } from "@/components/studio/job-dock";
import { LiveCanvas } from "@/components/studio/live-canvas";
import { StyleGrid } from "@/components/studio/style-grid";
import { t } from "@/lib/studio/i18n";
import { useStudio } from "@/lib/studio/store";
import { cn } from "@/lib/utils";
import { Group as PanelGroup, Panel, Separator as PanelSeparator } from "react-resizable-panels";

export function StudioWorkspace() {
  const lang = useStudio((s) => s.lang);
  const copy = t(lang);
  const tab = useStudio((s) => s.studioTab);
  const setTab = useStudio((s) => s.setStudioTab);
  const selected = useStudio((s) => s.selected.length);
  const live = useStudio(
    (s) => s.jobs.filter((j) => j.status === "queued" || j.status === "running").length,
  );
  const hasJobs = useStudio((s) => s.jobs.length > 0);

  const tabs = (
    <div className="flex shrink-0 px-3 pt-2 pb-1 lg:hidden">
      <div className="flex w-full rounded-full bg-bg-elevated p-1 shadow-[var(--shadow-border)]">
        {(
          [
            ["styles", copy.styles, selected],
            ["results", copy.results, live],
          ] as const
        ).map(([id, label, count]) => (
          <button
            key={id}
            type="button"
            onClick={() => setTab(id)}
            className={cn(
              "relative h-10 flex-1 rounded-full text-sm font-medium",
              tab === id || (id === "styles" && tab === "layouts")
                ? "bg-surface text-ink shadow-[var(--shadow-border)]"
                : "text-ink-muted",
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

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <div className="hidden min-h-0 flex-1 overflow-hidden lg:flex">
        <PanelGroup orientation="horizontal" className="h-full w-full" id="handraw-studio">
          <Panel id="styles" defaultSize="42%" minSize="28%" className="flex min-h-0 flex-col">
            <StyleGrid />
          </Panel>
          <PanelSeparator className="relative w-3 bg-transparent outline-none">
            <span className="pointer-events-none absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-line" />
          </PanelSeparator>
          <Panel id="results" defaultSize="58%" minSize="34%" className="flex min-h-0 flex-col">
            <LiveCanvas />
            <ComposePanel />
          </Panel>
        </PanelGroup>
      </div>

      <div className="flex min-h-0 flex-1 flex-col overflow-hidden lg:hidden">
        {hasJobs ? <JobDock /> : null}
        {tabs}
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
          {tab === "results" ? <LiveCanvas /> : <StyleGrid compact />}
        </div>
        <ComposePanel />
      </div>

      {hasJobs ? (
        <div className="hidden lg:block">
          <JobDock />
        </div>
      ) : null}
    </div>
  );
}
