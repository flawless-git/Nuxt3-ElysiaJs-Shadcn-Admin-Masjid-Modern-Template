export default defineNuxtRouteMiddleware((to) => {
  const { isAuthenticated, checkAuth } = useAuth();

  if (!isAuthenticated.value && !checkAuth()) {
    return navigateTo("/login");
  }
});
