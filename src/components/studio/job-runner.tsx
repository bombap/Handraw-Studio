import { useEffect } from "react";
import { startJobRunner } from "@/lib/studio/queue";
import { userImageRef } from "@/lib/studio/session";
import { useStudio } from "@/lib/studio/store";

let hydrateOnce: Promise<void> | null = null;

function ensureHydrated() {
  if (useStudio.persist.hasHydrated()) return Promise.resolve();
  if (!hydrateOnce) {
    hydrateOnce = Promise.resolve(useStudio.persist.rehydrate()).then(() => undefined);
  }
  return hydrateOnce;
}

export function JobRunner() {
  useEffect(() => {
    let stop: (() => void) | undefined;
    let cancelled = false;
    void ensureHydrated().then(() => {
      if (!cancelled) stop = startJobRunner(userImageRef);
    });
    return () => {
      cancelled = true;
      stop?.();
    };
  }, []);
  return null;
}