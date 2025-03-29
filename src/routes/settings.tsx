import { createProtectedLoader } from "@/lib/protected-route";
import { UserSettingsView } from "@/modules/settings/UserSettingsView";
import { createFileRoute } from "@tanstack/react-router";

export interface SettingsSearch {
  invitation?: string;
}

export const Route = createFileRoute("/settings")({
  component: UserSettingsView,
  loader: createProtectedLoader(),
  validateSearch: (search: Record<string, unknown>): SettingsSearch => {
    return {
      invitation: search.invitation as string | undefined,
    };
  },
});
