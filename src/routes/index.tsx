import { createFileRoute } from "@tanstack/react-router";
import { StudioWorkspace } from "@/components/studio/studio-workspace";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  return <StudioWorkspace />;
}