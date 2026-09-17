import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { StudioWorkspace } from "@/components/studio/studio-workspace";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  return (
    <AppShell>
      <StudioWorkspace />
    </AppShell>
  );
}
