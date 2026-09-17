import * as React from "react";
import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      className={cn(
        "flex h-11 w-full rounded-lg border border-line bg-surface px-3 text-sm text-ink",
        "placeholder:text-ink-subtle focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-stamp",
        "disabled:opacity-40",
        className,
      )}
      {...props}
    />
  );
}

export { Input };
