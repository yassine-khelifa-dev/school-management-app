import axios from "axios";

export const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api", //import.meta.env.VITE_API_URL,
  timeout: 5000,
  headers: {
    Accept: "application/json",
  },
});

api.interceptors.request.use((config) => {
  const storedUser = localStorage.getItem("user");

  if (storedUser) {
    const user = JSON.parse(storedUser);

    if (user.token) {
      config.headers.set("Authorization", `Bearer ${user.token}`);
    }
  }

  return config;
});
