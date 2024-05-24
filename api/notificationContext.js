import React, { createContext, useEffect, useState } from "react";
import { BASE_URL } from "./authApi";
import { getNotification } from "./notificationApi";
import { useAuth } from "./authContext";

export const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [newNotifications, setNewNotifications] = useState([]);
  const modifiedURL = BASE_URL.replace("http", "ws").replace(/\/api\/$/, "");

  const { userToken } = useAuth();

  useEffect(() => {
    if (!userToken) {
      return;
    }
    const fetchNotifications = async () => {
      try {
        const response = await getNotification(userToken);
        setNotifications(response);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotifications();

    const ws = new WebSocket(`${modifiedURL}/ws/notifications/`);

    ws.onopen = () => {
      console.log("WebSocket connection opened");
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setNewNotifications((prev) => [...prev, data.notification]);
      fetchNotifications();
    };

    ws.onclose = () => {
      console.log("WebSocket connection closed");
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    return () => {
      ws.close();
    };
  }, [userToken]);

  const removeNotification = (index) => {
    setNewNotifications((prev) => prev.filter((_, i) => i !== index));
  };

  const clearBanner = () => {
    setNewNotifications([]);
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        newNotifications,
        setNotifications,
        removeNotification,
        clearBanner,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
