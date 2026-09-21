import { useEffect } from "react";
import { ensureRunner } from "@/lib/studio/queue";
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
    void ensureHydrated();
    ensureRunner();
  }, []);
  return null;
}