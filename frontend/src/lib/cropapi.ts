import axios from "axios";
export const API_BASE = process.env.BACKEND_URL || "http://localhost:4000";
export const api = axios.create({
  baseURL: `${process.env.BACKEND_URL}/api` || "http://localhost:4000/api",
});

export const setAuthToken = (token: string | null) => {
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common["Authorization"];
  }
};

