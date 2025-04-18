import { createProtectedLoader } from "@/lib/protected-route";
import { TransactionsView } from "@/modules/transactions/components/TransactionsView";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/transactions")({
  component: TransactionsView,
  loader: createProtectedLoader(),
});
