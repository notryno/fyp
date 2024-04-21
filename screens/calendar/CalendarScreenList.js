import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { fetchEventsAndSpecialSchedules } from "../../api/scheduleApi";
import { useAuth } from "../../api/authContext";
import EventItem from "../../components/EventItem";
import TaskItem from "../../components/TaskItem";
import { getTasks } from "../../api/taskApi";
import { useFocusEffect } from "@react-navigation/native";
import { Button } from "react-native-paper";
import { printToFileAsync } from "expo-print";
import { shareAsync } from "expo-sharing";
import { Ionicons } from "@expo/vector-icons";

const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const { userToken } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const generateEventsHTML = () => {
    return events
      .map(
        (eventGroup) => `
      <div>
        <h2>${eventGroup.date}</h2>
        <table border="1">
          <thead>
            <tr>
              <th>Day</th>
              <th>Time</th>
              <th>Class Type</th>
              <th>Name</th>
              <th>Location</th>
            </tr>
          </thead>
          <tbody>
            ${eventGroup.data
              .map(
                (event) => `
              <tr>
                <td>${eventGroup.date}</td>
                <td>${event.time}</td>
                <td>${event.type}</td>
                <td>${event.title}</td>
                <td>${event.location}</td>
              </tr>
            `
              )
              .join("")}
          </tbody>
        </table>
      </div>
    `
      )
      .join("");
  };

  const html = `
    <html>
      <head>
        <style>
          /* Add any custom styles here */
          body {
            font-family: Arial, sans-serif;
          }
          h2 {
            color: #333;
            margin-bottom: 10px;
          }
          ul {
            list-style-type: none;
            padding-left: 0;
          }
          li {
            margin-bottom: 20px;
          }
          strong {
            font-weight: bold;
          }
        </style>
      </head>
      <body>
        <h1>All Events</h1>
        ${generateEventsHTML()}
      </body>
    </html>
  `;

  let generatePDF = async () => {
    const file = await printToFileAsync({
      html: html,
      base64: false,
    });

    await shareAsync(file.uri, {
      dialogTitle: "Save PDF As",
      UTI: "com.adobe.pdf",
      mimeType: "application/pdf",
      filename: "YourFileName.pdf",
    });
  };

  const fetchData = async () => {
    try {
      const mergedEvents = await fetchEventsAndSpecialSchedules(userToken);
      setEvents(mergedEvents);
      const response = await getTasks(userToken);
      const formattedTasks = response.map((task) => ({
        ...task,
        due_date: formatDate(new Date(task.due_date)),
      }));
      setTasks(formattedTasks);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const formatDate = (date) => {
    const options = {
      year: "numeric",
      month: "long",
      day: "2-digit",
      weekday: "long",
    };
    return date.toLocaleDateString("en-US", options);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      fetchData();
    }, [])
  );

  // Merge events and tasks based on their dates
  const mergedData = events.map((eventGroup) => ({
    date: eventGroup.date,
    events: eventGroup.data,
    tasks: tasks
      .filter((task) => task.due_date === eventGroup.date)
      .sort((task1, task2) => {
        // Sort by due_time, with null times (All Day tasks) on top
        if (task1.due_time === null && task2.due_time !== null) return -1;
        if (task1.due_time !== null && task2.due_time === null) return 1;
        if (task1.due_time === null && task2.due_time === null) return 0;
        // Convert due_time strings to Date objects for comparison
        const time1 = new Date(`1970-01-01T${task1.due_time}Z`);
        const time2 = new Date(`1970-01-01T${task2.due_time}Z`);
        return time1 - time2;
      }),
  }));

  return (
    <>
      <ScrollView
        contentContainerStyle={[
          styles.scrollViewContent,
          events.length === 0 && styles.centeredContent,
        ]}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <TouchableOpacity onPress={generatePDF} style={styles.button}>
          <View style={styles.buttonContainer}>
            <Ionicons
              name="download-outline"
              size={24}
              color="black"
            ></Ionicons>
          </View>
        </TouchableOpacity>
        <View style={styles.eventsPage}>
          {events.length === 0 ? (
            <View style={styles.noScheduleContainer}>
              <MaterialIcons name="event-busy" size={48} color="grey" />
              <Text style={styles.noScheduleText}>No Schedule</Text>
            </View>
          ) : (
            mergedData.map((data, index) => (
              <View key={index} style={styles.eventGroup}>
                <Text style={styles.dateText}>{data.date}</Text>
                {data.tasks
                  .filter((task) => !task.completed) // Filter out completed tasks
                  .map((task, idx) => (
                    <TaskItem
                      key={idx}
                      taskId={task.id}
                      title={task.title}
                      description={task.description}
                      dueDate={task.due_date}
                      dueTime={task.due_time}
                      markCompleted={task.completed}
                      completed={task.completed}
                      origin={"calendar-list"}
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
                    description={event.description}
                  />
                ))}
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  scrollViewContent: {
    flexGrow: 1,
  },
  centeredContent: {
    justifyContent: "center",
    alignItems: "center",
  },
  eventsPage: {
    padding: 20,
  },
  eventGroup: {
    marginBottom: 20,
  },
  dateText: {
    fontWeight: "bold",
    marginBottom: 10,
    fontSize: 18,
  },
  taskDate: {
    fontWeight: "bold",
    fontSize: 18,
    marginTop: 10,
    marginBottom: 5,
  },
  noScheduleContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  noScheduleText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "grey",
    marginTop: 10,
    textAlign: "center",
  },
  // button: {
  //   position: "absolute",
  //   top: 0,
  //   right: 0,
  // },
});

export default EventsPage;
