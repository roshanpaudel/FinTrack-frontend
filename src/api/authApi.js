import { apiHelper } from "./apiHelper.js";

export const checkEmail = (email) => {
  const obj = {
    method: "POST",
    endpoint: "auth/check-email",
    data: { email },
  };
  return apiHelper(obj);
};
export const insertSignupData = (userData) => {
  console.log("Data to send:", userData);
  const obj = {
    method: "POST",
    endpoint: "auth/signup",
    data: userData,
  };
  return apiHelper(obj);
};
export const loginUserCheck = (userData) => {
  console.log("Data to send:", userData);
  const obj = {
    method: "POST",
    endpoint: "auth/login",
    data: userData,
  };
  return apiHelper(obj);
};
