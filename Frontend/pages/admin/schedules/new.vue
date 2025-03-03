<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <h1 class="text-3xl font-bold">Tambah Jadwal</h1>
      <Button variant="outline" @click="router.back()">Kembali</Button>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- Form Khatib -->
      <Card>
        <CardHeader>
          <CardTitle>Jadwal Khatib</CardTitle>
        </CardHeader>
        <CardContent>
          <form @submit.prevent="handleKhatibSubmit" class="space-y-4">
            <div class="grid gap-2">
              <Label for="khatib-name">Nama Khatib</Label>
              <Input
                id="khatib-name"
                v-model="khatibForm.name"
                placeholder="Masukkan nama khatib"
                required
              />
            </div>

            <div class="grid gap-2">
              <Label for="khatib-title">Judul Khutbah</Label>
              <Input
                id="khatib-title"
                v-model="khatibForm.title"
                placeholder="Masukkan judul khutbah"
                required
              />
            </div>

            <div class="grid gap-2">
              <Label for="khatib-description">Deskripsi</Label>
              <Textarea
                id="khatib-description"
                v-model="khatibForm.description"
                placeholder="Masukkan deskripsi"
                required
              />
            </div>

            <div class="grid gap-2">
              <Label for="khatib-date">Tanggal</Label>
              <Input
                id="khatib-date"
                v-model="khatibForm.date"
                type="date"
                required
              />
            </div>

            <Button type="submit" :loading="isKhatibSubmitting">
              {{ isKhatibSubmitting ? "Menyimpan..." : "Simpan" }}
            </Button>
          </form>
        </CardContent>
      </Card>

      <!-- Form Kajian -->
      <Card>
        <CardHeader>
          <CardTitle>Jadwal Kajian</CardTitle>
        </CardHeader>
        <CardContent>
          <form @submit.prevent="handleKajianSubmit" class="space-y-4">
            <div class="grid gap-2">
              <Label for="kajian-name">Nama Ustadz</Label>
              <Input
                id="kajian-name"
                v-model="kajianForm.name"
                placeholder="Masukkan nama ustadz"
                required
              />
            </div>

            <div class="grid gap-2">
              <Label for="kajian-title">Judul Kajian</Label>
              <Input
                id="kajian-title"
                v-model="kajianForm.title"
                placeholder="Masukkan judul kajian"
                required
              />
            </div>

            <div class="grid gap-2">
              <Label for="kajian-description">Deskripsi</Label>
              <Textarea
                id="kajian-description"
                v-model="kajianForm.description"
                placeholder="Masukkan deskripsi"
                required
              />
            </div>

            <div class="grid gap-2">
              <Label for="kajian-date">Tanggal</Label>
              <Input
                id="kajian-date"
                v-model="kajianForm.date"
                type="date"
                required
              />
            </div>

            <Button type="submit" :loading="isKajianSubmitting">
              {{ isKajianSubmitting ? "Menyimpan..." : "Simpan" }}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  </div>
</template>

<script lang="ts" setup>
definePageMeta({
  middleware: ["auth"],
  layout: "admin",
});

const router = useRouter();

const khatibForm = ref({
  name: "",
  title: "",
  description: "",
  date: "",
});

const kajianForm = ref({
  name: "",
  title: "",
  description: "",
  date: "",
});

const isKhatibSubmitting = ref(false);
const isKajianSubmitting = ref(false);

const handleKhatibSubmit = async () => {
  try {
    isKhatibSubmitting.value = true;
    await $fetch("/api/khatib", {
      method: "POST",
      body: khatibForm.value,
    });
    router.push("/admin");
  } catch (error) {
    console.error("Error creating khatib schedule:", error);
  } finally {
    isKhatibSubmitting.value = false;
  }
};

const handleKajianSubmit = async () => {
  try {
    isKajianSubmitting.value = true;
    await $fetch("/api/kajian", {
      method: "POST",
      body: kajianForm.value,
    });
    router.push("/admin");
  } catch (error) {
    console.error("Error creating kajian schedule:", error);
  } finally {
    isKajianSubmitting.value = false;
  }
};
</script>
