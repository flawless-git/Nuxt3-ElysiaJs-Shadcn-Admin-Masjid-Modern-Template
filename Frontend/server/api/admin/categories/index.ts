interface Category {
  id: number;
  name: string;
}

export default defineEventHandler(async (event) => {
  try {
    const response = await $fetch<Category[]>(
      "http://localhost:1010/categories",
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw createError({
      statusCode: 500,
      message: "Failed to fetch categories",
    });
  }
});
