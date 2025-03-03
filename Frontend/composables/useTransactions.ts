import type { Transaction } from "~/types/api";

export const useTransactions = () => {
  const { data: transactions, refresh: refreshTransactions } = useFetch<
    Transaction[]
  >("/api/admin/transactions");

  const sortKey = ref<"category" | "amount" | null>(null);
  const sortOrder = ref<"asc" | "desc">("asc");

  const sortedTransactions = computed(() => {
    if (!transactions.value || !sortKey.value) return transactions.value;

    return [...transactions.value].sort((a, b) => {
      const aValue = sortKey.value === "category" ? a.category : a.amount;
      const bValue = sortKey.value === "category" ? b.category : b.amount;

      if (sortOrder.value === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
  });

  const toggleSort = (key: "category" | "amount") => {
    if (sortKey.value === key) {
      sortOrder.value = sortOrder.value === "asc" ? "desc" : "asc";
    } else {
      sortKey.value = key;
      sortOrder.value = "asc";
    }
  };

  const createTransaction = async (data: Partial<Transaction>) => {
    try {
      await $fetch("/api/admin/transactions", {
        method: "POST",
        body: data,
      });
      refreshTransactions();
    } catch (error) {
      console.error("Error creating transaction:", error);
      throw error;
    }
  };

  const updateTransaction = async (id: number, data: Partial<Transaction>) => {
    try {
      await $fetch(`/api/admin/transactions/${id}`, {
        method: "PUT",
        body: data,
      });
      refreshTransactions();
    } catch (error) {
      console.error("Error updating transaction:", error);
      throw error;
    }
  };

  const deleteTransaction = async (id: number) => {
    try {
      await $fetch(`/api/admin/transactions/${id}`, {
        method: "DELETE",
      });
      refreshTransactions();
    } catch (error) {
      console.error("Error deleting transaction:", error);
      throw error;
    }
  };

  const getTransaction = async (id: number) => {
    try {
      return await $fetch<Transaction>(`/api/admin/transactions/${id}`);
    } catch (error) {
      console.error("Error fetching transaction:", error);
      throw error;
    }
  };

  const resetSort = () => {
    sortKey.value = null;
    sortOrder.value = "asc";
  };

  return {
    transactions: sortedTransactions,
    refreshTransactions,
    createTransaction,
    updateTransaction,
    deleteTransaction,
    getTransaction,
    toggleSort,
    sortKey,
    sortOrder,
    resetSort,
  };
};
