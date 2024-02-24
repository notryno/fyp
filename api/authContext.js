// authContext.js

import React, { createContext, useContext, useState } from "react";
import { getTasks } from "./taskApi";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userToken, setUserToken] = useState(null);
  const [userProfile, setUserProfile] = useState(null);

  const signIn = async (token, profile) => {
    setUserToken(token);
    setUserProfile(profile);

    try {
      const response = await getTasks(token);
      // You can handle the tasks data as needed
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
