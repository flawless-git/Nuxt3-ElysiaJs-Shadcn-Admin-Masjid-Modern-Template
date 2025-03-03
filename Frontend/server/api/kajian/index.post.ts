interface KajianRequest {
  name: string;
  description: string;
  date: string;
  title: string;
}

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody<KajianRequest>(event);

    const response = await $fetch("http://localhost:1010/kajian", {
      method: "POST",
      body,
      headers: {
        "Content-Type": "application/json",
      },
    });

    return response;
  } catch (error: any) {
    console.error("Error creating kajian schedule:", error);
    throw createError({
      statusCode: error?.statusCode || 500,
      message: error?.message || "Failed to create kajian schedule",
    });
  }
});
