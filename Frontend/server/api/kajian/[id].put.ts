import type { KajianSchedule } from "~/types/api";

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");
  const body = await readBody<KajianSchedule>(event);

  try {
    const response = await $fetch<KajianSchedule>(
      `http://localhost:1010/kajian/${id}`,
      {
        method: "PUT",
        body,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response;
  } catch (error) {
    console.error("Error updating kajian schedule:", error);
    throw createError({
      statusCode: 500,
      message: "Failed to update kajian schedule",
    });
  }
});
