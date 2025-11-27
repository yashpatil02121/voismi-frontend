import axios from "axios";

export const http = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

// Attach tokens automatically
http.interceptors.request.use((config) => {
  const access = localStorage.getItem("access_token");
  const refresh = localStorage.getItem("refresh_token");

  if (access) {
    config.headers["Authorization"] = `Bearer ${access}`;
  }

  if (refresh) {
    config.headers["x-refresh-token"] = refresh;
  }

  return config;
});
