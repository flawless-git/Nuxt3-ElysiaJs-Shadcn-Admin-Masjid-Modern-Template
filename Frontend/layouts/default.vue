<template>
  <div
    class="flex flex-col min-h-screen bg-cover bg-center bg-no-repeat bg-fixed relative"
    style="background-image: url('/images/background-5.jpg')"
  >
    <!-- Overlay with blur -->
    <div class="absolute inset-0 backdrop-blur-[10px] bg-black/10"></div>

    <!-- Content -->
    <div class="relative z-10 flex flex-col flex-grow">
      <AppHeader class="sticky top-0 z-50 bg-white/80 backdrop-blur-sm" />
      <main class="flex-grow px-4 sm:px-6 lg:px-8">
        <slot />
      </main>
      <AppFooter class="mb-4" />
    </div>
  </div>
</template>

<script lang="ts" setup></script>

<style></style>
