import { apiHelper } from "./apiHelper.js";

export const fetchTransactions = () => {
  const obj = {
    method: "GET",
    endpoint: "transactions",
  };
  return apiHelper(obj);
};

export const createTransaction = (payload) => {
  const obj = {
    method: "POST",
    endpoint: "transactions",
    data: payload,
  };
  return apiHelper(obj);
};
