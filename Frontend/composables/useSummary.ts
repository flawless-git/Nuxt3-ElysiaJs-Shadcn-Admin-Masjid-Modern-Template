import type { SummaryResponse } from "~/types/api";

export const useSummary = () => {
  const { data: summary, refresh: refreshSummary } =
    useFetch<SummaryResponse>("/api/admin/summary");

  const currentBalance = computed(() => summary.value?.currentBalance ?? 0);
  const totalIncome = computed(() => summary.value?.income?.total ?? 0);
  const totalExpense = computed(() => summary.value?.expense?.total ?? 0);

  const initializeBalance = async (amount: number) => {
    try {
      await $fetch("/api/admin/balance/initialize", {
        method: "POST",
        body: { amount },
      });
      refreshSummary();
    } catch (error) {
      console.error("Error initializing balance:", error);
      throw error;
    }
  };

  return {
    summary,
    refreshSummary,
    currentBalance,
    totalIncome,
    totalExpense,
    initializeBalance,
  };
};
