export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");

  try {
    await $fetch(`http://localhost:1010/kajian/${id}`, {
      method: "DELETE",
    });
    return { success: true };
  } catch (error: any) {
    throw createError({
      statusCode: error?.statusCode || 500,
      message: error?.message || "Failed to delete kajian schedule",
    });
  }
});
