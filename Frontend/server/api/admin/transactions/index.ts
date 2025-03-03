interface Transaction {
  id: number;
  amount: number;
  description: string;
  date: string;
  categoryId: number;
  category: string;
}

export default defineEventHandler(async (event) => {
  try {
    const response = await $fetch<Transaction[]>(
      "http://localhost:1010/transactions",
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response;
  } catch (error) {
    console.error("Error fetching transactions:", error);
    throw createError({
      statusCode: 500,
      message: "Failed to fetch transactions",
    });
  }
});
