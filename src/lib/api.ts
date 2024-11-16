import axios from "axios";

//FIXME handle 401 cookie expired
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 300000,
  withCredentials: true,
});

export default api;
