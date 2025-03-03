import type { Category } from "~/types/api";

export const useCategories = () => {
  const { data: categories, refresh: refreshCategories } = useFetch<Category[]>(
    "/api/admin/categories"
  );

  const createCategory = async (data: Partial<Category>) => {
    try {
      await $fetch("/api/admin/categories", {
        method: "POST",
        body: data,
      });
      refreshCategories();
    } catch (error) {
      console.error("Error creating category:", error);
      throw error;
    }
  };

  const updateCategory = async (id: number, data: Partial<Category>) => {
    try {
      await $fetch(`/api/admin/categories/${id}`, {
        method: "PUT",
        body: data,
      });
      refreshCategories();
    } catch (error) {
      console.error("Error updating category:", error);
      throw error;
    }
  };

  const deleteCategory = async (id: number) => {
    try {
      await $fetch(`/api/admin/categories/${id}`, {
        method: "DELETE",
      });
      refreshCategories();
    } catch (error) {
      console.error("Error deleting category:", error);
      throw error;
    }
  };

  return {
    categories,
    refreshCategories,
    createCategory,
    updateCategory,
    deleteCategory,
  };
};
