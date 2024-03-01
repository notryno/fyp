import axios from "axios";
import { BASE_URL } from "./authApi";

export const fetchEvents = async (userToken) => {
  try {
    const response = await axios.get(`${BASE_URL}schedules/`, {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    });

    const groupedEvents = {};

    response.data.forEach((event) => {
      const startDate = new Date(event.start_date);
      const options = {
        month: "long",
        day: "2-digit",
        year: "numeric",
        weekday: "long",
      };
      const formattedDate = startDate.toLocaleDateString("en-US", options);

      if (!groupedEvents[formattedDate]) {
        groupedEvents[formattedDate] = [];
      }

      groupedEvents[formattedDate].push({
        title: event.title,
        time: formatTime(event.start_time) + " - " + formatTime(event.end_time),
        type: event.type,
        location: event.location,
      });
    });

    const events = Object.keys(groupedEvents).map((date) => ({
      date,
      data: groupedEvents[date],
    }));

    events.sort((a, b) => new Date(a.date) - new Date(b.date));
    console.log(events);

    return events;
  } catch (error) {
    console.error("Error fetching events:", error);
    throw error;
  }
};

const formatTime = (timeString) => {
  const [hours, minutes, seconds] = timeString.split(":");
  const hours12 = parseInt(hours) % 12 || 12;
  const amPm = parseInt(hours) < 12 ? "AM" : "PM";
  return `${hours12}:${minutes}${amPm}`;
};
