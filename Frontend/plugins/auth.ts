export default defineNuxtPlugin(async () => {
  const { checkAuth } = useAuth();

  // Check auth state on app init
  await checkAuth();
});
