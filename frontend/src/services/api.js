import axios from "axios";
import { BASE_URL } from "./constants.js";
console.log({ BASE_URL });

const api = axios.create({
  baseURL: `${BASE_URL}`,
  withCredentials: true,
});

export const googleAuth = (code) => api.get(`/auth/google?code=${code}`);
