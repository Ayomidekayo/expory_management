import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,

  // Do not set Content-Type globally.
  // Axios will handle JSON and FormData requests appropriately.
});

api.interceptors.request.use(
  (config) => {
    // Preserve authentication.
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.set("Authorization", `Bearer ${token}`);
    }

    // Allow the browser to generate the multipart boundary for uploads.
    if (
      typeof FormData !== "undefined" &&
      config.data instanceof FormData
    ) {
      config.headers.delete("Content-Type");
    }

    return config;
  },
  (error) => Promise.reject(error),
);

export default api;