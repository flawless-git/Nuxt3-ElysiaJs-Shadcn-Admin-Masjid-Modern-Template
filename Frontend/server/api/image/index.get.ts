import type { Image } from "~/types/api";

export default defineEventHandler(async () => {
  try {
    const response = await $fetch<Image[]>("http://localhost:1010/image");
    return response;
  } catch (error: any) {
    throw createError({
      statusCode: error?.statusCode || 500,
      message: error?.message || "Failed to fetch images",
    });
  }
});
