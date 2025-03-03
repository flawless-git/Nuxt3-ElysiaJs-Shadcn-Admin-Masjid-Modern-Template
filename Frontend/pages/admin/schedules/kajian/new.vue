<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <h1 class="text-3xl font-bold">Tambah Jadwal Kajian</h1>
      <Button variant="outline" @click="router.back()">Kembali</Button>
    </div>

    <Card>
      <CardContent class="pt-6">
        <form @submit.prevent="handleSubmit" class="space-y-4">
          <div class="grid gap-2">
            <Label for="name">Nama Ustadz</Label>
            <Input
              id="name"
              v-model="form.name"
              placeholder="Masukkan nama ustadz"
              required
            />
          </div>

          <div class="grid gap-2">
            <Label for="title">Judul Kajian</Label>
            <Input
              id="title"
              v-model="form.title"
              placeholder="Masukkan judul kajian"
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
definePageMeta({
  middleware: ["auth"],
  layout: "admin",
});

const router = useRouter();

const form = ref({
  name: "",
  title: "",
  description: "",
  date: "",
});

const isSubmitting = ref(false);

const handleSubmit = async () => {
  try {
    isSubmitting.value = true;
    await $fetch("/api/kajian", {
      method: "POST",
      body: form.value,
    });
    router.push("/admin");
  } catch (error) {
    console.error("Error creating kajian schedule:", error);
  } finally {
    isSubmitting.value = false;
  }
};
</script>
