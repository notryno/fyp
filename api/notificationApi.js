import axios from "axios";
import { BASE_URL } from "./authApi";

export const getNotification = async (userToken, courseId) => {
  try {
    const response = await axios.get(`${BASE_URL}notifications/`, {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching notifications:", error);
  }
};

export const markAllAsRead = async (token) => {
  const response = await fetch(`${BASE_URL}notifications/mark-all-read/`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    throw new Error("Failed to mark all notifications as read");
  }
  return await response.json();
};

export const markAsRead = async (token, id) => {
  const response = await fetch(`${BASE_URL}notification/${id}/`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    throw new Error("Failed to mark notification as read");
  }
  return await response.json();
};
