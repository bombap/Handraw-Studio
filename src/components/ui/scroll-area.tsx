import * as React from "react";
import * as ScrollPrimitive from "@radix-ui/react-scroll-area";
import { cn } from "@/lib/utils";

function ScrollArea({
  className,
  children,
  ...props
}: React.ComponentProps<typeof ScrollPrimitive.Root>) {
  return (
    <ScrollPrimitive.Root className={cn("relative overflow-hidden", className)} {...props}>
      <ScrollPrimitive.Viewport className="h-full w-full rounded-[inherit]">
        {children}
      </ScrollPrimitive.Viewport>
      <ScrollPrimitive.Scrollbar
        orientation="vertical"
        className="flex w-2 touch-none select-none p-0.5"
      >
        <ScrollPrimitive.Thumb className="relative flex-1 rounded-full bg-line-strong" />
      </ScrollPrimitive.Scrollbar>
    </ScrollPrimitive.Root>
  );
}

export { ScrollArea };
