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

export const updateTransaction = (transactionId, payload) => {
  const obj = {
    method: "PUT",
    endpoint: `transactions/${transactionId}`,
    data: payload,
  };
  return apiHelper(obj);
};

export const reassignCategory = (payload) => {
  const obj = {
    method: "PATCH",
    endpoint: "transactions/categories/reassign",
    data: payload,
  };
  return apiHelper(obj);
};
