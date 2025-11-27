import axios from "axios";

const apiEP = import.meta.env.PROD
  ? "/api/v1/"
  : "http://localhost:8000/api/v1/";
export const apiHelper = async ({ method, endpoint, data }) => {
  try {
    const response = await axios({
      method: method,
      url: apiEP + endpoint,
      data: data,
      headers: { "Content-Type": "application/json" },
    });
    return response.data;
  } catch (error) {
    console.error("API Error:", error);
    return {
      status: "error",
      message: error.message,
    };
  }
};
