import * as React from "react";
import { cn } from "@/lib/utils";

const Textarea = React.forwardRef<HTMLTextAreaElement, React.ComponentProps<"textarea">>(
  function Textarea({ className, ...props }, ref) {
    return (
      <textarea
        ref={ref}
        className={cn(
          "flex min-h-16 w-full rounded-lg border border-line bg-surface px-3 py-2.5 text-sm leading-relaxed text-ink",
          "placeholder:text-ink-subtle focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-stamp",
          "disabled:opacity-40 resize-none",
          className,
        )}
        {...props}
      />
    );
  },
);

export { Textarea };
