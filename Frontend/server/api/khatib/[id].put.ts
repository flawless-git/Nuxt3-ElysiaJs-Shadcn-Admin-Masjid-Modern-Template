import type { KhatibSchedule } from "~/types/api";

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");
  const body = await readBody<KhatibSchedule>(event);

  try {
    const response = await $fetch<KhatibSchedule>(
      `http://localhost:1010/khatib/${id}`,
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
    console.error("Error updating khatib schedule:", error);
    throw createError({
      statusCode: 500,
      message: "Failed to update khatib schedule",
    });
  }
});
