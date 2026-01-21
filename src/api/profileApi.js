import { apiHelper } from "./apiHelper.js";

export const fetchProfile = () => {
  const obj = {
    method: "GET",
    endpoint: "profile",
  };
  return apiHelper(obj);
};

export const updateProfile = (payload) => {
  const obj = {
    method: "PUT",
    endpoint: "profile",
    data: payload,
  };
  return apiHelper(obj);
};
