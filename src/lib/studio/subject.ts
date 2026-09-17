import { getImageBlob } from "./idb";
import { userImageRef } from "./session";
import { useStudio } from "./store";
import { resizeImageDataUrl } from "@/lib/utils";

function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("read failed"));
    reader.readAsDataURL(blob);
  });
}

export async function useImageAsSubject(imageId: string): Promise<boolean> {
  const blob = await getImageBlob(imageId);
  if (!blob) return false;
  const raw = await blobToDataUrl(blob);
  const resized = await resizeImageDataUrl(raw);
  userImageRef.current = resized;
  useStudio.getState().setSubjectNonce();
  useStudio.getState().setStudioTab("styles");
  return true;
}

export function clearSubject() {
  userImageRef.current = null;
  useStudio.getState().setSubjectNonce();
}

export function setSubjectDataUrl(dataUrl: string) {
  userImageRef.current = dataUrl;
  useStudio.getState().setSubjectNonce();
}
