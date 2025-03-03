import type { Transaction } from "~/types/api";

interface TransactionUpdateRequest {
  amount: number;
  description: string;
  categoryId: number;
}

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");
  const body = await readBody(event);

  try {
    // Format data sesuai ekspektasi API
    const payload: TransactionUpdateRequest = {
      amount: Number(body.amount),
      description: body.description,
      categoryId: Number(body.categoryId),
    };

    const response = await $fetch(`http://localhost:1010/transactions/${id}`, {
      method: "PUT",
      body: payload,
      headers: {
        "Content-Type": "application/json",
      },
    });

    return response;
  } catch (error: any) {
    console.error("Error updating transaction:", error);
    throw createError({
      statusCode: error?.statusCode || 500,
      message: error?.message || "Failed to update transaction",
    });
  }
});
