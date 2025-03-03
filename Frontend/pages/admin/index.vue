<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <h1 class="text-3xl font-bold">Dashboard</h1>
      <Button @click="logout">Logout</Button>
    </div>

    <!-- Quick Actions -->
    <div class="flex gap-4">
      <Button @click="router.push('/admin/settings/image')" variant="outline">
        Pengaturan Gambar
      </Button>
    </div>

    <!-- Summary Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <Card class="bg-white">
        <CardHeader class="pb-2">
          <CardTitle class="text-sm font-medium text-gray-500">
            Saldo Kas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold">
            Rp {{ formatCurrency(currentBalance) }}
          </div>
        </CardContent>
      </Card>

      <Card class="bg-white">
        <CardHeader class="pb-2">
          <CardTitle class="text-sm font-medium text-gray-500">
            Pemasukan Hari Ini
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold text-green-600">
            Rp {{ formatCurrency(totalIncome) }}
          </div>
        </CardContent>
      </Card>

      <Card class="bg-white">
        <CardHeader class="pb-2">
          <CardTitle class="text-sm font-medium text-gray-500">
            Pengeluaran Hari Ini
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold text-red-600">
            Rp {{ formatCurrency(totalExpense) }}
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- Schedule Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card class="bg-white">
        <CardHeader class="flex justify-between items-center">
          <CardTitle>Jadwal Khatib</CardTitle>
          <Button variant="outline" size="sm" asChild>
            <NuxtLink to="/admin/schedules/khatib/new">
              <Plus class="w-4 h-4 mr-2" />
              Tambah
            </NuxtLink>
          </Button>
        </CardHeader>
        <CardContent>
          <div class="space-y-4">
            <div
              v-for="schedule in khatibSchedules"
              :key="schedule.id"
              class="flex items-start justify-between p-4 rounded-lg border"
            >
              <div>
                <p class="font-medium">{{ schedule.name }}</p>
                <p class="text-sm text-gray-600">{{ schedule.title }}</p>
                <p class="text-sm text-gray-500">
                  {{ formatDate(schedule.date) }}
                </p>
              </div>
              <div class="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  @click="
                    router.push(`/admin/schedules/khatib/${schedule.id}/edit`)
                  "
                >
                  <Pencil class="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  @click="handleDeleteKhatib(schedule.id)"
                >
                  <Trash class="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card class="bg-white">
        <CardHeader class="flex justify-between items-center">
          <CardTitle>Jadwal Kajian</CardTitle>
          <Button variant="outline" size="sm" asChild>
            <NuxtLink to="/admin/schedules/kajian/new">
              <Plus class="w-4 h-4 mr-2" />
              Tambah
            </NuxtLink>
          </Button>
        </CardHeader>
        <CardContent>
          <div class="space-y-4">
            <div
              v-for="schedule in kajianSchedules"
              :key="schedule.id"
              class="flex items-start justify-between p-4 rounded-lg border"
            >
              <div>
                <p class="font-medium">{{ schedule.name }}</p>
                <p class="text-sm text-gray-600">{{ schedule.title }}</p>
                <p class="text-sm text-gray-500">
                  {{ formatDate(schedule.date) }}
                </p>
              </div>
              <div class="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  @click="
                    router.push(`/admin/schedules/kajian/${schedule.id}/edit`)
                  "
                >
                  <Pencil class="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  @click="handleDeleteKajian(schedule.id)"
                >
                  <Trash class="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- Recent Transactions -->
    <Card class="bg-white">
      <CardHeader class="flex justify-between items-center">
        <CardTitle>Transaksi Terbaru</CardTitle>
      </CardHeader>
      <CardContent>
        <div class="flex justify-center items-center">
          <div class="flex gap-2">
            <Button variant="outline" @click="handleResetSort">
              <RefreshCcw class="w-4 h-4 mr-2" />
              Reset Sort
            </Button>
            <Button
              variant="outline"
              @click="router.push('/admin/transactions')"
            >
              Lihat Semua
            </Button>
            <Button @click="router.push('/admin/categories')" variant="outline">
              Kelola Kategori
            </Button>
            <Button @click="router.push('/admin/transactions/new')">
              Tambah Transaksi
            </Button>
          </div>
        </div>
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
            <TableRow v-for="tx in recentTransactions" :key="tx.id">
              <TableCell>{{ formatDate(tx.createdAt) }}</TableCell>
              <TableCell>{{ tx.category }}</TableCell>
              <TableCell
                :class="tx.amount > 0 ? 'text-green-600' : 'text-red-600'"
              >
                Rp {{ formatCurrency(tx.amount) }}
              </TableCell>
              <TableCell>
                <div class="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    @click="router.push(`/admin/transactions/${tx.id}/edit`)"
                  >
                    <Pencil class="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
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
import { formatCurrency } from "~/utils/format";
import { Plus, Pencil, Trash, RefreshCcw } from "lucide-vue-next";
import { useSchedules } from "~/composables/useSchedules";
import { useTransactions } from "~/composables/useTransactions";
import { useSummary } from "~/composables/useSummary";

definePageMeta({
  middleware: ["auth"],
  layout: "admin",
});

const router = useRouter();
const { logout } = useAuth();

const { currentBalance, totalIncome, totalExpense, refreshSummary } =
  useSummary();

// Transactions
const {
  transactions,
  deleteTransaction,
  refreshTransactions,
  toggleSort,
  sortKey,
  sortOrder,
  resetSort,
} = useTransactions();

const recentTransactions = computed(() => transactions.value ?? []);

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString("id-ID");
};

const editTransaction = (id: number) => {
  router.push(`/admin/transactions/${id}/edit`);
};

const { khatibSchedules, kajianSchedules, deleteKhatib, deleteKajian } =
  useSchedules();

const handleDelete = async (id: number) => {
  if (confirm("Yakin ingin menghapus transaksi ini?")) {
    try {
      await deleteTransaction(id);
      refreshTransactions();
      refreshSummary();
    } catch (error) {
      console.error("Error deleting transaction:", error);
    }
  }
};

const handleDeleteKhatib = async (id: number) => {
  if (confirm("Yakin ingin menghapus jadwal khatib ini?")) {
    try {
      await deleteKhatib(id);
    } catch (error) {
      console.error("Error deleting khatib schedule:", error);
    }
  }
};

const handleDeleteKajian = async (id: number) => {
  if (confirm("Yakin ingin menghapus jadwal kajian ini?")) {
    try {
      await deleteKajian(id);
    } catch (error) {
      console.error("Error deleting kajian schedule:", error);
    }
  }
};

const handleResetSort = () => {
  resetSort();
};
</script>
