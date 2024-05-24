import React, { createContext, useContext, useState, useEffect } from "react";
import { getTasks } from "./taskApi";
import { refreshAccess } from "./authApi";
import base64 from "base-64";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userToken, setUserToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [isStaff, setIsStaff] = useState(false);

  useEffect(() => {
    const isTokenExpired = () => {
      if (!userToken) return true;
      const tokenExpiration = decodeToken(userToken).exp;
      console.log("Token expiration:", new Date(tokenExpiration * 1000));
      return Date.now() >= tokenExpiration * 1000;
    };

    const refreshAccessToken = async () => {
      try {
        const response = await refreshAccess(refreshToken);
        setUserToken(response.access);
        console.log("Access token refreshed:", response.access);
      } catch (error) {
        console.error("Error refreshing access token:", error);
        signOut();
      }
    };

    if (isTokenExpired()) {
      if (userToken) refreshAccessToken();
    }
    const tokenExpirationCheckInterval = setInterval(() => {
      if (isTokenExpired()) {
        refreshAccessToken();
      }
    }, 15 * 60 * 1000); // Check token expiration every 15 minutes

    return () => clearInterval(tokenExpirationCheckInterval);
  }, [userToken]);

  const decodeToken = (token) => {
    const payload = token.split(".")[1];
    return JSON.parse(base64.decode(payload));
  };

  const signIn = async (token, refreshToken, profile, is_staff) => {
    setUserToken(token);
    setRefreshToken(refreshToken);
    setUserProfile(profile);
    setIsStaff(is_staff);

    try {
      const response = await getTasks(token);
      // console.log("Tasks after sign in:", response);
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
    <AuthContext.Provider
      value={{ userToken, refreshToken, userProfile, isStaff, signIn, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
