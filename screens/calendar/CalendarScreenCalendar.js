import React, { useEffect, useState } from "react";
import { View, StyleSheet, Text, ScrollView } from "react-native";
import { Calendar } from "react-native-calendars";
import { fetchEventsAndSpecialSchedules } from "../../api/scheduleApi";
import { useAuth } from "../../api/authContext";
import EventItem from "../../components/EventItem";
import TaskItem from "../../components/TaskItem"; // Import the TaskItem component
import { getTasks } from "../../api/taskApi";

const CalendarScreen = () => {
  const [events, setEvents] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [markedDates, setMarkedDates] = useState({});
  const [selectedEvents, setSelectedEvents] = useState([]);
  const [selectedTasks, setSelectedTasks] = useState([]); // State to store tasks for the selected date
  const [selectedDate, setSelectedDate] = useState(null); // State to store the selected date
  const { userToken } = useAuth();

  const fetchData = async () => {
    try {
      const mergedEvents = await fetchEventsAndSpecialSchedules(userToken);
      setEvents(mergedEvents);

      const response = await getTasks(userToken);
      setTasks(response);

      // Mark the dates with events
      const markedDatesObj = {};
      mergedEvents.forEach((event) => {
        // Convert event.date to the format "YYYY-MM-DD"
        const dateParts = event.date.split(", "); // Split the date string
        const monthName = dateParts[1].split(" ")[0]; // Get the month name
        const day = dateParts[1].split(" ")[1]; // Get the day
        const year = dateParts[2]; // Get the year

        // Convert the month name to its corresponding number
        const monthNumber = monthNamesToNumber[monthName];

        // Format the date as "YYYY-MM-DD"
        const formattedDate = `${year}-${monthNumber}-${day}`;

        // Add the formatted date to markedDatesObj
        markedDatesObj[formattedDate] = {
          marked: true,
          dotColor: convertHexToColorString(event.data[0].color),
        };
      });
      // Mark tasks in markedDatesObj
      tasks.forEach((task) => {
        // Convert task.due_date to the format "YYYY-MM-DD"
        const taskDate = task.due_date;
        const formattedTaskDate = new Date(taskDate)
          .toISOString()
          .split("T")[0];

        // Add task date to markedDatesObj with appropriate styling
        if (!markedDatesObj[formattedTaskDate]) {
          markedDatesObj[formattedTaskDate] = {
            marked: true,
            dotColor: "rgb(37, 132, 252)",
          };
        }
      });

      setMarkedDates(markedDatesObj);
      console.log("Marked Dates:", markedDatesObj);
    } catch (error) {
      console.error("Error fetching data inside calendar:", error);
    }
  };

  const mergeTasksAndEvents = () => {
    if (!selectedDate) {
      setSelectedEvents([]); // Clear the selected events if no date is selected
      setSelectedTasks([]); // Clear the selected tasks as well
      return;
    }

    const selectedDayEvents = events.find((eventGroup) => {
      // Convert eventGroup.date to match the format "YYYY-MM-DD"
      const dateParts = eventGroup.date.split(", "); // Split the date string
      const monthName = dateParts[1].split(" ")[0]; // Get the month name
      const day = dateParts[1].split(" ")[1]; // Get the day
      const year = dateParts[2]; // Get the year

      // Convert the month name to its corresponding number
      const monthNumber = monthNamesToNumber[monthName];

      // Format the date as "YYYY-MM-DD"
      const formattedEventDate = `${year}-${monthNumber}-${day}`;

      return formattedEventDate === selectedDate;
    });

    const filteredTasks = tasks
      .filter((task) => task.due_date === selectedDate && !task.completed)
      .sort((task1, task2) => {
        // Sort logic remains the same
        // Sort by due_time, with null times (All Day tasks) on top
        if (task1.due_time === null && task2.due_time !== null) return -1;
        if (task1.due_time !== null && task2.due_time === null) return 1;
        if (task1.due_time === null && task2.due_time === null) return 0;
        // Convert due_time strings to Date objects for comparison
        const time1 = new Date(`1970-01-01T${task1.due_time}Z`);
        const time2 = new Date(`1970-01-01T${task2.due_time}Z`);
        return time1 - time2;
      });

    const mergedData = {
      date: selectedDayEvents ? selectedDayEvents.date : selectedDate, // Use selectedDate if no events are found
      events: selectedDayEvents ? selectedDayEvents.data : [], // Empty array if no events are found
    };

    if (filteredTasks.length > 0) {
      mergedData.tasks = filteredTasks; // Set tasks only if there are tasks for the selected date
    }

    setSelectedEvents([mergedData]);
    // console.log("Merged data:", mergedData);
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (selectedDate) {
      mergeTasksAndEvents();
    }
  }, [selectedDate]);

  const convertHexToColorString = (hexColor) => {
    // Remove the "#" symbol from the hexadecimal color
    const cleanedHex = hexColor.replace("#", "");

    // Convert the hexadecimal color to RGB format
    const red = parseInt(cleanedHex.substring(0, 2), 16);
    const green = parseInt(cleanedHex.substring(2, 4), 16);
    const blue = parseInt(cleanedHex.substring(4, 6), 16);

    // Construct the color string in RGB format
    const colorString = `rgb(${red}, ${green}, ${blue})`;
    return colorString;
  };

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
    setSelectedDate(day.dateString); // Update selected date
  };

  return (
    <View style={styles.container}>
      <Calendar
        markedDates={{
          ...markedDates,
          [selectedDate]: {
            selected: true,
            selectedColor: "black",
          },
        }}
        onDayPress={handleDayPress}
        style={styles.calendar}
        theme={{ calendarBackground: "#f5f5f5" }}
      />
      {/* Wrap tasksContainer with ScrollView */}
      <ScrollView style={styles.tasksContainer}>
        {selectedEvents.length === 0 ? (
          <View style={styles.noEventContainer}>
            <Text style={styles.noEventText}>No Event</Text>
          </View>
        ) : (
          selectedEvents.map((data, index) => (
            <View key={index} style={styles.eventGroup}>
              {/* Check if mergedData.tasks exists before mapping */}
              {data.tasks &&
                data.tasks.map((task, idx) => (
                  <TaskItem
                    key={idx}
                    taskId={task.id}
                    title={task.title}
                    description={task.description}
                    dueDate={task.due_date}
                    dueTime={task.due_time}
                    markCompleted={task.completed}
                    completed={task.completed}
                  />
                ))}
              {data.events.map((event, idx) => (
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
          ))
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  calendar: {
    backgroundColor: "#fff",
  },
  tasksContainer: {
    borderTopWidth: 1,
    borderColor: "lightgray",
    paddingTop: 10,
    // marginTop: 20,
    paddingHorizontal: 15,
  },
  tasksHeader: {
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
  noEventContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noEventText: {
    fontSize: 20,
    fontWeight: "bold",
  },
});

export default CalendarScreen;
