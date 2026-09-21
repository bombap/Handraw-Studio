import type { Layout, LayoutCategory } from "./types";
import rawLayouts from "./layouts.json";

interface RawLayout {
  id: string;
  category: LayoutCategory;
  nameZh: string;
  nameEn: string;
  nameVi: string;
  keywords: string[];
  promptZh: string;
  promptEn: string;
}

const FOLDER: Record<LayoutCategory, string> = {
  "social-card": "social-cards",
  infographic: "infographics",
  "comic-storyboard": "comic-storyboards",
};

export const LAYOUT_GROUPS: { id: LayoutCategory | "all"; labelVi: string; labelEn: string }[] = [
  { id: "all", labelVi: "Tất cả", labelEn: "All" },
  { id: "social-card", labelVi: "Thẻ mạng xã hội", labelEn: "Social cards" },
  { id: "infographic", labelVi: "Infographic", labelEn: "Infographics" },
  { id: "comic-storyboard", labelVi: "Phân cảnh", labelEn: "Storyboards" },
];

export function layoutPreviewUrl(id: string, category: LayoutCategory): string {
  return `https://cdn.jsdelivr.net/gh/yang0/handraw-style@master/images/layouts/${FOLDER[category]}/${id}.webp`;
}

export const LAYOUTS: Layout[] = (rawLayouts as RawLayout[]).map((item) => ({
  ...item,
  previewUrl: layoutPreviewUrl(item.id, item.category),
}));

export const LAYOUT_BY_ID: Record<string, Layout> = Object.fromEntries(LAYOUTS.map((l) => [l.id, l]));

export function getLayout(id: string | null | undefined): Layout | undefined {
  if (!id) return undefined;
  return LAYOUT_BY_ID[id];
}

export function filterLayouts(opts: { query: string; category: LayoutCategory | "all" }): Layout[] {
  const q = opts.query.trim().toLowerCase();
  return LAYOUTS.filter((l) => {
    if (opts.category !== "all" && l.category !== opts.category) return false;
    if (!q) return true;
    return (
      l.id.toLowerCase().includes(q) ||
      l.nameVi.toLowerCase().includes(q) ||
      l.nameEn.toLowerCase().includes(q) ||
      l.nameZh.includes(opts.query.trim()) ||
      l.keywords.some((k) => k.toLowerCase().includes(q))
    );
  });
}