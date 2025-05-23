import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:5196",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (
      err.response?.status === 401 &&
      !err.config.url?.includes("/auth/login")
    ) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(err);
  },
);
export function getErrorMessage(err: unknown, fallback: string): string {
  if (typeof err === "object" && err !== null && "response" in err) {
    const res = (err as { response?: { data?: { message?: string } } })
      .response;
    if (res?.data?.message) return res.data.message;
  }
  return fallback;
}

export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function formatTime(time: string): string {
  return time.slice(0, 5);
}

export default api;
