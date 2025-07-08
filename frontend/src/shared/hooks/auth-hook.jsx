import { useState, useCallback, useEffect } from "react";

let logoutTimer;

const authhook = () => {
  const [token, setToken] = useState(null);
  const [userId, setUserId] = useState(null);
  const [tokenExpirationDate, setTokenExpirationDate] = useState(null);
  const [isAuthReady, setIsAuthReady] = useState(false); // ✅ new flag

  const login = useCallback((uid, token, expirationDate) => {
   
    setToken(token);
    setUserId(uid);
    const tokenExpiry = expirationDate || new Date(new Date().getTime() + 1000 * 60 * 60);
    setTokenExpirationDate(tokenExpiry);
    localStorage.setItem(
      "userData",
      JSON.stringify({ userId: uid, token: token, expiration: tokenExpiry.toISOString() })
    );
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setUserId(null);
    setTokenExpirationDate(null);
    localStorage.removeItem("userData");
   
  }, []);

  // Auto logout setup
  useEffect(() => {
    if (token && tokenExpirationDate) {
      const remainingTime = tokenExpirationDate.getTime() - new Date().getTime();
      logoutTimer = setTimeout(logout, remainingTime);
    } else {
      clearTimeout(logoutTimer);
    }
  }, [token, logout, tokenExpirationDate]);

  // Auto login from localStorage
  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("userData"));
    if (
      storedData &&
      storedData.token &&
      new Date(storedData.expiration) > new Date()
    ) {
      login(storedData.userId, storedData.token, new Date(storedData.expiration));
    }
    setIsAuthReady(true); 
  }, [login]);

  return { token, login, logout, userId, isAuthReady };
};

export default authhook;
