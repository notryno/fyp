import React, { useEffect, useState } from "react";
import { View, StyleSheet, Text } from "react-native";
import { Calendar } from "react-native-calendars";
import { useNavigation } from "@react-navigation/native";
import { fetchEventsAndSpecialSchedules } from "../../api/scheduleApi";
import { useAuth } from "../../api/authContext";
import EventItem from "../../components/EventItem";
import { getTasks } from "../../api/taskApi";

const CalendarScreen = () => {
  const [events, setEvents] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [markedDates, setMarkedDates] = useState({});
  const [selectedEvents, setSelectedEvents] = useState([]);
  const { userToken } = useAuth();

  const fetchData = async () => {
    try {
      const mergedEvents = await fetchEventsAndSpecialSchedules(userToken);
      setEvents(mergedEvents);

      const response = await getTasks(userToken);
      setTasks(response);
      console.log("response calendar", response);

      // Mark the dates with events
      const markedDatesObj = {};
      mergedEvents.forEach((event) => {
        markedDatesObj[event.date] = { marked: true };
      });
      setMarkedDates(markedDatesObj);
    } catch (error) {
      console.error("Error fetching data inside calendar:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const monthNamesToNumber = {
    January: "01",
    February: "02",
    March: "03",
    April: "04",
    May: "05",
    June: "06",
    July: "07",
    August: "08",
    September: "09",
    October: "10",
    November: "11",
    December: "12",
  };

  const handleDayPress = (day) => {
    // Format the selected day to match day.dateString format (YYYY-MM-DD)
    const selectedDate = new Date(day.timestamp); // Convert timestamp to Date object
    const formattedDate = selectedDate.toISOString().split("T")[0]; // Format as YYYY-MM-DD

    // Filter events for the selected day
    const filteredEvents = events.filter((event) => {
      const [, monthName, eventDay, year] =
        event.date.match(/(\w+) (\d+), (\d+)/); // Using regular expression
      const month = monthNamesToNumber[monthName]; // Convert month name to numerical representation
      const formattedEventDate = `${year}-${month}-${eventDay}`;

      // Compare the formatted event date with formattedDate
      return formattedEventDate === formattedDate;
    });

    setSelectedEvents(filteredEvents);
  };

  return (
    <View style={styles.container}>
      <Calendar markedDates={markedDates} onDayPress={handleDayPress} />
      <View style={styles.eventsContainer}>
        {selectedEvents.map((group, index) => (
          <View key={index} style={styles.eventGroup}>
            <Text style={styles.dateText}>{group.date}</Text>
            {group.data.map((event, idx) => (
              <EventItem
                key={idx}
                title={event.title}
                time={event.time}
                type={event.type}
                location={event.location}
                color={event.color}
              />
            ))}
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  eventsContainer: {
    flex: 1,
    marginTop: 40,
    paddingHorizontal: 20,
  },
  eventsHeader: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  eventGroup: {
    marginBottom: 20,
  },
  dateText: {
    fontWeight: "bold",
    marginBottom: 10,
    fontSize: 18,
  },
});

export default CalendarScreen;
