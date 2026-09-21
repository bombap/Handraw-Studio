import type { ReactNode } from "react";
import { useMemo, useState } from "react";
import { Check, Heart, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { filterStyles, GROUPS, getStyle, STYLES } from "@/lib/studio/catalog";
import { t } from "@/lib/studio/i18n";
import { useStudio } from "@/lib/studio/store";
import type { Style } from "@/lib/studio/types";
import { cn } from "@/lib/utils";
import { StyleDetail } from "./style-detail";

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

  const styles = useMemo(
    () => filterStyles({ query: search, group: groupFilter, favorites, onlyFavorites }),
    [search, groupFilter, favorites, onlyFavorites],
  );

  const visibleNumbers = styles.map((s) => s.number);
  const allVisibleSelected =
    visibleNumbers.length > 0 && visibleNumbers.every((n) => selected.includes(n));

  return (
    <section className="flex min-h-0 flex-1 flex-col bg-bg">
      <div className={cn("flex flex-col border-b border-line px-3 sm:px-5", compact ? "gap-2 py-2" : "gap-3 py-3 sm:py-4")}>
        {compact ? null : (
          <div className="flex items-end justify-between gap-3">
            <div>
              <h2 className="font-display text-xl leading-tight font-medium tracking-tight">
                {copy.styles}
              </h2>
              <p className="mt-0.5 text-xs text-ink-subtle tabular-nums">
                {styles.length}
                {copy.of}
                {STYLES.length} · {selected.length} {copy.selected}
              </p>
            </div>
            <div className="flex gap-1">
              <button
                type="button"
                className="h-9 rounded-full px-3 text-xs text-ink-muted hover:bg-stamp-soft hover:text-ink"
                onClick={() => {
                  if (allVisibleSelected) {
                    setSelected(selected.filter((n) => !visibleNumbers.includes(n)));
                  } else {
                    setSelected([...new Set([...selected, ...visibleNumbers])]);
                  }
                }}
              >
                {copy.selectAllVisible}
              </button>
              {selected.length > 0 ? (
                <button
                  type="button"
                  className="h-9 rounded-full px-3 text-xs text-ink-muted hover:bg-stamp-soft hover:text-ink"
                  onClick={clearSelected}
                >
                  {copy.clear}
                </button>
              ) : null}
            </div>
          </div>
        )}
        <div className="relative">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-ink-subtle" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={copy.searchStyles}
            className={cn("pl-9 text-base lg:text-sm", compact && "h-10")}
          />
        </div>
        <div className="chip-scroll -mx-1 flex gap-1.5 overflow-x-auto px-1 pb-0.5">
          <GroupChip
            active={groupFilter === "all" && !onlyFavorites}
            onClick={() => {
              setGroupFilter("all");
              setOnlyFavorites(false);
            }}
          >
            {copy.allGroups}
          </GroupChip>
          {GROUPS.map((g) => (
            <GroupChip
              key={g.id}
              active={groupFilter === g.id}
              title={lang === "vi" ? g.labelVi : g.labelEn}
              onClick={() => {
                setGroupFilter(g.id);
                setOnlyFavorites(false);
              }}
            >
              {g.id}
            </GroupChip>
          ))}
          <GroupChip
            active={onlyFavorites}
            onClick={() => {
              setOnlyFavorites(!onlyFavorites);
              setGroupFilter("all");
            }}
          >
            {copy.favorites}
          </GroupChip>
        </div>
      </div>
      <ScrollArea className="min-h-0 flex-1">
        {styles.length === 0 ? (
          <p className="p-8 text-sm text-ink-muted">{copy.noResults}</p>
        ) : (
          <div className="grid grid-cols-2 gap-3 p-4 sm:grid-cols-3 sm:p-5 xl:grid-cols-3 2xl:grid-cols-4">
            {styles.map((style) => (
              <StyleCard
                key={style.number}
                style={style}
                selected={selected.includes(style.number)}
                favored={favorites.includes(style.number)}
                onToggle={() => toggleStyle(style.number)}
                onFav={() => toggleFav(style.number)}
                onDetail={() => setDetail(style.number)}
              />
            ))}
          </div>
        )}
      </ScrollArea>
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
  title,
  children,
}: {
  active: boolean;
  onClick: () => void;
  title?: string;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className={cn(
        "h-9 shrink-0 rounded-full px-3 text-xs font-medium whitespace-nowrap",
        active ? "bg-ink text-bg" : "bg-bg-elevated text-ink-muted hover:text-ink",
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
        "group relative rounded-xl bg-surface p-1 shadow-[var(--shadow-border)] transition-[box-shadow,transform] duration-150 ease-out",
        "hover:-translate-y-0.5 hover:shadow-[var(--shadow-border-hover)]",
        selected && "ring-2 ring-stamp ring-offset-2 ring-offset-bg",
      )}
    >
      <button type="button" onClick={onToggle} className="block w-full text-left">
        <div className="relative aspect-square overflow-hidden rounded-lg bg-bg-elevated">
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
        </div>
        <div className="px-2 pt-2 pb-1.5">
          <p className="line-clamp-2 min-h-8 text-xs leading-snug font-medium">
            {style.generationName}
          </p>
          <p className="mt-0.5 truncate text-xs text-ink-subtle">{style.reference}</p>
        </div>
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
      <button
        type="button"
        onClick={onDetail}
        className={cn(
          "absolute right-2.5 bottom-10 h-7 items-center rounded-full bg-ink px-2.5 text-xs text-bg",
          selected ? "hidden" : "hidden group-hover:inline-flex",
        )}
      >
        {style.groupId}
      </button>
    </div>
  );
}
