import { useAuth } from "@/lib/AuthContext";
import { logger } from "@/lib/logger";
import type {
  ShoppingList,
  ShoppingListItem,
} from "@/modules/shopping-lists/shopping-list";
import { shoppingListService } from "@/modules/shopping-lists/ShoppingListService";
import type { Transaction } from "@/modules/transactions/transaction";
import { transactionService } from "@/modules/transactions/TransactionService";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const SHOPPING_LISTS_QUERY_KEY = ["shopping-lists"];

export function useShoppingLists(status?: "active" | "completed") {
  return useQuery({
    queryKey: [...SHOPPING_LISTS_QUERY_KEY, status],
    queryFn: async () => {
      try {
        let lists: ShoppingList[];
        if (status === "active") {
          lists = await shoppingListService.getActiveShoppingLists();
        } else if (status === "completed") {
          lists = await shoppingListService.getCompletedShoppingLists();
        } else {
          lists = await shoppingListService.getAllShoppingLists();
        }

        return lists;
      } catch (error) {
        logger.error(
          "useShoppingLists",
          "Error fetching shopping lists:",
          error,
        );
        throw error;
      }
    },
  });
}

export function useShoppingList(id?: string) {
  const { userData } = useAuth();
  const userId = userData?.uid;

  return useQuery({
    queryKey: [...SHOPPING_LISTS_QUERY_KEY, id],
    queryFn: async () => {
      if (!id) return null;

      try {
        const shoppingList = await shoppingListService.get(id);
        return shoppingList;
      } catch (error) {
        logger.error(
          "useShoppingList",
          `Error fetching shopping list ${id}:`,
          error,
        );
        throw error;
      }
    },
    enabled: !!id && !!userId,
  });
}

export function useCreateShoppingList() {
  const queryClient = useQueryClient();
  const { userData } = useAuth();
  const userId = userData?.uid;

  return useMutation({
    mutationFn: async (
      shoppingList:
        | Omit<ShoppingList, "id" | "userId">
        | { name: string; items?: ShoppingListItem[]; categoryId?: string },
    ) => {
      if (!userId) throw new Error("User not authenticated");

      try {
        // If it's a full shopping list object with createdAt, updatedAt and status
        if (
          "createdAt" in shoppingList &&
          "updatedAt" in shoppingList &&
          "status" in shoppingList
        ) {
          const newList = await shoppingListService.create({
            ...shoppingList,
            userId,
          });
          return newList;
        } else {
          // If it's a simplified object with just name, items, and categoryId
          const now = new Date().toISOString();
          const newList = await shoppingListService.create({
            name: shoppingList.name,
            items: shoppingList.items || [],
            createdAt: now,
            updatedAt: now,
            status: "active",
            userId,
            ...(shoppingList.categoryId && {
              categoryId: shoppingList.categoryId,
            }),
          });
          return newList;
        }
      } catch (error) {
        logger.error(
          "useCreateShoppingList",
          "Error creating shopping list:",
          error,
        );
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SHOPPING_LISTS_QUERY_KEY });
    },
  });
}

export function useUpdateShoppingList() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: Partial<ShoppingList>;
    }) => {
      try {
        const updatedList = await shoppingListService.update(id, data);
        return updatedList;
      } catch (error) {
        logger.error(
          "useUpdateShoppingList",
          `Error updating shopping list ${id}:`,
          error,
        );
        throw error;
      }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: [...SHOPPING_LISTS_QUERY_KEY, variables.id],
      });
      queryClient.invalidateQueries({ queryKey: SHOPPING_LISTS_QUERY_KEY });
    },
  });
}

export function useDeleteShoppingList() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      try {
        await shoppingListService.delete(id);
        return id;
      } catch (error) {
        logger.error(
          "useDeleteShoppingList",
          `Error deleting shopping list ${id}:`,
          error,
        );
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SHOPPING_LISTS_QUERY_KEY });
    },
  });
}

export function useCompleteShoppingList() {
  const queryClient = useQueryClient();
  const { userData } = useAuth();
  const userId = userData?.uid;

  return useMutation({
    mutationFn: async ({
      id,
      totalAmount,
      categoryId,
    }: {
      id: string;
      totalAmount: number;
      categoryId: string;
    }) => {
      if (!userId) throw new Error("User not authenticated");

      try {
        const shoppingList = await shoppingListService.get(id);
        if (!shoppingList) throw new Error(`Shopping list ${id} not found`);

        const transaction: Omit<Transaction, "id"> = {
          amount: totalAmount,
          description: `Shopping: ${shoppingList.name}`,
          date: new Date().toISOString(),
          type: "expense",
          categoryId,
          userId,
          shoppingListId: id,
        };

        const newTransaction = await transactionService.create(transaction);

        const updatedList = await shoppingListService.completeShoppingList(
          id,
          totalAmount,
          categoryId,
          newTransaction.id,
        );

        return { shoppingList: updatedList, transaction: newTransaction };
      } catch (error) {
        logger.error(
          "useCompleteShoppingList",
          `Error completing shopping list ${id}:`,
          error,
        );
        throw error;
      }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: [...SHOPPING_LISTS_QUERY_KEY, variables.id],
      });
      queryClient.invalidateQueries({ queryKey: SHOPPING_LISTS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
  });
}
