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
      const dayOfWeek = event.day_of_week; // get the day of the week for the event

      let instanceDate = new Date(startDate);

      // Find the starting day that matches the day of the week
      while (instanceDate.getDay() !== dayOfWeek) {
        instanceDate.setDate(instanceDate.getDate() + 1);
      }

      // Push instances of the event
      for (let i = 0; i < numberOfInstances; i++) {
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

        // Increase the instance date based on frequency per week
        instanceDate.setDate(instanceDate.getDate() + frequencyPerWeek * 7);
      }
    });

    console.log("events", events);
    // Sort events by date
    events.sort((a, b) => new Date(a.date) - new Date(b.date));

    console.log("events", events);

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

  // Convert groupedEvents object to array and sort by date
  const sortedGroupedEvents = Object.keys(groupedEvents)
    .sort((a, b) => {
      // Manually parse date strings into a format that JavaScript can understand
      const dateA = new Date(Date.parse(a.replace(/,/g, "")));
      const dateB = new Date(Date.parse(b.replace(/,/g, "")));
      return dateA - dateB;
    })
    .map((date) => ({
      date,
      data: groupedEvents[date].sort((a, b) => {
        // Extract time from the event objects and convert to 24-hour format for comparison
        const [hoursA, minutesA] = a.time.split(" ")[0].split(":").map(Number);
        const [hoursB, minutesB] = b.time.split(" ")[0].split(":").map(Number);

        // Handle cases where minutes are zero
        const timeA = hoursA * 60 + (minutesA || 0);
        const timeB = hoursB * 60 + (minutesB || 0);
        return timeA - timeB;
      }),
    }));

  return sortedGroupedEvents;
};
