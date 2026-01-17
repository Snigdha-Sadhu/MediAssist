import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:7000/api", // ✅ http NOT https
  headers: {
    "Content-Type": "application/json",
  },
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  console.log(config);
  return config;
});

export default API;
