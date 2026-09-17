export type AspectRatio = "1:1" | "3:4" | "4:3" | "16:9" | "9:16" | "3:2" | "2:3";

export type StyleGroupId = "A" | "B" | "C" | "D" | "E" | "F" | "G";

export type Lang = "vi" | "en";

export type EnhanceLevel = "short" | "full" | "cinematic";

export type Resolution = "1k" | "2k";

export type JobStatus = "queued" | "running" | "done" | "error" | "cancelled";

export interface Style {
  number: string;
  groupId: StyleGroupId;
  group: string;
  groupLabelVi: string;
  groupLabelEn: string;
  range: string;
  reference: string;
  generationName: string;
  traits: string;
  previewUrl: string;
}

export interface StyleGroup {
  id: StyleGroupId;
  range: string;
  labelVi: string;
  labelEn: string;
  original: string;
  count: number;
}

export interface GenerateJob {
  id: string;
  batchId: string;
  styleNumber: string;
  styleName: string;
  theme: string;
  promptEn: string;
  promptZh: string;
  aspectRatio: AspectRatio;
  resolution: Resolution;
  hasUserImage: boolean;
  usedStyleRef: boolean;
  status: JobStatus;
  createdAt: number;
  startedAt?: number;
  finishedAt?: number;
  error?: string;
  imageId?: string;
  retryCount: number;
  characterLock: boolean;
  waitsForAnchor: boolean;
}

export interface GalleryItem {
  id: string;
  jobId: string;
  batchId: string;
  styleNumber: string;
  styleName: string;
  theme: string;
  aspectRatio: AspectRatio;
  createdAt: number;
  favorite: boolean;
  promptEn: string;
}

export const ASPECT_OPTIONS: { id: AspectRatio; label: string; w: number; h: number }[] = [
  { id: "1:1", label: "1:1", w: 1, h: 1 },
  { id: "3:4", label: "3:4", w: 3, h: 4 },
  { id: "4:3", label: "4:3", w: 4, h: 3 },
  { id: "2:3", label: "2:3", w: 2, h: 3 },
  { id: "3:2", label: "3:2", w: 3, h: 2 },
  { id: "9:16", label: "9:16", w: 9, h: 16 },
  { id: "16:9", label: "16:9", w: 16, h: 9 },
];

export const MAX_BATCH = 12;
export const MAX_CONCURRENCY = 4;
export const DEFAULT_CONCURRENCY = 2;
export const MAX_GALLERY_ITEMS = 120;
