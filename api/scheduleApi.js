import axios from "axios";
import { BASE_URL } from "./authApi";

export const fetchEvents = async (userToken) => {
  try {
    const response = await axios.get(`${BASE_URL}schedules/`, {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    });

    const events = [];

    response.data.forEach((event) => {
      const startDate = new Date(event.start_date);
      const options = {
        month: "long",
        day: "2-digit",
        year: "numeric",
        weekday: "long",
      };
      const formattedDate = startDate.toLocaleDateString("en-US", options);

      const frequencyPerWeek = event.frequency_per_week || 1;
      const numberOfInstances = event.number_of_instances || 1;

      // Calculate and push instances of the event
      for (let i = 0; i < numberOfInstances; i++) {
        const instanceDate = new Date(startDate);
        instanceDate.setDate(startDate.getDate() + i * 7 * frequencyPerWeek);
        const instanceFormattedDate = instanceDate.toLocaleDateString(
          "en-US",
          options
        );

        events.push({
          date: instanceFormattedDate,
          title: event.title,
          time:
            formatTime(event.start_time) + " - " + formatTime(event.end_time),
          type: event.type,
          location: event.location,
          color: event.color,
        });
      }
    });

    // Sort events by date
    events.sort((a, b) => new Date(a.date) - new Date(b.date));
    console.log(events);

    return groupEventsByDate(events);
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

const groupEventsByDate = (events) => {
  // Group events by date
  const groupedEvents = {};
  events.forEach((event) => {
    if (!groupedEvents[event.date]) {
      groupedEvents[event.date] = [];
    }
    groupedEvents[event.date].push(event);
  });

  // Convert groupedEvents object to array
  return Object.keys(groupedEvents).map((date) => ({
    date,
    data: groupedEvents[date],
  }));
};
