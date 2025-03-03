<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <h1 class="text-3xl font-bold">Edit Jadwal Khatib</h1>
      <Button variant="outline" @click="router.back()">Kembali</Button>
    </div>

    <Card>
      <CardContent class="pt-6">
        <form @submit.prevent="handleSubmit" class="space-y-4">
          <div class="grid gap-2">
            <Label for="name">Nama Khatib</Label>
            <Input
              id="name"
              v-model="form.name"
              placeholder="Masukkan nama khatib"
              required
            />
          </div>

          <div class="grid gap-2">
            <Label for="title">Judul Khutbah</Label>
            <Input
              id="title"
              v-model="form.title"
              placeholder="Masukkan judul khutbah"
              required
            />
          </div>

          <div class="grid gap-2">
            <Label for="description">Deskripsi</Label>
            <Textarea
              id="description"
              v-model="form.description"
              placeholder="Masukkan deskripsi"
              required
            />
          </div>

          <div class="grid gap-2">
            <Label for="date">Tanggal</Label>
            <Input id="date" v-model="form.date" type="date" required />
          </div>

          <div class="flex justify-end">
            <Button type="submit" :loading="isSubmitting">
              {{ isSubmitting ? "Menyimpan..." : "Simpan" }}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  </div>
</template>

<script lang="ts" setup>
import type { KhatibSchedule } from "~/types/api";

definePageMeta({
  middleware: ["auth"],
  layout: "admin",
});

const route = useRoute();
const router = useRouter();
const id = route.params.id;

const form = ref({
  name: "",
  title: "",
  description: "",
  date: "",
});

const isSubmitting = ref(false);

// Fetch existing data
const { data: currentSchedule, error } = await useFetch<KhatibSchedule>(
  `/api/khatib/${id}`
);

// Set form values when data is loaded
watchEffect(() => {
  if (currentSchedule.value) {
    form.value = { ...currentSchedule.value };
  }
});

const handleSubmit = async () => {
  try {
    isSubmitting.value = true;
    await $fetch(`/api/khatib/${id}`, {
      method: "PUT",
      body: form.value,
    });
    router.push("/admin");
  } catch (error) {
    console.error("Error updating khatib schedule:", error);
  } finally {
    isSubmitting.value = false;
  }
};
</script>
