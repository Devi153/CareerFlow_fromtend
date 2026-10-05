import axiosInstance from "./axiosInstance";

let interceptorsInitialized = false;

export function setupAxiosInterceptors() {
  // Prevent duplicate interceptor registration
  if (interceptorsInitialized) {
    return;
  }

  interceptorsInitialized = true;

  // ==============================
  // REQUEST INTERCEPTOR
  // ==============================
  axiosInstance.interceptors.request.use(
    (config) => {
      const requestUrl = config.url || "";

      /*
       * Authentication endpoints must NOT receive
       * an existing JWT.
       *
       * Otherwise an expired JWT stored in localStorage
       * can be sent during login/register.
       */
      const isAuthenticationRequest =
        requestUrl.includes("/api/auth/login") ||
        requestUrl.includes("/api/auth/register");

      if (isAuthenticationRequest) {
        return config;
      }

      const token = localStorage.getItem("token");

      if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
      }

      return config;
    },

    (error) => {
      return Promise.reject(error);
    }
  );

  // ==============================
  // RESPONSE INTERCEPTOR
  // ==============================
  axiosInstance.interceptors.response.use(
    (response) => {
      return response;
    },

    (error) => {
      const status = error?.response?.status;
      const requestUrl = error?.config?.url || "";

      const isLoginRequest =
        requestUrl.includes("/api/auth/login");

      const isRegisterRequest =
        requestUrl.includes("/api/auth/register");

      /*
       * A 401 during login/register means the authentication
       * request itself failed.
       *
       * Do not redirect automatically from here.
       */
      const isAuthenticationRequest =
        isLoginRequest || isRegisterRequest;

      if (status === 401 && !isAuthenticationRequest) {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        localStorage.removeItem("user");

        if (window.location.pathname !== "/login") {
          window.location.href = "/login";
        }
      }

      return Promise.reject(error);
    }
  );
}