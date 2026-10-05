import type { Layout, LayoutCategory } from "./types";
import rawLayouts from "./layouts-index.json";

interface RawLayout {
  id: string;
  category: LayoutCategory;
  nameZh: string;
  nameEn: string;
  nameVi: string;
  keywords: string[];
}

const FOLDER: Record<LayoutCategory, string> = {
  "social-card": "social-cards",
  infographic: "infographics",
  "comic-storyboard": "comic-storyboards",
  "ip-character": "ip-characters",
  ecommerce: "ecommerce",
};

const prompts = new Map<string, { promptZh: string; promptEn: string }>();
let promptsReady: Promise<void> | null = null;

/** Layout prompt text is a separate chunk. Names and thumbnails stay in the index. */
export function loadLayoutPrompts(): Promise<void> {
  if (!promptsReady) {
    promptsReady = import("./layouts.json").then((mod) => {
      const rows = mod.default as { id: string; promptZh: string; promptEn: string }[];
      for (const row of rows) prompts.set(row.id, { promptZh: row.promptZh, promptEn: row.promptEn });
    });
  }
  return promptsReady;
}

export const LAYOUT_GROUPS: { id: LayoutCategory | "all"; labelVi: string; labelEn: string }[] = [
  { id: "all", labelVi: "Tất cả", labelEn: "All" },
  { id: "social-card", labelVi: "Thẻ mạng xã hội", labelEn: "Social cards" },
  { id: "infographic", labelVi: "Infographic", labelEn: "Infographics" },
  { id: "comic-storyboard", labelVi: "Phân cảnh", labelEn: "Storyboards" },
  { id: "ip-character", labelVi: "Thiết kế IP", labelEn: "IP design" },
  { id: "ecommerce", labelVi: "Thương mại", labelEn: "Commerce" },
];

export function layoutPreviewUrl(id: string, category: LayoutCategory): string {
  return `https://cdn.jsdelivr.net/gh/yang0/handraw-style@master/images/layouts/${FOLDER[category]}/${id}.webp`;
}

export function normalizeLayoutId(raw: string): string | null {
  const match = raw.trim().match(/^(SC|IG|SB|IP|EC)[-\s]?(\d{1,3})$/i);
  if (!match) return null;
  return `${match[1].toUpperCase()}-${match[2].padStart(3, "0")}`;
}

export const LAYOUTS: Layout[] = (rawLayouts as RawLayout[]).map((item) => ({
  ...item,
  promptZh: "",
  promptEn: "",
  previewUrl: layoutPreviewUrl(item.id, item.category),
}));

export const LAYOUT_BY_ID: Record<string, Layout> = Object.fromEntries(LAYOUTS.map((l) => [l.id, l]));

export function getLayout(id: string | null | undefined): Layout | undefined {
  if (!id) return undefined;
  const base = LAYOUT_BY_ID[id];
  if (!base) return undefined;
  const text = prompts.get(id);
  return text ? { ...base, ...text } : base;
}

export function filterLayouts(opts: { query: string; category: LayoutCategory | "all" }): Layout[] {
  const q = opts.query.trim().toLowerCase();
  const exact = normalizeLayoutId(opts.query);
  return LAYOUTS.filter((l) => {
    if (opts.category !== "all" && l.category !== opts.category) return false;
    if (!q) return true;
    if (exact && l.id === exact) return true;
    return (
      l.id.toLowerCase().includes(q) ||
      l.nameVi.toLowerCase().includes(q) ||
      l.nameEn.toLowerCase().includes(q) ||
      l.nameZh.includes(opts.query.trim()) ||
      l.keywords.some((k) => k.toLowerCase().includes(q))
    );
  });
}
