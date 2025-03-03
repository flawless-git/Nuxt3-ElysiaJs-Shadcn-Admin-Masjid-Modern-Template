interface KhatibRequest {
  name: string;
  description: string;
  date: string;
  title: string;
}

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody<KhatibRequest>(event);

    const response = await $fetch("http://localhost:1010/khatib", {
      method: "POST",
      body,
      headers: {
        "Content-Type": "application/json",
      },
    });

    return response;
  } catch (error: any) {
    console.error("Error creating khatib schedule:", error);
    throw createError({
      statusCode: error?.statusCode || 500,
      message: error?.message || "Failed to create khatib schedule",
    });
  }
});
