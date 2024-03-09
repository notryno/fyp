import axios from "axios";
import { BASE_URL } from "./authApi";

export const fetchEventsAndSpecialSchedules = async (userToken) => {
  try {
    const eventData = await fetchEvents(userToken);
    const specialScheduleData = await fetchSpecialSchedules(userToken);

    console.log("response", eventData);
    console.log("response2", specialScheduleData);

    // Merge regular events and special schedules
    const mergedEvents =
      specialScheduleData.length > 0
        ? mergeEvents(eventData, specialScheduleData)
        : eventData;

    return mergedEvents;
  } catch (error) {
    console.error("Error fetching events and special schedules:", error);
    throw error;
  }
};

const mergeEvents = (events, specialSchedules) => {
  // Create a copy of events to avoid mutating the original array
  const mergedEvents = [...events];
  console.log("mergedEventsFIRST", mergedEvents);

  // Iterate over each special schedule
  specialSchedules.forEach((specialSchedule) => {
    const specialDate = new Date(specialSchedule.special_date);
    const options = {
      year: "numeric",
      month: "long",
      day: "2-digit",
      weekday: "long",
    };
    const formattedDate = specialDate.toLocaleDateString("en-US", options);

    console.log(specialSchedule.title);
    console.log(specialSchedule.start_time);
    console.log(specialSchedule.end_time);
    console.log(specialSchedule.location);
    console.log(specialSchedule.type);

    // Find if an event with the same date exists
    // Find if an event with the same date and title exists
    const existingEventIndex = mergedEvents.findIndex(
      (event) =>
        event.date === formattedDate &&
        event.data[0].title === specialSchedule.schedule.title
    );

    console.log(existingEventIndex);

    // If an event with the same date exists
    if (existingEventIndex !== -1) {
      // Add data from the special schedule instead of the original event
      mergedEvents[existingEventIndex].data[0].time =
        formatTime(specialSchedule.start_time) +
        " - " +
        formatTime(specialSchedule.end_time);
      mergedEvents[existingEventIndex].data[0].location =
        specialSchedule.location;
      mergedEvents[existingEventIndex].data[0].type = specialSchedule.type;
    } else {
      // If no event with the same date exists, create a new event object with the special schedule data

      const existingEvent = mergedEvents.find(
        (event) => event.title === specialSchedule.title
      );
      console.log("existingEvent", existingEvent);
      const specialDate = new Date(specialSchedule.special_date);
      const options = {
        month: "long",
        day: "2-digit",
        year: "numeric",
        weekday: "long",
      };
      const formattedDate = specialDate.toLocaleDateString("en-US", options);
      mergedEvents.push({
        date: formattedDate,
        data: [
          {
            title: specialSchedule.schedule.title,
            time:
              formatTime(specialSchedule.start_time) +
              " - " +
              formatTime(specialSchedule.end_time),
            type: specialSchedule.type,
            location: specialSchedule.location,
            color: specialSchedule.schedule.color,
          },
        ],
      });
    }
  });

  console.log("mergedEventssadadads", mergedEvents);

  const convertedEvents = convertToNewFormat(mergedEvents);

  console.log("convertedEvents", convertedEvents);

  return groupEventsByDate(convertedEvents);
};

export const fetchEvents = async (userToken) => {
  try {
    const response = await axios.get(`${BASE_URL}schedules/`, {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    });

    if (!response.data || !Array.isArray(response.data)) {
      throw new Error("Invalid response data format");
    }

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

    // Sort events by date
    events.sort((a, b) => new Date(a.date) - new Date(b.date));

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

const convertToNewFormat = (mergedEvents) => {
  return mergedEvents.map((event) => ({
    color: event.data[0].color,
    date: event.date,
    location: event.data[0].location,
    time: event.data[0].time,
    title: event.data[0].title,
    type: event.data[0].type,
  }));
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

  console.log("groupedEvents", groupedEvents);

  // Convert groupedEvents object to array and sort by date
  const sortedGroupedEvents = Object.keys(groupedEvents)
    .sort((a, b) => {
      const dateA = new Date(Date.parse(a.replace(/,/g, "")));
      const dateB = new Date(Date.parse(b.replace(/,/g, "")));
      return dateA - dateB;
    })
    .map((date) => ({
      date,
      data: groupedEvents[date].sort((a, b) => {
        // Extract start time from the event objects and convert to a comparable format
        const startTimeA = extractTime(a.time);
        const startTimeB = extractTime(b.time);
        return startTimeA - startTimeB;
      }),
    }));

  // sortedGroupedEvents.forEach((event) => {
  //   console.log("Date:", event.date);
  //   event.data.forEach((data) => {
  //     console.log("Data:", data);
  //     // Log individual properties if needed
  //     console.log("Title:", data.title);
  //     console.log("Time:", data.time);
  //     console.log("Type:", data.type);
  //     console.log("Location:", data.location);
  //     console.log("Color:", data.color);
  //   });
  // });

  return sortedGroupedEvents;
};

const extractTime = (timeString) => {
  // Split the time string to get the start time part
  const [startTime] = timeString.split(" - ");
  // Parse the start time string to get hours and minutes
  const [hours, minutes, period] = startTime.split(/:| /).map(Number);
  // Convert to 24-hour format
  const hours24 = period === 12 ? hours : hours + (period === 1 ? 12 : 0);
  // Return minutes since midnight
  return hours24 * 60 + minutes;
};

export const fetchSpecialSchedules = async (userToken) => {
  try {
    const response = await axios.get(`${BASE_URL}special-schedules/`, {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    });

    return response.data.map((specialSchedule) => ({
      ...specialSchedule,
      schedule: {
        ...specialSchedule.schedule,
      },
    }));
  } catch (error) {
    console.error("Error fetching special schedules:", error);
    throw error;
  }
};

export const createSpecialSchedule = async (userToken, specialScheduleData) => {
  try {
    const response = await axios.post(
      `${BASE_URL}special-schedules/`,
      specialScheduleData,
      {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error creating special schedule:", error);
    throw error;
  }
};
