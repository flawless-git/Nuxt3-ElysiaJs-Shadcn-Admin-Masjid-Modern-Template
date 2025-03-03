import type { Transaction } from "~/types/api";

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");

  try {
    const response = await $fetch<Transaction>(
      `http://localhost:1010/transactions/${id}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response;
  } catch (error: any) {
    console.error("Error deleting transaction:", error);
    throw createError({
      statusCode: error?.statusCode || 500,
      message: error?.message || "Failed to delete transaction",
    });
  }
});
