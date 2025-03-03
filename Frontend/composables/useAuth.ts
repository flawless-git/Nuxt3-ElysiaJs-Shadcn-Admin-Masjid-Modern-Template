import { ref } from "vue";
import {
  getToken,
  setToken,
  removeToken,
  decodeToken,
  type JWTPayload,
} from "~/utils/jwt";

interface LoginResponse {
  id: number;
  username: string;
  email: string;
}

interface LoginRequest {
  email: string;
  password: string;
}

export const useAuth = () => {
  const user = useState<JWTPayload | null>("auth:user", () => null);
  const isAuthenticated = useState("auth:isAuthenticated", () => {
    if (process.client) {
      const token = getToken();
      return !!token;
    }
    return false;
  });
  const isLoading = ref(false);
  const error = ref("");

  const login = async (email: string, password: string) => {
    try {
      isLoading.value = true;
      error.value = "";

      const response = await $fetch<LoginResponse>("/api/auth/login", {
        method: "POST",
        body: { email, password } as LoginRequest,
      });

      if (response.id) {
        // Create token from response data
        const token = btoa(JSON.stringify(response));
        setToken(token);

        const userData = {
          id: response.id.toString(),
          name: response.username,
          role: "admin",
          iat: Date.now(),
          exp: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
        };

        user.value = userData;
        isAuthenticated.value = true;
        return true;
      }

      error.value = "Login gagal";
      return false;
    } catch (err) {
      console.error("Login error:", err);
      error.value = "Terjadi kesalahan";
      return false;
    } finally {
      isLoading.value = false;
    }
  };

  const logout = () => {
    try {
      // No need to call server endpoint for now
      removeToken(); // Use removeToken instead of localStorage directly
      user.value = null;
      isAuthenticated.value = false;

      // Redirect to login
      navigateTo("/login");
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  const checkAuth = () => {
    const token = getToken();
    if (!token) {
      return false;
    }
    const decoded = decodeToken(token);
    if (decoded && decoded.exp > Date.now()) {
      user.value = decoded;
      isAuthenticated.value = true;
      return true;
    }
    logout();
    return false;
  };

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    logout,
    checkAuth,
  };
};
