<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <h1 class="text-3xl font-bold">Pengaturan Gambar</h1>
      <div class="flex gap-2">
        <Button variant="outline" @click="router.back()">Kembali</Button>
        <Button
          @click="handleApply"
          :loading="isApplying"
          :disabled="pendingUploads.length === 0"
        >
          {{ isApplying ? "Menyimpan..." : "Terapkan" }}
        </Button>
      </div>
    </div>

    <!-- Preview -->
    <Card>
      <CardHeader>
        <CardTitle>Preview</CardTitle>
        <CardDescription>Tampilan gambar pada aplikasi</CardDescription>
      </CardHeader>
      <CardContent>
        <div class="space-y-4">
          <!-- Header Preview -->
          <div class="bg-white p-4 rounded-lg border">
            <h3 class="text-sm font-medium mb-2">Header</h3>
            <div class="flex items-center gap-4">
              <div
                class="w-20 h-20 flex items-center justify-center border rounded-lg"
              >
                <img
                  v-if="mainLogoPreview"
                  :src="mainLogoPreview.path"
                  :alt="mainLogoPreview.name"
                  class="max-w-full max-h-full object-contain"
                />
                <span v-else class="text-sm text-gray-400">Logo Utama</span>
              </div>
              <div
                class="w-20 h-20 flex items-center justify-center border rounded-lg"
              >
                <img
                  v-if="secondaryLogoPreview"
                  :src="secondaryLogoPreview.path"
                  :alt="secondaryLogoPreview.name"
                  class="max-w-full max-h-full object-contain"
                />
                <span v-else class="text-sm text-gray-400">Logo Sekunder</span>
              </div>
            </div>
          </div>

          <!-- Banner Preview -->
          <div class="bg-white p-4 rounded-lg border">
            <h3 class="text-sm font-medium mb-2">Banner</h3>
            <div
              class="aspect-[21/9] relative rounded-lg border overflow-hidden"
            >
              <img
                v-if="bannerPreview"
                :src="bannerPreview.path"
                :alt="bannerPreview.name"
                class="w-full h-full object-cover"
              />
              <div
                v-else
                class="w-full h-full flex items-center justify-center bg-gray-50"
              >
                <span class="text-sm text-gray-400">Banner</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>

    <!-- Image Upload Section -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <!-- Logo Utama -->
      <ImageUploadCard
        title="Logo Utama"
        description="Logo utama aplikasi"
        :image="mainLogoPreview"
        @upload="handleUpload($event, 'Logo Utama')"
      />

      <!-- Logo Sekunder -->
      <ImageUploadCard
        title="Logo Sekunder"
        description="Logo sekunder aplikasi"
        :image="secondaryLogoPreview"
        @upload="handleUpload($event, 'Logo Sekunder')"
      />

      <!-- Banner -->
      <ImageUploadCard
        title="Banner"
        description="Banner aplikasi"
        :image="bannerPreview"
        @upload="handleUpload($event, 'Banner')"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useImages } from "~/composables/useImages";
import { useServerUrl } from "~/composables/useServerUrl";
import type { Image } from "~/types/api";

definePageMeta({
  middleware: ["auth"],
  layout: "admin",
});

const serverUrl = useServerUrl();
const router = useRouter();
const { images, uploadOrUpdateImage, deleteImage, refreshImages } = useImages();

// Get images by their fixed IDs
const mainLogo = computed(() => images.value?.find((img) => img.id === 1));
const secondaryLogo = computed(() => images.value?.find((img) => img.id === 2));
const banner = computed(() => images.value?.find((img) => img.id === 3));

// New refs for preview images
const mainLogoPreview = ref<Image | undefined>(mainLogo.value);
const secondaryLogoPreview = ref<Image | undefined>(secondaryLogo.value);
const bannerPreview = ref<Image | undefined>(banner.value);

const pendingUploads = ref<{ file: File; name: string }[]>([]);
const isApplying = ref(false);

const handleUpload = async (event: Event, name: string) => {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (file) {
    try {
      const previewUrl = URL.createObjectURL(file);
      const existingImage =
        name === "Logo Utama"
          ? mainLogo.value
          : name === "Logo Sekunder"
          ? secondaryLogo.value
          : name === "Banner"
          ? banner.value
          : undefined;

      const previewImage = {
        path: previewUrl,
        name,
        id: existingImage?.id || -1,
        createdAt: existingImage?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Set preview based on name
      if (name === "Logo Utama") mainLogoPreview.value = previewImage;
      else if (name === "Logo Sekunder")
        secondaryLogoPreview.value = previewImage;
      else if (name === "Banner") bannerPreview.value = previewImage;

      pendingUploads.value.push({ file, name });
    } catch (error) {
      console.error("Error preparing image:", error);
    }
  }
};

const handleApply = async () => {
  try {
    isApplying.value = true;
    for (const upload of pendingUploads.value) {
      const imageId =
        upload.name === "Logo Utama"
          ? 1
          : upload.name === "Logo Sekunder"
          ? 2
          : upload.name === "Banner"
          ? 3
          : undefined;

      await uploadOrUpdateImage(upload.file, upload.name, imageId);
    }
    pendingUploads.value = [];
    await refreshImages();
  } catch (error) {
    console.error("Error applying images:", error);
  } finally {
    isApplying.value = false;
  }
};

// Watch for changes in actual images and update previews
watch(
  () => [mainLogo.value, secondaryLogo.value, banner.value],
  ([newMainLogo, newSecondaryLogo, newBanner]) => {
    if (!pendingUploads.value.find((u) => u.name === "Logo Utama")) {
      mainLogoPreview.value = newMainLogo
        ? {
            ...newMainLogo,
            path: `${serverUrl}${newMainLogo.path}`,
          }
        : undefined;
    }
    if (!pendingUploads.value.find((u) => u.name === "Logo Sekunder")) {
      secondaryLogoPreview.value = newSecondaryLogo
        ? {
            ...newSecondaryLogo,
            path: `${serverUrl}${newSecondaryLogo.path}`,
          }
        : undefined;
    }
    if (!pendingUploads.value.find((u) => u.name === "Banner")) {
      bannerPreview.value = newBanner
        ? {
            ...newBanner,
            path: `${serverUrl}${newBanner.path}`,
          }
        : undefined;
    }
  },
  { immediate: true }
);
</script>
