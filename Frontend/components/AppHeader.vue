<template>
  <header class="p-4">
    <div class="flex justify-between items-center gap-2 sm:gap-4">
      <Card class="w-20 sm:w-32 lg:w-40 bg-transparent border-none shadow-none">
        <CardContent class="flex items-center justify-center p-0">
          <NuxtImg
            v-if="mainLogo"
            :src="`${serverUrl}${mainLogo.path}`"
            :alt="mainLogo.name"
            class="w-20 h-20 object-contain"
          />
        </CardContent>
      </Card>

      <h1
        class="text-lg sm:text-3xl lg:text-4xl font-extrabold text-center truncate"
      >
        {{ title }}
      </h1>

      <Card class="w-20 sm:w-32 lg:w-40 bg-transparent border-none shadow-none">
        <CardContent class="flex items-center justify-center p-0">
          <NuxtImg
            v-if="secondaryLogo"
            :src="`${serverUrl}${secondaryLogo.path}`"
            :alt="secondaryLogo.name"
            class="w-20 h-20 object-contain"
          />
        </CardContent>
      </Card>
    </div>
  </header>
</template>

<script lang="ts" setup>
import { useServerUrl } from "~/composables/useServerUrl";
const serverUrl = useServerUrl();
import { useImages } from "~/composables/useImages";
import { computed } from "vue";

const { images } = useImages();

// Get images by their fixed IDs
const mainLogo = computed(() => images.value?.find((img) => img.id === 1));
const secondaryLogo = computed(() => images.value?.find((img) => img.id === 2));

const title = "Masjid Al-Hikmah";
</script>

<style></style>
