<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <h1 class="text-3xl font-bold">Kelola Kategori</h1>
      <div class="flex gap-2">
        <Button variant="outline" @click="router.back()">Kembali</Button>
        <Button @click="openDialog()">Tambah Kategori</Button>
      </div>
    </div>

    <Card>
      <CardContent class="pt-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nama</TableHead>
              <TableHead>Deskripsi</TableHead>
              <TableHead class="w-[100px]">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow v-for="category in categories" :key="category.id">
              <TableCell>{{ category.name }}</TableCell>
              <TableCell>{{ category.description }}</TableCell>
              <TableCell>
                <div class="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    @click="openDialog(category)"
                  >
                    <Pencil class="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    @click="handleDelete(category.id)"
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

    <!-- Dialog Form -->
    <Dialog :open="showDialog" @update:open="showDialog = $event">
      <DialogContent class="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle
            >{{ isEditing ? "Edit" : "Tambah" }} Kategori</DialogTitle
          >
        </DialogHeader>
        <form @submit.prevent="handleSubmit" class="space-y-4">
          <div class="grid gap-4">
            <div class="grid gap-2">
              <Label for="name">Nama Kategori</Label>
              <Input id="name" v-model="form.name" required />
            </div>
            <div class="grid gap-2">
              <Label for="description">Deskripsi</Label>
              <Textarea id="description" v-model="form.description" required />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" @click="showDialog = false">
              Batal
            </Button>
            <Button type="submit" :loading="isSubmitting">
              {{ isSubmitting ? "Menyimpan..." : "Simpan" }}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  </div>
</template>

<script lang="ts" setup>
import type { Category } from "~/types/api";
import { Pencil, Trash } from "lucide-vue-next";
import { useCategories } from "~/composables/useCategories";
const router = useRouter();

definePageMeta({
  middleware: ["auth"],
  layout: "admin",
});

const { categories, createCategory, updateCategory, deleteCategory } =
  useCategories();

const showDialog = ref(false);
const isSubmitting = ref(false);
const isEditing = ref(false);
const editId = ref<number | null>(null);

const form = ref({
  name: "",
  description: "",
});

const openDialog = (category?: Category) => {
  if (category) {
    form.value = { ...category };
    isEditing.value = true;
    editId.value = category.id;
  } else {
    form.value = { name: "", description: "" };
    isEditing.value = false;
    editId.value = null;
  }
  showDialog.value = true;
};

const handleSubmit = async () => {
  try {
    isSubmitting.value = true;
    if (isEditing.value && editId.value) {
      await updateCategory(editId.value, form.value);
    } else {
      await createCategory(form.value);
    }
    showDialog.value = false;
  } catch (error) {
    console.error("Error saving category:", error);
  } finally {
    isSubmitting.value = false;
  }
};

const handleDelete = async (id: number) => {
  if (confirm("Yakin ingin menghapus kategori ini?")) {
    try {
      await deleteCategory(id);
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  }
};
</script>
