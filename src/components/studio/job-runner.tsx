import { useEffect } from "react";
import { startJobRunner } from "@/lib/studio/queue";
import { userImageRef } from "@/lib/studio/session";
import { useStudio } from "@/lib/studio/store";

export function JobRunner() {
  useEffect(() => {
    let stop: (() => void) | undefined;
    void Promise.resolve(useStudio.persist.rehydrate()).then(() => {
      stop = startJobRunner(userImageRef);
    });
    return () => stop?.();
  }, []);
  return null;
}
