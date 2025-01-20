import axios from "axios";

const api = axios.create({
  baseURL: "https://anywork-backend.onrender.com/api", // Adjusted to your backend URL
});

// Add the token to headers for every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken"); // Use the correct key name
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
