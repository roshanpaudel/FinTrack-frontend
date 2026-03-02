import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { refreshAccessToken } from "../api/authApi";

const getTokenExpiry = (token) => {
  try {
    const payload = token.split(".")[1];
    if (!payload) return null;
    const decoded = JSON.parse(
      atob(payload.replace(/-/g, "+").replace(/_/g, "/"))
    );
    return decoded?.exp ? decoded.exp * 1000 : null;
  } catch {
    return null;
  }
};

export default function PrivateRoute() {
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const checkAuth = async () => {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        if (isMounted) {
          setIsAuthorized(false);
          setIsChecking(false);
        }
        return;
      }

      const expiry = getTokenExpiry(token);
      const isValid = expiry ? Date.now() < expiry - 30000 : false;
      if (isValid) {
        if (isMounted) {
          setIsAuthorized(true);
          setIsChecking(false);
        }
        return;
      }

      const refreshResponse = await refreshAccessToken();
      const newToken = refreshResponse?.accessToken;
      if (newToken) {
        localStorage.setItem("accessToken", newToken);
        if (isMounted) {
          setIsAuthorized(true);
          setIsChecking(false);
        }
      } else if (isMounted) {
        localStorage.removeItem("accessToken");
        setIsAuthorized(false);
        setIsChecking(false);
      }
    };

    checkAuth();
    return () => {
      isMounted = false;
    };
  }, []);

  if (isChecking) return null;
  if (!isAuthorized) return <Navigate to="/login" replace />;
  return <Outlet />;
}
