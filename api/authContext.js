import React, { createContext, useContext, useState, useEffect } from "react";
import { getTasks } from "./taskApi";
import base64 from "base-64";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userToken, setUserToken] = useState(null);
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    const isTokenExpired = () => {
      if (!userToken) return true;
      const tokenExpiration = decodeToken(userToken).exp;
      console.log("Token expiration:", new Date(tokenExpiration * 1000));
      return Date.now() >= tokenExpiration * 1000;
    };

    if (isTokenExpired()) {
      signOut();
    }
  }, [userToken]);

  const decodeToken = (token) => {
    const payload = token.split(".")[1];
    return JSON.parse(base64.decode(payload));
  };

  const signIn = async (token, profile) => {
    setUserToken(token);
    setUserProfile(profile);

    try {
      const response = await getTasks(token);
      console.log("Tasks after sign in:", response);
    } catch (error) {
      console.error("Error fetching tasks after sign in:", error);
    }

    console.log("Signed in UserProfile:", profile);
    console.log("Sign in Token:", token);
  };

  const signOut = () => {
    setUserToken(null);
    setUserProfile(null);
    console.log("User logged out");
  };

  return (
    <AuthContext.Provider value={{ userToken, userProfile, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
