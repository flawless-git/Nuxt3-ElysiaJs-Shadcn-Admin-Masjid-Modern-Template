interface TransactionRequest {
  amount: number;
  description: string;
  categoryId: string;
}

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody<TransactionRequest>(event);

    // Validasi input
    if (!body.amount || !body.description || !body.categoryId) {
      throw createError({
        statusCode: 400,
        message: "All fields are required",
      });
    }

    // Format data sesuai API
    const payload = {
      amount: Number(body.amount),
      description: body.description,
      categoryId: Number(body.categoryId),
      userId: 1, // Hardcode untuk sementara, idealnya dari token
    };

    const response = await $fetch("http://localhost:1010/transactions", {
      method: "POST",
      body: payload,
      headers: {
        "Content-Type": "application/json",
      },
    });

    return response;
  } catch (error: any) {
    // Type assertion untuk error
    console.error("Error creating transaction:", error);
    throw createError({
      statusCode: error?.statusCode || 500,
      message: error?.message || "Failed to create transaction",
    });
  }
});
