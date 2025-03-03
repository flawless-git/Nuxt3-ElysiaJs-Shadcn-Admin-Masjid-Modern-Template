<template>
  <div class="py-4 sm:py-6 lg:py-8">
    <div class="flex h-full flex-col lg:flex-row gap-4">
      <!-- Image Banner -->
      <div class="w-full lg:w-1/3">
        <div class="p-0">
          <NuxtImg
            :src="`${serverUrl}${imageBanner?.path}`"
            :alt="imageBanner?.name"
            class="w-full h-[700px] object-scale-down rounded-xl"
          />
        </div>
      </div>

      <!-- Cards Section -->
      <div
        class="w-full lg:w-2/3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        <Card class="h-full flex flex-col bg-white/80 backdrop-blur-sm">
          <CardHeader class="border-b-2 border-black">
            <CardTitle class="text-center text-base sm:text-lg lg:text-xl">
              Laporan Kas
            </CardTitle>
          </CardHeader>
          <CardContent class="flex-1 flex items-center justify-center">
            <div class="space-y-2">
              <div>
                <p
                  class="text-center font-semibold text-sm sm:text-base lg:text-lg"
                >
                  Uang kas saat ini:
                </p>
                <p class="text-center text-sm sm:text-base lg:text-lg">
                  Rp. {{ formatCurrency(currentBalance) }}
                </p>
              </div>
              <div>
                <p class="text-center text-sm sm:text-base lg:text-lg">
                  Total pemasukan hari ini:
                </p>
                <p class="text-center text-sm sm:text-base lg:text-lg">
                  Rp. {{ formatCurrency(totalIncome) }}
                </p>
              </div>
              <div>
                <p class="text-center text-sm sm:text-base lg:text-lg">
                  Total pengeluaran hari ini:
                </p>
                <p class="text-center text-sm sm:text-base lg:text-lg">
                  Rp. {{ formatCurrency(totalExpense) }}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card class="h-full flex flex-col bg-white/80 backdrop-blur-sm">
          <CardHeader class="border-b-2 border-black">
            <CardTitle class="text-center text-base sm:text-lg lg:text-xl">
              Jadwal Khatib
            </CardTitle>
          </CardHeader>
          <CardContent class="flex-1 flex items-center justify-center">
            <div v-if="khatibSchedules?.[0]" class="space-y-2">
              <p class="text-center font-semibold">
                {{ khatibSchedules[0].name }}
              </p>
              <p class="text-center text-sm text-gray-600">
                {{ khatibSchedules[0].title }}
              </p>
              <p class="text-center text-sm text-gray-500">
                {{ formatDate(khatibSchedules[0].date) }}
              </p>
            </div>
            <p v-else class="text-center text-gray-500">
              Tidak ada jadwal khatib hari ini
            </p>
          </CardContent>
        </Card>

        <Card class="h-full flex flex-col bg-white/80 backdrop-blur-sm">
          <CardHeader class="border-b-2 border-black">
            <CardTitle class="text-center text-base sm:text-lg lg:text-xl">
              Jadwal Kajian
            </CardTitle>
          </CardHeader>
          <CardContent class="flex-1 flex items-center justify-center">
            <div v-if="kajianSchedules?.[0]" class="space-y-2">
              <p class="text-center font-semibold">
                {{ kajianSchedules[0].name }}
              </p>
              <p class="text-center text-sm text-gray-600">
                {{ kajianSchedules[0].title }}
              </p>
              <p class="text-center text-sm text-gray-500">
                {{ formatDate(kajianSchedules[0].date) }}
              </p>
            </div>
            <p v-else class="text-center text-gray-500">
              Tidak ada jadwal kajian hari ini
            </p>
          </CardContent>
        </Card>
      </div>
    </div>

    <!-- Current Time -->
    <div class="h-full flex flex-col mt-12">
      <div>
        <h3 class="text-center text-base sm:text-lg lg:text-xl font-semibold">
          Waktu Saat Ini
        </h3>
      </div>
      <div class="flex-1 flex items-center justify-center">
        <div class="space-y-2 text-center">
          <p class="text-2xl font-bold">{{ currentTime }}</p>
          <p class="text-lg">{{ currentDate }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { SummaryResponse, Transaction } from "~/types/api";
import { formatCurrency } from "~/utils/format";
import { useSchedules } from "~/composables/useSchedules";
import { useServerUrl } from "~/composables/useServerUrl";
import { useImages } from "~/composables/useImages";
import { computed } from "vue";

const serverUrl = useServerUrl();

const { images } = useImages();

// Get images by their fixed IDs
const imageBanner = computed(() => images.value?.find((img) => img.id === 3));

// Data fetching
const { data: summary, refresh: refreshData } = await useFetch<SummaryResponse>(
  "/api/admin/summary"
);

// Transactions
const { data: transactions } = await useFetch<Transaction[]>(
  "/api/admin/transactions"
);

// Auto refresh setiap 1 menit
onMounted(() => {
  const interval = setInterval(() => {
    refreshData();
  }, 1000);

  // Cleanup interval when component unmounts
  onUnmounted(() => {
    clearInterval(interval);
  });
});

const currentBalance = computed(() => summary.value?.currentBalance ?? 0);
const totalIncome = computed(() => summary.value?.income?.total ?? 0);
const totalExpense = computed(() => summary.value?.expense?.total ?? 0);

const recentTransactions = computed(() => transactions.value ?? []);

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString("id-ID", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const titles = ["Laporan Kas", "Jadwal Khatib", "Jadwal Kajian"];
const contents = [" ", " ", " "];

const currentTime = ref("");
const currentDate = ref("");

const updateTime = () => {
  const now = new Date();
  currentTime.value = now.toLocaleTimeString("id-ID");
  currentDate.value = now.toLocaleDateString("id-ID", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

// Update time every second
onMounted(() => {
  updateTime(); // Initial update
  const interval = setInterval(updateTime, 1000);

  onUnmounted(() => {
    clearInterval(interval);
  });
});

const { khatibSchedules, kajianSchedules } = useSchedules();
</script>

<style></style>
