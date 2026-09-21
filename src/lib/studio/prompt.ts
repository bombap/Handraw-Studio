import { getStyle } from "./catalog";
import type { AspectRatio, Style } from "./types";

const ISOLATION_ZH =
  "所附风格图片仅用于参考画风。只提取参考图的风格特征，例如线条、笔触、媒介、材质、色彩倾向和整体视觉语言；不要使用、复制或延续参考图中的任何主体、人物、动物、服装、道具、动作、姿态、场景、背景、构图、布局、文字或故事。最终画面内容完全以用户提供的主题为准。";

const ISOLATION_EN =
  "Use the attached style image only as a style reference. Extract only its stylistic qualities, such as linework, brushwork, medium, material texture, color tendencies, and overall visual language. Do not use, copy, or carry over any subject, person, animal, clothing, prop, action, pose, setting, background, composition, layout, text, or story from the style reference image. The user's written theme is the sole source for the image content.";

const LOCK_ZH =
  "这是同一系列的一张。必须保持同一人物身份、年龄、五官、发型、服装和关键道具；只改变绘画风格，不要换人。";
const LOCK_EN =
  "This is one plate in a series. Keep the same character identity, age, face, hair, wardrobe, and key props. Only the drawing style changes — do not recast the person.";
const CONTENT_EN =
  "If a subject photograph or sketch is also attached, treat that image as the content source: keep the subject's identity, key objects, and scene intent, and restyle everything into the chosen hand-drawn look.";

function positiveTraits(traits: string): string {
  return traits
    .split(/[；;。]/)
    .map((part) => part.trim())
    .filter((part) => part && !/避免|不要|不准|avoid|don't|do not/i.test(part))
    .join("; ");
}

const VARIANT_EN = [
  "wider establishing crop with more environment",
  "closer crop on the subject",
  "three-quarter pose and a diagonal composition",
  "subject offset left with more negative space on the right",
  "slightly lower camera with more vertical space",
];
const VARIANT_ZH = [
  "更宽的场景取景，多留环境",
  "更近的主体特写",
  "四分之三侧面与对角线构图",
  "主体偏左，右侧多留白",
  "略低机位，多留纵向空间",
];

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
}): { zh: string; en: string } {
  const { style, theme } = opts;
  const traits = positiveTraits(style.traits);
  const extraZh = opts.aspectRatio ? `画幅：${opts.aspectRatio}。` : "";
  const extraEn = opts.aspectRatio ? ` Aspect ratio: ${opts.aspectRatio}.` : "";

  let zh = `风格名称：#${style.number} · ${style.generationName}。主题：${theme}。参考作者/风格名称：${style.reference}。`;
  let en = `Style name: #${style.number} · ${style.generationName}. Theme: ${theme}. Reference author/style name: ${style.reference}.`;

  if (traits) {
    zh += `核心风格特征：${traits}。`;
    en += ` Core visual traits: ${traits}.`;
  }

  zh += extraZh;
  en += extraEn;

  if (opts.useStyleRef) {
    zh += ISOLATION_ZH;
    en += ` ${ISOLATION_EN}`;
  }
  if (opts.hasUserImage) {
    zh += "若同时附上用户图片，则以该图为内容来源，保留主体身份与关键物件，将整个画面转绘为所选手绘风格。";
    en += ` ${CONTENT_EN}`;
  }
  if (opts.characterLock) {
    zh += LOCK_ZH;
    en += ` ${LOCK_EN}`;
  }
  const copies = opts.copies ?? 1;
  const copyIndex = opts.copyIndex ?? 1;
  const seed = opts.seed?.trim();
  if (copies > 1 || seed) {
    const angle = VARIANT_EN[(copyIndex - 1) % VARIANT_EN.length];
    const angleZh = VARIANT_ZH[(copyIndex - 1) % VARIANT_ZH.length];
    zh += `这是同一风格的第${copyIndex}/${Math.max(copies, 1)}张独立变体，种子 ${seed || copyIndex}：构图倾向「${angleZh}」。保持风格、媒介和主体身份，但画面不得与其他变体雷同。`;
    en += ` Independent variation ${copyIndex} of ${Math.max(copies, 1)}, seed ${seed || copyIndex}. Composition bias: ${angle}. Keep the medium, style, and subject identity, but the frame must not match other variations.`;
  }

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

/** Grok Imagine is not in the skill's capability table — always pass the numbered style image. */
export function shouldUseStyleReference(): boolean {
  return true;
}
