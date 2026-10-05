import type { Style, StyleGroup, StyleGroupId } from "./types";
import rawStyles from "./styles.json";

interface RawStyle {
  number: string;
  group: string;
  reference: string;
  generation_name: string;
  traits: string;
}

const GROUP_META: Record<
  StyleGroupId,
  { range: string; labelVi: string; labelEn: string }
> = {
  FA: { range: "001–040", labelVi: "Xã luận / hài", labelEn: "Editorial humor" },
  FB: { range: "001–056", labelVi: "Picture book", labelEn: "Picture book" },
  FC: { range: "001–031", labelVi: "Đồ họa hiện đại", labelEn: "Modern graphic" },
  FD: { range: "001–042", labelVi: "Minh họa Nhật", labelEn: "Japanese illustration" },
  FE: { range: "001–067", labelVi: "Quốc phong / thủ công", labelEn: "Chinese craft" },
  FF: { range: "001–017", labelVi: "Đất sét / giấy", labelEn: "Clay, felt & paper" },
  FG: { range: "001–016", labelVi: "Anime / cel", labelEn: "Anime & cel" },
  FH: { range: "001–043", labelVi: "Chất liệu thí nghiệm", labelEn: "Mixed media" },
};

export const GROUPS: StyleGroup[] = (Object.keys(GROUP_META) as StyleGroupId[]).map((id) => ({
  id,
  range: GROUP_META[id].range,
  labelVi: GROUP_META[id].labelVi,
  labelEn: GROUP_META[id].labelEn,
  original: "",
  count: 0,
}));

export function stylePreviewUrl(number: string): string {
  const folder = number.slice(0, 2);
  return `https://cdn.jsdelivr.net/gh/yang0/handraw-style@master/images/individual/${folder}/${number}.webp`;
}

export function normalizeStyleId(raw: string): string | null {
  const match = raw.trim().match(/^(?:#)?(FA|FB|FC|FD|FE|FF|FG|FH)[-\s]?(\d{1,3})$/i);
  if (!match) return null;
  return `${match[1].toUpperCase()}-${match[2].padStart(3, "0")}`;
}

function groupIdFromRaw(group: string): StyleGroupId {
  const id = group.trim().slice(0, 2) as StyleGroupId;
  return GROUP_META[id] ? id : "FA";
}

const parsed = (rawStyles as RawStyle[]).map((item): Style => {
  const groupId = groupIdFromRaw(item.group);
  const meta = GROUP_META[groupId];
  return {
    number: item.number,
    groupId,
    group: item.group,
    groupLabelVi: meta.labelVi,
    groupLabelEn: meta.labelEn,
    range: meta.range,
    reference: item.reference,
    generationName: item.generation_name,
    traits: item.traits,
    previewUrl: stylePreviewUrl(item.number),
  };
});

export const STYLES: Style[] = parsed;

export const STYLE_BY_NUMBER: Record<string, Style> = Object.fromEntries(
  STYLES.map((s) => [s.number, s]),
);

for (const g of GROUPS) {
  g.count = STYLES.filter((s) => s.groupId === g.id).length;
  g.original = STYLES.find((s) => s.groupId === g.id)?.group ?? "";
}

export function getStyle(number: string): Style | undefined {
  return STYLE_BY_NUMBER[number];
}

export function filterStyles(opts: {
  query: string;
  group: StyleGroupId | "all";
  favorites?: string[];
  onlyFavorites?: boolean;
}): Style[] {
  const q = opts.query.trim().toLowerCase();
  const exact = normalizeStyleId(opts.query);
  return STYLES.filter((s) => {
    if (opts.group !== "all" && s.groupId !== opts.group) return false;
    if (opts.onlyFavorites && opts.favorites && !opts.favorites.includes(s.number)) return false;
    if (!q) return true;
    if (exact && s.number === exact) return true;
    return (
      s.number.toLowerCase().includes(q) ||
      s.generationName.toLowerCase().includes(q) ||
      s.reference.toLowerCase().includes(q) ||
      s.traits.toLowerCase().includes(q) ||
      s.group.toLowerCase().includes(q) ||
      s.groupLabelVi.toLowerCase().includes(q) ||
      s.groupLabelEn.toLowerCase().includes(q)
    );
  });
}
