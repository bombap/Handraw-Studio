import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { GalleryView } from "@/components/gallery/gallery-view";

export const Route = createFileRoute("/gallery")({ component: GalleryPage });

function GalleryPage() {
  return (
    <AppShell>
      <GalleryView />
    </AppShell>
  );
}
