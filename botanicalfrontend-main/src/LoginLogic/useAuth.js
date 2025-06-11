import { jwtDecode } from "jwt-decode";

export function useAuth() {
  const token = localStorage.getItem("jwtToken");
  if (!token) return null;

  try {
    const decoded = jwtDecode(token);
    return {
      username: decoded.sub || decoded.username,
      roles: decoded.roles || [],
      exp: decoded.exp,
    };
  } catch {
    return null;
  }
}
