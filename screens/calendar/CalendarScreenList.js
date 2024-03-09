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
import TaskItem from "../../components/TaskItem"; // Import the TaskItem component
import { getTasks } from "../../api/taskApi";

const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const { userToken } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async () => {
    try {
      const mergedEvents = await fetchEventsAndSpecialSchedules(userToken);
      setEvents(mergedEvents);
      const response = await getTasks(userToken);
      const formattedTasks = response.map((task) => ({
        ...task,
        due_date: formatDate(new Date(task.due_date)),
      }));
      console.log("response list", formattedTasks);
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

  // Merge events and tasks based on their dates
  const mergedData = events.map((eventGroup) => ({
    date: eventGroup.date,
    events: eventGroup.data,
    tasks: tasks.filter((task) => task.due_date === eventGroup.date),
  }));

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
              {data.tasks.map((task, idx) => (
                <TaskItem
                  key={idx}
                  title={task.title}
                  completed={task.completed}
                  onPress={() => {}}
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
      </View>
    </ScrollView>
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
});

export default EventsPage;
