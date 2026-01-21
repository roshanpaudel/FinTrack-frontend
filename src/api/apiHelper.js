import axios from "axios";

const apiEP = import.meta.env.PROD
  ? "/api/v1/"
  : "http://localhost:8000/api/v1/";
export const apiHelper = async ({ method, endpoint, data }) => {
  try {
    // Codex: Attach access token when present for protected endpoints.
    const token = localStorage.getItem("accessToken");
    // Roshan: Base API request configuration.
    const response = await axios({
      method: method,
      url: apiEP + endpoint,
      data: data,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      // Codex: Send cookies for refresh token flow.
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    // Codex: Attempt a token refresh on auth failures.
    const statusCode = error?.response?.status;
    if (
      (statusCode === 401 || statusCode === 403) &&
      endpoint !== "auth/login" &&
      endpoint !== "auth/refresh"
    ) {
      try {
        const refreshResponse = await axios({
          method: "POST",
          url: apiEP + "auth/refresh",
          withCredentials: true,
        });
        const newAccessToken = refreshResponse?.data?.accessToken;
        if (newAccessToken) {
          // Codex: Persist refreshed token and retry the original request once.
          localStorage.setItem("accessToken", newAccessToken);
          const retryResponse = await axios({
            method: method,
            url: apiEP + endpoint,
            data: data,
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${newAccessToken}`,
            },
            withCredentials: true,
          });
          return retryResponse.data;
        }
      } catch (refreshError) {
        console.error("Token refresh error:", refreshError);
        return {
          status: "error",
          message: "Session expired. Please log in again.",
        };
      }
    }
    console.error("API Error:", error);
    return {
      status: "error",
      message: error.message,
    };
  }
};
