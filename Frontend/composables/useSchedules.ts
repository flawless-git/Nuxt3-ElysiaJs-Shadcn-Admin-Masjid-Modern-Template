import type { KhatibSchedule, KajianSchedule } from "~/types/api";

export const useSchedules = () => {
  const { data: khatibSchedules, refresh: refreshKhatib } = useFetch<
    KhatibSchedule[]
  >("/api/khatib", {
    transform: (data) => data as KhatibSchedule[],
    default: () => [],
    watch: false,
  });

  const { data: kajianSchedules, refresh: refreshKajian } = useFetch<
    KajianSchedule[]
  >("/api/kajian", {
    transform: (data) => data as KajianSchedule[],
    default: () => [],
    watch: false,
  });

  const getTodaySchedules = computed(() => {
    const today = new Date().toISOString().split("T")[0];
    return {
      khatib: khatibSchedules.value?.find((s) => s.date === today),
      kajian: kajianSchedules.value?.find((s) => s.date === today),
    };
  });

  // Add delete functions
  const deleteKhatib = async (id: number) => {
    try {
      await $fetch(`/api/khatib/${id}`, {
        method: "DELETE",
      });
      refreshKhatib();
    } catch (error) {
      console.error("Error deleting khatib schedule:", error);
      throw error;
    }
  };

  const deleteKajian = async (id: number) => {
    try {
      await $fetch(`/api/kajian/${id}`, {
        method: "DELETE",
      });
      refreshKajian();
    } catch (error) {
      console.error("Error deleting kajian schedule:", error);
      throw error;
    }
  };

  return {
    khatibSchedules,
    kajianSchedules,
    getTodaySchedules,
    refreshKhatib,
    refreshKajian,
    deleteKhatib,
    deleteKajian,
  };
};
