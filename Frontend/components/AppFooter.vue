<template>
  <footer class="px-4 py-2">
    <h1 class="text-2xl font-bold text-center mb-2">Jadwal Solat</h1>
    <!-- Bottom Cards -->
    <div
      class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
    >
      <Card
        v-for="(time, name) in schedules"
        :key="name"
        class="bg-white/80 backdrop-blur-sm"
      >
        <CardHeader>
          <CardTitle
            class="text-center text-base sm:text-lg lg:text-xl font-semibold border-b border-black"
          >
            {{ formatTitle(name as keyof typeof schedules) }}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p class="text-center text-base sm:text-lg lg:text-xl font-semibold">
            {{ time }}
          </p>
        </CardContent>
      </Card>
    </div>
  </footer>
</template>

<script lang="ts" setup>
import { usePrayerTimes } from "../composables/usePrayerTimes";

const { schedules } = usePrayerTimes();

const formatTitle = (name: string) => {
  const titles: Record<string, string> = {
    shubuh: "Subuh",
    dzuhur: "Dzuhur",
    ashr: "Ashar",
    maghrib: "Maghrib",
    isya: "Isya",
  };
  return titles[name] ?? name;
};
</script>

<style></style>
