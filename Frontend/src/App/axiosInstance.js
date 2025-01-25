import axios from "axios";

// Configure Axios instance
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BASE_URI, // Your base URL from environment variables
  withCredentials: true, // If you need to send cookies with requests
});

export default axiosInstance;
