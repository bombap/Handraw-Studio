import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { getImageObjectUrl, peekImageObjectUrl, subscribeImageCache } from "@/lib/studio/idb";

export function StoredImage({
  id,
  alt,
  className,
}: {
  id: string;
  alt: string;
  className?: string;
}) {
  const [url, setUrl] = useState<string | undefined>(() => peekImageObjectUrl(id));

  useEffect(() => {
    let alive = true;
    const load = () => {
      const cached = peekImageObjectUrl(id);
      if (cached) {
        setUrl(cached);
        return;
      }
      void getImageObjectUrl(id).then((next) => {
        if (alive) setUrl(next);
      });
    };
    load();
    const unsub = subscribeImageCache((changed) => {
      if (changed === id) load();
    });
    return () => {
      alive = false;
      unsub();
    };
  }, [id]);

  if (!url) {
    return <div className={cn("animate-pulse bg-line", className)} aria-hidden />;
  }

  return <img src={url} alt={alt} className={cn("img-outline object-cover", className)} />;
}