<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <h1 class="text-3xl font-bold">Edit Transaksi</h1>
      <Button variant="outline" @click="router.back()">Kembali</Button>
    </div>

    <Card>
      <CardContent class="pt-6">
        <form @submit.prevent="handleSubmit" class="space-y-4">
          <div class="grid gap-2">
            <Label for="amount">Jumlah (Rp)</Label>
            <Input
              id="amount"
              v-model="form.amount"
              type="number"
              placeholder="Masukkan jumlah"
              required
            />
            <p class="text-sm text-gray-500">
              *Positif untuk pemasukan, negatif untuk pengeluaran
            </p>
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
import type { Transaction } from "~/types/api";
import { useTransactions } from "~/composables/useTransactions";

definePageMeta({
  middleware: ["auth"],
  layout: "admin",
});

const route = useRoute();
const router = useRouter();
const { getTransaction, updateTransaction } = useTransactions();

const form = ref({
  amount: 0,
  description: "",
  categoryId: 0,
});

const isSubmitting = ref(false);

// Fetch categories
const { data: categories } = await useFetch("/api/admin/categories");

// Fetch existing transaction
const { data: currentTransaction } = await useAsyncData(() =>
  getTransaction(Number(route.params.id))
);

// Set form values when data is loaded
watchEffect(() => {
  if (currentTransaction.value) {
    form.value = {
      amount: currentTransaction.value.amount,
      description: currentTransaction.value.description,
      categoryId: currentTransaction.value.categoryId,
    };
  }
});

const handleSubmit = async () => {
  try {
    isSubmitting.value = true;
    await updateTransaction(Number(route.params.id), form.value);
    router.push("/admin");
  } catch (error) {
    console.error("Error updating transaction:", error);
  } finally {
    isSubmitting.value = false;
  }
};
</script>
