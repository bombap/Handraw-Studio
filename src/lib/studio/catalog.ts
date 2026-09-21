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
  A: { range: "001–035", labelVi: "Xã luận / hài hước", labelEn: "Editorial cartoon" },
  B: { range: "036–054", labelVi: "Picture book kể chuyện", labelEn: "Narrative picture book" },
  C: { range: "055–082", labelVi: "Nhân vật đồ họa", labelEn: "Modern graphic figures" },
  D: { range: "083–123", labelVi: "Minh họa Nhật", labelEn: "Japanese illustration" },
  E: { range: "124–154", labelVi: "Minh họa Trung Quốc", labelEn: "Chinese illustration" },
  F: { range: "155–200", labelVi: "Mạng / chất liệu", labelEn: "Web / medium / regional" },
  G: { range: "201–216", labelVi: "Bổ sung đương đại", labelEn: "Contemporary supplement" },
  H: { range: "217–274", labelVi: "Khác / đương đại", labelEn: "Other / contemporary" },
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
  const n = Number.parseInt(number, 10);
  const bucket = n <= 200 ? "001-200" : "201-400";
  return `https://cdn.jsdelivr.net/gh/yang0/handraw-style@master/images/individual/${bucket}/${number}.webp`;
}

function groupIdFromRaw(group: string): StyleGroupId {
  const letter = group.trim()[0] as StyleGroupId;
  return GROUP_META[letter] ? letter : "A";
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
  return STYLES.filter((s) => {
    if (opts.group !== "all" && s.groupId !== opts.group) return false;
    if (opts.onlyFavorites && opts.favorites && !opts.favorites.includes(s.number)) return false;
    if (!q) return true;
    return (
      s.number.includes(q) ||
      s.generationName.toLowerCase().includes(q) ||
      s.reference.toLowerCase().includes(q) ||
      s.traits.toLowerCase().includes(q) ||
      s.group.toLowerCase().includes(q) ||
      s.groupLabelVi.toLowerCase().includes(q) ||
      s.groupLabelEn.toLowerCase().includes(q)
    );
  });
}
