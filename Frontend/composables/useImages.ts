import type { Image } from "~/types/api";

export const useImages = () => {
  const { data: images, refresh: refreshImages } =
    useFetch<Image[]>("/api/image");

  const uploadOrUpdateImage = async (
    file: File,
    name: string,
    existingId?: number
  ) => {
    try {
      const formData = new FormData();
      formData.append("image", file);
      formData.append("name", name);

      if (existingId) {
        // Update existing image
        await $fetch(`/api/image/${existingId}`, {
          method: "PUT",
          body: formData,
        });
      } else {
        // Upload new image
        await $fetch("/api/image/upload", {
          method: "POST",
          body: formData,
        });
      }
      refreshImages();
    } catch (error) {
      console.error("Error uploading/updating image:", error);
      throw error;
    }
  };

  const deleteImage = async (id: number) => {
    try {
      await $fetch(`/api/image/${id}`, {
        method: "DELETE",
      });
      refreshImages();
    } catch (error) {
      console.error("Error deleting image:", error);
      throw error;
    }
  };

  return {
    images,
    refreshImages,
    uploadOrUpdateImage,
    deleteImage,
  };
};
