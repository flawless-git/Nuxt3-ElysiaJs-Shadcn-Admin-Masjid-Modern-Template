import type { PrayerTimes } from "~/types/api";

export const usePrayerTimes = () => {
  const { data, refresh } = useFetch<PrayerTimes>("/api/prayer-times");

  const schedules = computed(
    () =>
      data.value?.schedules ?? {
        shubuh: "--:--",
        dzuhur: "--:--",
        ashr: "--:--",
        maghrib: "--:--",
        isya: "--:--",
      }
  );

  return {
    schedules,
    refresh,
  };
};
