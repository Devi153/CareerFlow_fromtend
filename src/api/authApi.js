import axiosInstance from "./axiosInstance";

export async function loginUser(email, password) {
  const response = await axiosInstance.post("/api/auth/login", {
    email,
    password,
  });

  return response.data;
}

export async function registerUser(email, password) {
  const response = await axiosInstance.post("/api/auth/register", {
    email,
    password,
  });

  return response.data;
}