import { createFileRoute } from "@tanstack/react-router";
import { GalleryView } from "@/components/gallery/gallery-view";

export const Route = createFileRoute("/gallery")({ component: GalleryPage });

function GalleryPage() {
  return <GalleryView />;
}