import { useMemo, useState } from "react";
import { Check, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { filterLayouts, LAYOUT_GROUPS, LAYOUTS } from "@/lib/studio/layout-catalog";
import { t } from "@/lib/studio/i18n";
import { useStudio } from "@/lib/studio/store";
import type { Layout, LayoutCategory } from "@/lib/studio/types";
import { cn } from "@/lib/utils";

export function LayoutGrid({ compact = false }: { compact?: boolean }) {
  const lang = useStudio((s) => s.lang);
  const copy = t(lang);
  const layoutId = useStudio((s) => s.layoutId);
  const setLayoutId = useStudio((s) => s.setLayoutId);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<LayoutCategory | "all">("all");

  const layouts = useMemo(() => filterLayouts({ query, category }), [query, category]);

  return (
    <section className="flex min-h-0 flex-1 flex-col bg-bg">
      <div className={cn("flex flex-col border-b border-line px-3 sm:px-5", compact ? "gap-2 py-2" : "gap-3 py-3 sm:py-4")}>
        {compact ? null : (
          <div className="flex items-end justify-between gap-3">
            <div>
              <h2 className="font-display text-xl leading-tight font-medium tracking-tight">{copy.layouts}</h2>
              <p className="mt-0.5 text-xs text-ink-subtle tabular-nums">
                {layouts.length}
                {copy.of}
                {LAYOUTS.length}
                {layoutId ? ` · ${copy.layoutOn}` : ` · ${copy.layoutOff}`}
              </p>
            </div>
            {layoutId ? (
              <button
                type="button"
                className="h-9 rounded-full px-3 text-xs text-ink-muted hover:bg-stamp-soft hover:text-ink"
                onClick={() => setLayoutId(null)}
              >
                {copy.layoutClear}
              </button>
            ) : null}
          </div>
        )}
        <div className="relative">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-ink-subtle" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={copy.searchLayouts}
            className={cn("pl-9 text-base lg:text-sm", compact && "h-10")}
          />
        </div>
        <div className="chip-scroll -mx-1 flex gap-1.5 overflow-x-auto px-1 pb-0.5">
          {LAYOUT_GROUPS.map((g) => (
            <button
              key={g.id}
              type="button"
              onClick={() => setCategory(g.id)}
              className={cn(
                "h-9 shrink-0 rounded-full px-3 text-xs font-medium whitespace-nowrap",
                category === g.id ? "bg-ink text-bg" : "bg-bg-elevated text-ink-muted hover:text-ink",
              )}
            >
              {lang === "vi" ? g.labelVi : g.labelEn}
            </button>
          ))}
        </div>
      </div>
      <ScrollArea className="min-h-0 flex-1">
        {layouts.length === 0 ? (
          <p className="p-8 text-sm text-ink-muted">{copy.noLayouts}</p>
        ) : (
          <div className="grid grid-cols-2 gap-3 p-4 sm:grid-cols-3 sm:p-5 xl:grid-cols-3">
            {layouts.map((layout) => (
              <LayoutCard
                key={layout.id}
                layout={layout}
                selected={layoutId === layout.id}
                name={lang === "vi" ? layout.nameVi : layout.nameEn}
                onToggle={() => setLayoutId(layoutId === layout.id ? null : layout.id)}
              />
            ))}
          </div>
        )}
      </ScrollArea>
    </section>
  );
}

function LayoutCard({
  layout,
  selected,
  name,
  onToggle,
}: {
  layout: Layout;
  selected: boolean;
  name: string;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={cn(
        "group relative rounded-xl bg-surface p-1 text-left shadow-[var(--shadow-border)] transition-[box-shadow,transform] duration-150 ease-out",
        "hover:-translate-y-0.5 hover:shadow-[var(--shadow-border-hover)]",
        selected && "ring-2 ring-stamp ring-offset-2 ring-offset-bg",
      )}
    >
      <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-bg-elevated">
        <img
          src={layout.previewUrl}
          alt={`${layout.id} ${name}`}
          loading="lazy"
          decoding="async"
          className="img-outline size-full object-cover object-top"
        />
        <span
          className={cn(
            "absolute top-1.5 left-1.5 rounded-sm px-1.5 py-0.5 font-mono text-[10px] tabular-nums",
            selected ? "bg-stamp text-stamp-fg" : "bg-ink/80 text-bg-elevated",
          )}
        >
          {layout.id}
        </span>
        {selected ? (
          <span className="absolute top-1.5 right-1.5 flex size-6 items-center justify-center rounded-full bg-stamp text-stamp-fg">
            <Check className="size-3.5" />
          </span>
        ) : null}
      </div>
      <p className="mt-1.5 line-clamp-2 px-1 pb-1 text-xs leading-snug text-ink">{name}</p>
    </button>
  );
}