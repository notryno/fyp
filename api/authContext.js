// authContext.js

import React, { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userToken, setUserToken] = useState(null);
  const [userProfile, setUserProfile] = useState(null);

  const signIn = (token, profile) => {
    setUserToken(token);
    setUserProfile(profile);
    console.log("Profile:", profile);
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
