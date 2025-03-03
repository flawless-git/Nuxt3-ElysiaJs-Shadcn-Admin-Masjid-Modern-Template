import type { KajianSchedule } from "~/types/api";

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");

  try {
    // Get all kajian first
    const response = await $fetch<KajianSchedule[]>(
      "http://localhost:1010/kajian",
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    // Find the specific kajian
    const kajian = response.find((k) => k.id === Number(id));

    if (!kajian) {
      throw createError({
        statusCode: 404,
        message: `Kajian with id ${id} not found`,
      });
    }

    return kajian;
  } catch (error: any) {
    console.error("Error fetching kajian schedule:", error);
    throw createError({
      statusCode: error?.statusCode || 500,
      message: error?.message || "Failed to fetch kajian schedule",
    });
  }
});
