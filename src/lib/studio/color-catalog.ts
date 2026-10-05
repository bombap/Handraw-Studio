import type { ColorGroup, ThemeColor } from "./types";
import rawColors from "./colors.json";

interface RawColor {
  id: string;
  group: ColorGroup;
  nameZh: string;
  nameEn: string;
  nameVi: string;
  hex: string;
  promptZh: string;
  promptEn: string;
}

export const COLOR_GROUPS: { id: ColorGroup | "all"; labelVi: string; labelEn: string }[] = [
  { id: "all", labelVi: "Tất cả", labelEn: "All" },
  { id: "blue", labelVi: "Xanh dương", labelEn: "Blues" },
  { id: "green", labelVi: "Xanh lá", labelEn: "Greens" },
  { id: "red", labelVi: "Đỏ cổ điển", labelEn: "Reds" },
  { id: "pink", labelVi: "Hồng tím", labelEn: "Pinks" },
  { id: "earth", labelVi: "Đất ấm", labelEn: "Earth" },
];

export function colorPreviewUrl(id: string): string {
  return `https://cdn.jsdelivr.net/gh/yang0/handraw-style@master/images/colors/${id}.webp`;
}

export const COLORS: ThemeColor[] = (rawColors as RawColor[]).map((item) => ({
  ...item,
  previewUrl: colorPreviewUrl(item.id),
}));

export const COLOR_BY_ID: Record<string, ThemeColor> = Object.fromEntries(COLORS.map((c) => [c.id, c]));

export function getColor(id: string | null | undefined): ThemeColor | undefined {
  if (!id) return undefined;
  return COLOR_BY_ID[id];
}
