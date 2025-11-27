import axios from "axios";

const apiEP = import.meta.env.PROD
  ? "/api/v1/"
  : "http://localhost:8000/api/v1/";

// set Authorization header from storage (if available)
const token = localStorage.getItem("accessToken");
if (token) axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

// response interceptor: try refresh on 401
axios.interceptors.response.use(
  (res) => res,
  async (err) => {
    const originalReq = err.config;
    if (err.response?.status === 401 && !originalReq._retry) {
      originalReq._retry = true;
      try {
        // refresh token is stored as httpOnly cookie by server
        const refreshRes = await axios.post(
          apiEP + "auth/refresh",
          null,
          { withCredentials: true }
        );
        const newToken = refreshRes.data.accessToken;
        if (newToken) {
          localStorage.setItem("accessToken", newToken);
          axios.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;
          originalReq.headers["Authorization"] = `Bearer ${newToken}`;
          return axios(originalReq);
        }
      } catch (refreshErr) {
        // refresh failed -> fall through
        localStorage.removeItem("accessToken");
      }
    }
    return Promise.reject(err);
  }
);

export const apiHelper = async ({ method, endpoint, data }) => {
  try {
    const response = await axios({
      method,
      url: apiEP + endpoint,
      data,
      headers: { "Content-Type": "application/json" },
      withCredentials: true, // ensure cookies (refresh) are sent
    });
    return response.data;
  } catch (error) {
    console.error("API Error:", error);
    return {
      status: "error",
      message: error.message,
      response: error.response?.data,
    };
  }
};
