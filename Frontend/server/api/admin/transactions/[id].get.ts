import type { Transaction } from "~/types/api";

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");

  try {
    // Get all transactions first
    const response = await $fetch<Transaction[]>(
      "http://localhost:1010/transactions",
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    // Find specific transaction
    const transaction = response.find((t) => t.id === Number(id));

    if (!transaction) {
      throw createError({
        statusCode: 404,
        message: `Transaction with id ${id} not found`,
      });
    }

    return transaction;
  } catch (error: any) {
    console.error("Error fetching transaction:", error);
    throw createError({
      statusCode: error?.statusCode || 500,
      message: error?.message || "Failed to fetch transaction",
    });
  }
});
