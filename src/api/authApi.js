import { apiHelper } from "./apiHelper.js";

export const checkEmail = (email) => {
  const obj = {
    method: "POST",
    endpoint: "auth/check-email",
    data: { email },
  };
  return apiHelper(obj);
};
