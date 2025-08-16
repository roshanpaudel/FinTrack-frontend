import axios from "axios";

const apiEP = import.meta.env.PROD ? "/api/v1/" : "localhost:8000/api/v1/";
const apiHelper = (method, data) => {
  try {
    const response = axios({
      method: method,
      url: apiEP,
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
