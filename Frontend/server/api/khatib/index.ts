import type { KhatibSchedule } from "~/types/api";

export default defineEventHandler(async (event) => {
  try {
    // console.log("Fetching khatib schedules...");
    const response = await $fetch<KhatibSchedule[]>(
      "http://localhost:1010/khatib",
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    // console.log("Khatib schedules:", response);
    return response;
  } catch (error) {
    console.error("Error fetching khatib schedules:", error);
    throw createError({
      statusCode: 500,
      message: "Failed to fetch khatib schedules",
    });
  }
});
