import type { ReactNode } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { Images, Languages, LayoutGrid } from "lucide-react";
import { JobRunner } from "@/components/studio/job-runner";
import { cn } from "@/lib/utils";
import { t } from "@/lib/studio/i18n";
import { useStudio } from "@/lib/studio/store";

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const lang = useStudio((s) => s.lang);
  const setLang = useStudio((s) => s.setLang);
  const live = useStudio(
    (s) => s.jobs.filter((j) => j.status === "queued" || j.status === "running").length,
  );
  const copy = t(lang);

  return (
    <div className="paper-grain flex h-dvh flex-col overflow-hidden">
      <JobRunner />
      <header className="z-40 shrink-0 border-b border-line bg-bg/90 backdrop-blur-md">
        <div className="flex h-14 items-center gap-2 px-3 sm:h-16 sm:gap-3 sm:px-5">
          <Link to="/" className="flex min-w-0 items-center gap-2 sm:gap-2.5">
            <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-stamp text-stamp-fg sm:size-8">
              <span className="font-display text-sm leading-none font-semibold sm:text-base">H</span>
            </span>
            <span className="flex min-w-0 items-baseline gap-2">
              <span className="font-display text-lg leading-none font-semibold tracking-tight sm:text-xl">
                Handraw
              </span>
              <span className="hidden text-[0.65rem] tracking-[0.22em] text-ink-subtle uppercase sm:inline">
                Studio
              </span>
            </span>
          </Link>

          <nav className="ml-auto flex items-center gap-0.5 sm:gap-1">
            <div className="flex rounded-full bg-bg-elevated p-0.5 shadow-[var(--shadow-border)] sm:p-1">
              <Link
                to="/"
                className={cn(
                  "inline-flex size-10 items-center justify-center gap-1.5 rounded-full text-sm font-medium transition-colors duration-150 sm:h-9 sm:w-auto sm:px-3",
                  pathname === "/"
                    ? "bg-surface text-ink shadow-[var(--shadow-border)]"
                    : "text-ink-muted hover:text-ink",
                )}
                aria-label={copy.studio}
              >
                <LayoutGrid className="size-4" />
                <span className="hidden sm:inline">{copy.studio}</span>
              </Link>
              <Link
                to="/gallery"
                className={cn(
                  "inline-flex size-10 items-center justify-center gap-1.5 rounded-full text-sm font-medium transition-colors duration-150 sm:h-9 sm:w-auto sm:px-3",
                  pathname.startsWith("/gallery")
                    ? "bg-surface text-ink shadow-[var(--shadow-border)]"
                    : "text-ink-muted hover:text-ink",
                )}
                aria-label={copy.gallery}
              >
                <Images className="size-4" />
                <span className="hidden sm:inline">{copy.gallery}</span>
              </Link>
            </div>
            <button
              type="button"
              onClick={() => setLang(lang === "vi" ? "en" : "vi")}
              className="inline-flex h-10 items-center gap-1 rounded-full px-2 text-xs font-medium tracking-wide text-ink-muted hover:bg-stamp-soft hover:text-ink sm:h-11 sm:gap-1.5 sm:px-3"
              aria-label="Language"
            >
              <Languages className="size-4" />
              <span className="sm:inline">{copy.lang}</span>
            </button>
            {live > 0 ? (
              <span className="relative ml-0.5 inline-flex h-8 min-w-8 items-center justify-center rounded-full bg-stamp px-2 text-xs font-medium text-stamp-fg tabular-nums">
                <span className="stamp-live absolute top-0 right-0 size-2 rounded-full bg-stamp" />
                {live}
              </span>
            ) : null}
          </nav>
        </div>
      </header>
      <div className="flex min-h-0 w-full flex-1 flex-col overflow-hidden">{children}</div>
    </div>
  );
}
