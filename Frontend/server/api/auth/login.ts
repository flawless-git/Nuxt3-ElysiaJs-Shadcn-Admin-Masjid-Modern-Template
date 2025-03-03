interface LoginResponse {
  token: string;
}

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  try {
    const response = await $fetch<LoginResponse>(
      "http://localhost:1010/auth/login",
      {
        method: "POST",
        body,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response;
  } catch (error) {
    throw createError({
      statusCode: 401,
      message: "Login failed",
    });
  }
});
