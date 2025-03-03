import type { KhatibSchedule } from "~/types/api";

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");

  try {
    // Get all khatib first
    const response = await $fetch<KhatibSchedule[]>(
      "http://localhost:1010/khatib",
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    // Find the specific khatib
    const khatib = response.find((k) => k.id === Number(id));

    if (!khatib) {
      throw createError({
        statusCode: 404,
        message: `Khatib with id ${id} not found`,
      });
    }

    return khatib;
  } catch (error: any) {
    console.error("Error fetching khatib schedule:", error);
    throw createError({
      statusCode: error?.statusCode || 500,
      message: error?.message || "Failed to fetch khatib schedule",
    });
  }
});
