import type { ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";
import { Check, ChevronDown, Heart, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { filterStyles, GROUPS, getStyle, normalizeStyleId } from "@/lib/studio/catalog";
import { t } from "@/lib/studio/i18n";
import { useStudio } from "@/lib/studio/store";
import type { Style } from "@/lib/studio/types";
import { cn } from "@/lib/utils";
import { StyleDetail } from "./style-detail";
import { VirtualGrid } from "./virtual-grid";

export function StyleGrid({ compact = false }: { compact?: boolean }) {
  const lang = useStudio((s) => s.lang);
  const search = useStudio((s) => s.search);
  const setSearch = useStudio((s) => s.setSearch);
  const groupFilter = useStudio((s) => s.groupFilter);
  const setGroupFilter = useStudio((s) => s.setGroupFilter);
  const onlyFavorites = useStudio((s) => s.onlyFavorites);
  const setOnlyFavorites = useStudio((s) => s.setOnlyFavorites);
  const selected = useStudio((s) => s.selected);
  const toggleStyle = useStudio((s) => s.toggleStyle);
  const setSelected = useStudio((s) => s.setSelected);
  const clearSelected = useStudio((s) => s.clearSelected);
  const favorites = useStudio((s) => s.styleFavorites);
  const toggleFav = useStudio((s) => s.toggleStyleFavorite);
  const copy = t(lang);
  const [detail, setDetail] = useState<string | null>(null);
  const [groupOpen, setGroupOpen] = useState(false);

  const styles = useMemo(
    () => filterStyles({ query: search, group: groupFilter, favorites, onlyFavorites }),
    [search, groupFilter, favorites, onlyFavorites],
  );
  const exactId = normalizeStyleId(search);
  const scrollTo = exactId ? styles.findIndex((style) => style.number === exactId) : -1;

  useEffect(() => {
    if (!exactId || !getStyle(exactId)) return;
    if (groupFilter !== "all") setGroupFilter("all");
    if (onlyFavorites) setOnlyFavorites(false);
  }, [exactId, groupFilter, onlyFavorites, setGroupFilter, setOnlyFavorites]);

  const visibleNumbers = styles.map((s) => s.number);
  const allVisibleSelected =
    visibleNumbers.length > 0 && visibleNumbers.every((n) => selected.includes(n));

  return (
    <section className="flex min-h-0 flex-1 flex-col bg-bg">
      <div className="flex items-center gap-1.5 border-b border-line px-3 py-2 sm:px-4">
        <Popover open={groupOpen} onOpenChange={setGroupOpen}>
          <PopoverTrigger asChild>
            <button
              type="button"
              className="inline-flex h-10 max-w-[42%] shrink-0 items-center gap-1 rounded-full bg-surface px-3 text-xs font-medium shadow-[var(--shadow-border)]"
            >
              <span className="truncate">
                {onlyFavorites
                  ? copy.favorites
                  : groupFilter === "all"
                    ? copy.allGroups
                    : lang === "vi"
                      ? GROUPS.find((g) => g.id === groupFilter)?.labelVi
                      : GROUPS.find((g) => g.id === groupFilter)?.labelEn}
              </span>
              <ChevronDown className="size-3.5 shrink-0 text-ink-subtle" />
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-64 p-1" align="start">
            <GroupChip
              active={groupFilter === "all" && !onlyFavorites}
              onClick={() => {
                setGroupFilter("all");
                setOnlyFavorites(false);
                setGroupOpen(false);
              }}
            >
              {copy.allGroups}
            </GroupChip>
            {GROUPS.map((g) => (
              <GroupChip
                key={g.id}
                active={groupFilter === g.id && !onlyFavorites}
                onClick={() => {
                  setGroupFilter(g.id);
                  setOnlyFavorites(false);
                  setGroupOpen(false);
                }}
              >
                <span className="font-mono text-[10px] text-ink-subtle">{g.id}</span>
                {lang === "vi" ? g.labelVi : g.labelEn}
                <span className="ml-auto tabular-nums text-ink-subtle">{g.count}</span>
              </GroupChip>
            ))}
            <GroupChip
              active={onlyFavorites}
              onClick={() => {
                setOnlyFavorites(!onlyFavorites);
                setGroupFilter("all");
                setGroupOpen(false);
              }}
            >
              {copy.favorites}
            </GroupChip>
          </PopoverContent>
        </Popover>
        <div className="relative min-w-0 flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-ink-subtle" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={copy.searchStyles}
            className="h-10 pl-9 text-base lg:text-sm"
          />
        </div>
        {!allVisibleSelected ? (
          <button
            type="button"
            className="hidden h-10 shrink-0 rounded-full px-2.5 text-xs text-ink-muted hover:bg-stamp-soft hover:text-ink sm:inline"
            onClick={() => setSelected([...new Set([...selected, ...visibleNumbers])])}
          >
            {copy.selectAllVisible}
          </button>
        ) : null}
        {selected.length > 0 ? (
          <button
            type="button"
            className="inline-flex h-10 shrink-0 items-center gap-1 rounded-full bg-stamp px-2.5 text-xs font-medium text-stamp-fg tabular-nums"
            onClick={clearSelected}
          >
            {selected.length}
            <span className="hidden sm:inline">{copy.clear}</span>
          </button>
        ) : null}
      </div>
      {styles.length === 0 ? (
        <p className="p-8 text-sm text-ink-muted">{copy.noResults}</p>
      ) : (
        <VirtualGrid
          count={styles.length}
          minColWidth={148}
          maxCols={4}
          scrollToIndex={scrollTo >= 0 ? scrollTo : null}
          rowHeight={(width) => width + 68}
          render={(index) => {
            const style = styles[index];
            return (
              <StyleCard
                style={style}
                selected={selected.includes(style.number)}
                favored={favorites.includes(style.number)}
                onToggle={() => toggleStyle(style.number)}
                onFav={() => toggleFav(style.number)}
                onDetail={() => setDetail(style.number)}
              />
            );
          }}
        />
      )}
      <StyleDetail
        style={detail ? getStyle(detail) : undefined}
        open={Boolean(detail)}
        onOpenChange={(o) => !o && setDetail(null)}
        onUse={(n) => {
          if (!selected.includes(n)) toggleStyle(n);
          setDetail(null);
        }}
      />
    </section>
  );
}

function GroupChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex h-10 w-full items-center gap-2 rounded-md px-2 text-left text-sm",
        active ? "bg-ink text-bg [&_span]:text-bg/70" : "text-ink hover:bg-stamp-soft",
      )}
    >
      {children}
    </button>
  );
}

function StyleCard({
  style,
  selected,
  favored,
  onToggle,
  onFav,
  onDetail,
}: {
  style: Style;
  selected: boolean;
  favored: boolean;
  onToggle: () => void;
  onFav: () => void;
  onDetail: () => void;
}) {
  return (
    <div
      className={cn(
        "group relative flex h-full flex-col rounded-xl bg-surface p-1 shadow-[var(--shadow-border)]",
        selected && "ring-2 ring-stamp ring-offset-2 ring-offset-bg",
      )}
    >
      <button type="button" onClick={onToggle} className="relative min-h-0 flex-1 overflow-hidden rounded-lg bg-bg-elevated text-left outline-none">
        <img
          src={style.previewUrl}
          alt={`#${style.number} ${style.generationName}`}
          loading="lazy"
          decoding="async"
          className="img-outline size-full object-cover"
        />
        <span
          className={cn(
            "absolute top-1.5 left-1.5 rounded-sm px-1.5 py-0.5 font-mono text-xs tabular-nums",
            selected ? "bg-stamp text-stamp-fg" : "bg-ink/80 text-bg-elevated",
          )}
        >
          {style.number}
        </span>
        {selected ? (
          <span className="absolute right-1.5 bottom-1.5 flex size-6 items-center justify-center rounded-full bg-stamp text-stamp-fg">
            <Check className="size-3.5" />
          </span>
        ) : null}
      </button>
      <button type="button" onClick={onDetail} className="shrink-0 px-2 pt-2 pb-1.5 text-left outline-none">
        <p className="line-clamp-2 min-h-8 text-xs leading-snug font-medium">{style.generationName}</p>
        <p className="mt-0.5 truncate text-xs text-ink-subtle">{style.reference}</p>
      </button>
      <div className="absolute top-2.5 right-2.5 flex gap-1">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onFav();
          }}
          className={cn(
            "flex size-8 items-center justify-center rounded-md bg-surface/90 text-ink-muted shadow-[var(--shadow-border)] hover:text-stamp",
            favored ? "opacity-100" : "opacity-100 lg:opacity-0 lg:group-hover:opacity-100",
          )}
          aria-label="Favorite"
        >
          <Heart className={cn("size-3.5", favored && "fill-stamp text-stamp")} />
        </button>
      </div>
    </div>
  );
}
