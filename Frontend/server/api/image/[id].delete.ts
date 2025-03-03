export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");

  try {
    await $fetch(`http://localhost:1010/image/${id}`, {
      method: "DELETE" as const,
    });
    return { success: true };
  } catch (error: any) {
    throw createError({
      statusCode: error?.statusCode || 500,
      message: error?.message || "Failed to delete image",
    });
  }
});
