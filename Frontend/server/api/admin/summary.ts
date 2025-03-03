interface SummaryResponse {
  date: string;
  income: {
    categories: Record<
      string,
      {
        categoryName: string;
        total: number;
        transactions: any[];
      }
    >;
    total: number;
  };
  expense: {
    categories: Record<
      string,
      {
        categoryName: string;
        total: number;
        transactions: any[];
      }
    >;
    total: number;
  };
  currentBalance: number;
}

export default defineEventHandler(async (event) => {
  try {
    const response = await $fetch<SummaryResponse>(
      "http://localhost:1010/summary",
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response;
  } catch (error) {
    console.error("Error fetching summary:", error);
    throw createError({
      statusCode: 500,
      message: "Failed to fetch summary",
    });
  }
});
