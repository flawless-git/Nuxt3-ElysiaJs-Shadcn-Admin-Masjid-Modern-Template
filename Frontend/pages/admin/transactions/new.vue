<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <h1 class="text-3xl font-bold">Tambah Transaksi</h1>
      <Button variant="outline" @click="router.back()">Kembali</Button>
    </div>

    <Card>
      <CardContent class="pt-6">
        <form @submit.prevent="handleSubmit" class="space-y-4">
          <div class="grid gap-4">
            <div class="grid gap-2">
              <Label for="amount">Jumlah</Label>
              <Input
                id="amount"
                v-model="form.amount"
                type="number"
                placeholder="Masukkan jumlah"
                required
              />
            </div>

            <div class="grid gap-2">
              <Label for="description">Deskripsi</Label>
              <Input
                id="description"
                v-model="form.description"
                placeholder="Masukkan deskripsi"
                required
              />
            </div>

            <div class="grid gap-2">
              <Label for="category">Kategori</Label>
              <Select v-model="form.categoryId">
                <SelectTrigger>
                  <SelectValue placeholder="Pilih kategori" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Kategori</SelectLabel>
                    <SelectItem
                      v-for="cat in categories"
                      :key="cat.id"
                      :value="cat.id.toString()"
                    >
                      {{ cat.name }}
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div class="flex justify-end gap-4">
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

interface Category {
  id: number;
  name: string;
}

// Fetch categories
const { data: categories } = await useFetch<Category[]>(
  "/api/admin/categories"
);

const form = ref({
  amount: 0,
  description: "",
  categoryId: "",
});

const isSubmitting = ref(false);

const handleSubmit = async () => {
  try {
    isSubmitting.value = true;

    await $fetch("/api/admin/transactions", {
      method: "POST",
      body: form.value,
    });

    router.push("/admin");
  } catch (error) {
    console.error("Error creating transaction:", error);
  } finally {
    isSubmitting.value = false;
  }
};
</script>
