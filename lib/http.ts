import axios from "axios";

export const http = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

http.interceptors.request.use((config) => {
  if (typeof window === "undefined") return config; // SSR FIX

  const access = localStorage.getItem("access_token");
  const refresh = localStorage.getItem("refresh_token");

  if (access) config.headers["Authorization"] = `Bearer ${access}`;
  if (refresh) config.headers["x-refresh-token"] = refresh;

  return config;
});
