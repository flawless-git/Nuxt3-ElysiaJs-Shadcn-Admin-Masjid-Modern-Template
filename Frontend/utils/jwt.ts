import { jwtDecode } from "jwt-decode";

export interface JWTPayload {
  id: string;
  name: string;
  role: string;
  iat: number;
  exp: number;
}

export const setToken = (token: string) => {
  if (process.client) {
    localStorage.setItem("token", token);
  }
};

export const getToken = (): string | null => {
  if (process.client) {
    return localStorage.getItem("token");
  }
  return null;
};

export const removeToken = () => {
  if (process.client) {
    localStorage.removeItem("token");
  }
};

export const decodeToken = (token: string): JWTPayload | null => {
  try {
    return jwtDecode(token);
  } catch {
    return null;
  }
};

export const isTokenExpired = (token: string): boolean => {
  const decoded = decodeToken(token);
  if (!decoded) return true;
  return Date.now() >= decoded.exp * 1000;
};
