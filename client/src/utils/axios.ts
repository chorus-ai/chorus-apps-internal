import axios from "axios";

// Send cookies with every request (needed for httpOnly auth cookie)
axios.defaults.withCredentials = true;

// On 401 responses, redirect to signin (except for session-check calls)
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const url = error.config?.url || "";
      // Don't redirect on the session restore call — let the caller handle it
      if (url.includes("/auth/me")) {
        return Promise.reject(error);
      }
      const path = window.location.pathname;
      if (!path.startsWith("/signin") && !path.startsWith("/signup") && !path.startsWith("/resetpassword")) {
        window.location.href = "/signin";
      }
    }
    return Promise.reject(error);
  }
);

export default axios;
