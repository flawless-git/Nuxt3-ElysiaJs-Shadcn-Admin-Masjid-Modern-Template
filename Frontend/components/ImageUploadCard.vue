<template>
  <Card>
    <CardHeader>
      <CardTitle>{{ title }}</CardTitle>
      <CardDescription>{{ description }}</CardDescription>
    </CardHeader>
    <CardContent>
      <div class="space-y-4">
        <div v-if="image" class="aspect-video relative">
          <img
            :src="imageUrl"
            :alt="image.name"
            class="w-full h-full object-contain"
          />
          <input
            type="file"
            class="hidden"
            accept="image/*"
            @change="$emit('upload', $event)"
            ref="fileInput"
          />
          <Button
            variant="secondary"
            size="sm"
            class="absolute top-2 right-2"
            @click="handleEdit"
          >
            <Pencil class="w-4 h-4" />
          </Button>
        </div>
        <div v-else>
          <label
            class="border-2 border-dashed rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50"
          >
            <input
              type="file"
              class="hidden"
              accept="image/*"
              @change="$emit('upload', $event)"
              ref="fileInput"
            />
            <Upload class="w-8 h-8 mb-2 text-gray-400" />
            <span class="text-sm text-gray-500">Klik untuk upload</span>
          </label>
        </div>
      </div>
    </CardContent>
  </Card>
</template>

<script lang="ts" setup>
import { Upload, Pencil } from "lucide-vue-next";
import { useServerUrl } from "../composables/useServerUrl";

const fileInput = ref<HTMLInputElement>();
const serverUrl = useServerUrl();

const props = defineProps<{
  title: string;
  description: string;
  image?: {
    id: number;
    name: string;
    path: string;
  };
}>();

const imageUrl = computed(() => {
  if (!props.image?.path) return "";
  return props.image.path.startsWith("blob:") ||
    props.image.path.startsWith("http")
    ? props.image.path
    : `${serverUrl}${props.image.path}`;
});

const handleEdit = () => {
  fileInput.value?.click();
};

defineEmits<{
  (e: "upload", event: Event): void;
}>();
</script>
