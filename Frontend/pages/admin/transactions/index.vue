<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <h1 class="text-3xl font-bold">Semua Transaksi</h1>
      <div class="flex gap-2">
        <Button variant="outline" @click="router.back()">Kembali</Button>
        <Button @click="router.push('/admin/transactions/new')">
          Tambah Transaksi
        </Button>
      </div>
    </div>

    <Card>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tanggal</TableHead>
              <TableHead
                class="cursor-pointer hover:bg-gray-50"
                @click="toggleSort('category')"
              >
                Kategori
                <span v-if="sortKey === 'category'" class="ml-1">
                  {{ sortOrder === "asc" ? "↑" : "↓" }}
                </span>
              </TableHead>
              <TableHead>Deskripsi</TableHead>
              <TableHead
                class="cursor-pointer hover:bg-gray-50"
                @click="toggleSort('amount')"
              >
                Jumlah
                <span v-if="sortKey === 'amount'" class="ml-1">
                  {{ sortOrder === "asc" ? "↑" : "↓" }}
                </span>
              </TableHead>
              <TableHead class="w-[100px]">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow v-for="tx in transactions" :key="tx.id">
              <TableCell>{{ formatDate(tx.createdAt) }}</TableCell>
              <TableCell>{{ tx.category }}</TableCell>
              <TableCell>{{ tx.description }}</TableCell>
              <TableCell
                :class="tx.amount > 0 ? 'text-green-600' : 'text-red-600'"
              >
                Rp {{ formatCurrency(tx.amount) }}
              </TableCell>
              <TableCell>
                <div class="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    @click="editTransaction(tx.id)"
                  >
                    <Pencil class="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    @click="handleDelete(tx.id)"
                  >
                    <Trash class="w-4 h-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  </div>
</template>

<script lang="ts" setup>
import { Pencil, Trash } from "lucide-vue-next";
import { formatCurrency } from "~/utils/format";

definePageMeta({
  middleware: ["auth"],
  layout: "admin",
});

const router = useRouter();
const {
  transactions,
  deleteTransaction,
  refreshTransactions,
  toggleSort,
  sortKey,
  sortOrder,
} = useTransactions();

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString("id-ID");
};

const editTransaction = (id: number) => {
  router.push(`/admin/transactions/${id}/edit`);
};

const handleDelete = async (id: number) => {
  if (confirm("Yakin ingin menghapus transaksi ini?")) {
    try {
      await deleteTransaction(id);
      refreshTransactions();
    } catch (error) {
      console.error("Error deleting transaction:", error);
    }
  }
};
</script>
