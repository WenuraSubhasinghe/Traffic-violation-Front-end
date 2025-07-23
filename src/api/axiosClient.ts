import axios from "axios";

const axiosClient = axios.create({
  baseURL: "http://127.0.0.1:8000", // FastAPI backend URL
});

export default axiosClient;
