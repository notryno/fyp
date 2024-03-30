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
import { fetchEventsAndSpecialSchedules } from "../api/scheduleApi";
import { useAuth } from "../api/authContext";
import { getUserData } from "../api/authApi";
import EventItem from "../components/EventItem";
import TaskItem from "../components/TaskItem";
import { getTasks } from "../api/taskApi";
import { useFocusEffect } from "@react-navigation/native";

const HomeScreen = () => {
  const [events, setEvents] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [userData, setUserData] = useState(false);
  const { userToken } = useAuth();

  const fetchData = async () => {
    try {
      const mergedEvents = await fetchEventsAndSpecialSchedules(userToken);
      setEvents(mergedEvents);
      const response = await getTasks(userToken);
      const user_data = await getUserData(userToken);
      const formattedTasks = response.map((task) => ({
        ...task,
        dueDate: new Date(task.dueDate),
      }));
      setTasks(formattedTasks);
      setUserData(user_data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
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

  const todayEvents = events.filter((event) => {
    // Convert event.date to the format "YYYY-MM-DD"
    const dateParts = event.date.split(", "); // Split the date string
    const monthName = dateParts[1].split(" ")[0]; // Get the month name
    const day = dateParts[1].split(" ")[1]; // Get the day
    const year = dateParts[2]; // Get the year

    // Convert the month name to its corresponding number
    const monthNumber = monthNamesToNumber[monthName];

    // Format the date as "YYYY-MM-DD"
    const formattedDate = new Date(`${year}-${monthNumber}-${day}`);

    const today = new Date();
    return (
      formattedDate.getDate() === today.getDate() &&
      formattedDate.getMonth() === today.getMonth() &&
      formattedDate.getFullYear() === today.getFullYear()
    );
  });

  const todayTasks = tasks.filter((task) => {
    const taskDueDate = new Date(task.due_date);
    const today = new Date();
    return (
      taskDueDate.getDate() === today.getDate() &&
      taskDueDate.getMonth() === today.getMonth() &&
      taskDueDate.getFullYear() === today.getFullYear()
    );
  });

  useFocusEffect(
    React.useCallback(() => {
      fetchData();
    }, [])
  );

  return (
    <ScrollView
      contentContainerStyle={[
        styles.scrollViewContent,
        events.length === 0 && styles.centeredContent,
      ]}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.container}>
        <Text style={styles.headerText}>
          {userData ? `Hi ${userData.user_data.first_name},` : "Hello,"}
        </Text>
        <Text style={styles.subHeaderText}>
          You have {todayEvents.length}{" "}
          {todayEvents.length === 1 ? "event" : "events"} today.
        </Text>

        <View style={styles.eventsPage}>
          {todayEvents.map((eventGroup, idx) => (
            <View key={idx} style={styles.eventGroup}>
              {eventGroup.data.map((event, idx) => (
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

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionHeader}>Things to do</Text>
          <Text style={styles.subHeaderText}>
            You have {todayTasks.length}{" "}
            {todayTasks.length === 1 ? "task" : "tasks"} due today.
          </Text>
          <View style={styles.eventsPage}>
            {todayTasks.map((task, idx) => (
              <TaskItem
                key={idx}
                taskId={task.id} // Assuming task.id is the correct ID for the task
                title={task.title}
                description={task.description}
                dueDate={task.due_date} // Correct the prop name to due_date
                dueTime={task.due_time} // Correct the prop name to due_time
                markCompleted={task.completed} // Correct the prop name to completed
                completed={task.completed}
              />
            ))}
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subHeaderText: {
    fontSize: 16,
    marginBottom: 20,
  },
  sectionContainer: {
    marginBottom: 20,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    marginTop: 20,
  },
});

export default HomeScreen;
