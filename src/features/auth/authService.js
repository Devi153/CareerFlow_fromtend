import { jwtDecode } from "jwt-decode";
import { loginUser, registerUser } from "../../api/authApi";

export async function login(email, password) {
  const response = await loginUser(email, password);

  const token = response.accessToken;

  if (!token) {
    throw new Error("Authentication token was not returned by the server.");
  }

  const decodedToken = jwtDecode(token);

  const role = decodedToken.role;

  if (role !== "ADMIN" && role !== "STUDENT") {
    throw new Error("Invalid user role received from authentication server.");
  }

  const user = {
    userId: decodedToken.userId,
    email: decodedToken.sub,
    role,
  };

  localStorage.setItem("token", token);
  localStorage.setItem("role", role);
  localStorage.setItem("user", JSON.stringify(user));

  return {
    token,
    role,
    user,
    expiresIn: response.expiresIn,
    tokenType: response.tokenType,
  };
}

export async function register(email, password) {
  return registerUser(email, password);
}

export function getStoredToken() {
  return localStorage.getItem("token");
}

export function getStoredRole() {
  return localStorage.getItem("role");
}

export function getStoredUser() {
  const user = localStorage.getItem("user");

  if (!user) {
    return null;
  }

  try {
    return JSON.parse(user);
  } catch {
    return null;
  }
}

export function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("role");
  localStorage.removeItem("user");
}