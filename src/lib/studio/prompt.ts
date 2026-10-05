import { getStyle } from "./catalog";
import type { AspectRatio, Layout, Style, ThemeColor } from "./types";

/** Skill isolation block. Injected only because the style plate is attached. */
const ISOLATION_ZH =
  "所附图片仅用于参考画风。只提取参考图的风格特征，例如线条、笔触、媒介、材质、色彩倾向和整体视觉语言；不要使用、复制或延续参考图中的任何主体、人物、动物、服装、道具、动作、姿态、场景、背景、构图、布局、文字或故事。最终画面内容完全以用户提供的主题为准。";

const ISOLATION_EN =
  "Use the attached image only as a style reference. Extract only its stylistic qualities, such as linework, brushwork, medium, material texture, color tendencies, and overall visual language. Do not use, copy, or carry over any subject, person, animal, clothing, prop, action, pose, setting, background, composition, layout, text, or story from the reference image. The user's written theme is the sole source for the image content.";

/** Fixed graphic-text suffix. Layouts use it verbatim. */
const GRAPHIC_TEXT_SUFFIX =
  "【如果主题直白包含画面元素那就按主题出图，文案由你来升华，但是不要直接描述画面。 如果主题比较概念化，那么文案和主题尽量保持一致，如果文案较长由你提炼，由你先设计画面隐喻（人类和非人类都行）再出图   。    文字参与构图，图文一体】";

function positiveTraits(traits: string): string {
  return traits
    .split(/[；;。]/)
    .map((part) => part.trim())
    .filter((part) => part && !/避免|不要|不准|禁止|avoid|don't|do not/i.test(part))
    .join("; ");
}

export function promptForImage(zh: string, en: string, theme: string): string {
  return /[\u4e00-\u9fff]/.test(theme) ? zh : en;
}

export function buildPrompts(opts: {
  style: Style;
  theme: string;
  aspectRatio?: AspectRatio;
  hasUserImage?: boolean;
  useStyleRef?: boolean;
  characterLock?: boolean;
  copyIndex?: number;
  copies?: number;
  seed?: string;
  layout?: Layout;
  color?: ThemeColor;
}): { zh: string; en: string } {
  const { style, theme } = opts;
  const traits = positiveTraits(style.traits);
  const traitsZh = traits ? `核心风格特征：${traits}。` : "";
  const traitsEn = traits ? ` Core style traits: ${traits}.` : "";
  const colorZh = opts.color?.promptZh ?? "";
  const colorEn = opts.color ? ` ${opts.color.promptEn}` : "";
  const isolationZh = opts.useStyleRef ? ISOLATION_ZH : "";
  const isolationEn = opts.useStyleRef ? ` ${ISOLATION_EN}` : "";

  const extraZh: string[] = [];
  const extraEn: string[] = [];
  if (opts.aspectRatio) {
    extraZh.push(`画幅：${opts.aspectRatio}`);
    extraEn.push(`aspect ratio: ${opts.aspectRatio}`);
  }
  if (opts.hasUserImage) {
    extraZh.push("主体限制：所附主体图是内容来源，保留身份与关键物件，只按所选风格重绘");
    extraEn.push(
      "subject constraints: the attached subject image is the content source; keep identity and key objects, and only restyle",
    );
  }
  if (opts.characterLock) {
    extraZh.push("主体限制：同一系列保持同一年龄、五官、发型、服装和关键道具");
    extraEn.push(
      "subject constraints: keep the same age, face, hair, wardrobe, and key props across the series",
    );
  }
  const zhExtra = extraZh.length ? `；${extraZh.join("；")}` : "";
  const enExtra = extraEn.length ? ` ${extraEn.join("; ")}.` : "";

  const styleZh = `风格名称：#${style.number} · ${style.generationName}。参考作者/风格名称：${style.reference}。${traitsZh}${isolationZh}`;
  const styleEn = `Style name: #${style.number} · ${style.generationName}. Reference author/style name: ${style.reference}.${traitsEn}${isolationEn}`;

  if (opts.layout) {
    const zh = `图型：${opts.layout.id} · ${opts.layout.nameZh}。${colorZh}主题：${theme}。排版要求：${opts.layout.promptZh}${styleZh}${zhExtra}${GRAPHIC_TEXT_SUFFIX}`;
    const en = `Layout: ${opts.layout.id} · ${opts.layout.nameEn}.${colorEn} Theme: ${theme}. Layout instructions: ${opts.layout.promptEn} ${styleEn}${enExtra}${GRAPHIC_TEXT_SUFFIX}`;
    return { zh, en };
  }

  const zh = `风格名称：#${style.number} · ${style.generationName}。${colorZh}主题：${theme}。参考作者/风格名称：${style.reference}。${traitsZh}${isolationZh}${zhExtra}`;
  const en = `Style name: #${style.number} · ${style.generationName}.${colorEn} Theme: ${theme}. Reference author/style name: ${style.reference}.${traitsEn}${isolationEn}${enExtra}`;
  return { zh, en };
}

export function buildPromptsByNumber(
  number: string,
  theme: string,
  opts?: { aspectRatio?: AspectRatio; hasUserImage?: boolean; useStyleRef?: boolean },
): { zh: string; en: string; style: Style } | null {
  const style = getStyle(number);
  if (!style) return null;
  return { ...buildPrompts({ style, theme, ...opts }), style };
}

/** Grok Imagine is not in the skill capability table, so the numbered plate is required. */
export function shouldUseStyleReference(): boolean {
  return true;
}
