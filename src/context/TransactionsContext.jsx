import React, { createContext, useCallback, useContext, useMemo, useState } from "react";
import {
  createTransaction as createTransactionApi,
  fetchTransactions,
} from "../api/transactionApi";

const TransactionsContext = createContext(null);

export const useTransactions = () => {
  const context = useContext(TransactionsContext);
  if (!context) {
    throw new Error("useTransactions must be used within a TransactionsProvider");
  }
  return context;
};

export function TransactionsProvider({ children }) {
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [hasLoaded, setHasLoaded] = useState(false);

  const loadTransactions = useCallback(async () => {
    setIsLoading(true);
    const response = await fetchTransactions();
    if (response?.status === "success") {
      setTransactions(response.transactions || []);
      setErrorMessage("");
    } else {
      setErrorMessage(response?.message || "Unable to load transactions.");
    }
    setIsLoading(false);
    setHasLoaded(true);
    return response;
  }, []);

  const addTransaction = useCallback(
    async (payload) => {
      setIsSubmitting(true);
      const response = await createTransactionApi(payload);
      if (response?.status === "success") {
        setErrorMessage("");
        await loadTransactions();
      } else {
        setErrorMessage(response?.message || "Unable to save transaction.");
      }
      setIsSubmitting(false);
      return response;
    },
    [loadTransactions]
  );

  const value = useMemo(
    () => ({
      transactions,
      isLoading,
      isSubmitting,
      errorMessage,
      hasLoaded,
      loadTransactions,
      addTransaction,
    }),
    [
      transactions,
      isLoading,
      isSubmitting,
      errorMessage,
      hasLoaded,
      loadTransactions,
      addTransaction,
    ]
  );

  return (
    <TransactionsContext.Provider value={value}>
      {children}
    </TransactionsContext.Provider>
  );
}
