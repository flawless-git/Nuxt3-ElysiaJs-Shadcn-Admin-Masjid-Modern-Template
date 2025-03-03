import type { LoginRequest } from "~/types/api";

export default defineEventHandler(async (event) => {
  const body = await readBody<LoginRequest>(event);

  try {
    const response = await $fetch("http://localhost:1010/auth/login", {
      method: "POST",
      body: {
        identifier: body.email, // Support both email/username
        password: body.password,
      },
      headers: {
        "Content-Type": "application/json",
      },
    });

    return response;
  } catch (error: any) {
    console.error("Login error:", error);
    throw createError({
      statusCode: error?.statusCode || 401,
      message: error?.message || "Invalid credentials",
    });
  }
});
