export default defineEventHandler(async (event) => {
  // Clear any server-side session/token if needed
  return {
    success: true,
    message: "Logged out successfully",
  };
});
