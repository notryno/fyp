import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
  FlatList,
  Alert,
  SafeAreaView,
} from "react-native";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import { fetchEventsAndSpecialSchedules } from "../api/scheduleApi";
import { useAuth } from "../api/authContext";
import { getUserData } from "../api/authApi";
import EventItem from "../components/EventItem";
import TaskItem from "../components/TaskItem";
import Card from "../components/Card";
import { createTask, deleteTask, getTasks, updateTask } from "../api/taskApi";
import { useFocusEffect } from "@react-navigation/native";
import { useNavigation } from "@react-navigation/native";

const HomeScreen = () => {
  const [events, setEvents] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [userData, setUserData] = useState(false);
  const { userToken } = useAuth();
  const { navigate } = useNavigation();

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
    const dateParts = event.date.split(", ");
    const monthName = dateParts[1].split(" ")[0];
    const day = dateParts[1].split(" ")[1];
    const year = dateParts[2];
    const monthNumber = monthNamesToNumber[monthName];
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

  const handleCompleteTask = async (taskId) => {
    try {
      await updateTask(userToken, taskId, { completed: true });
      const response = await getTasks(userToken);
      setTasks(response);
    } catch (error) {
      console.error("Error completing task:", error);
    }
  };

  const handleIncompleteTask = async (taskId) => {
    try {
      await updateTask(userToken, taskId, { completed: false });
      const response = await getTasks(userToken);
      setTasks(response);
    } catch (error) {
      console.error("Error marking task as incomplete:", error);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await deleteTask(userToken, taskId);
      const response = await getTasks(userToken);
      setTasks(response);
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const confirmDeleteTask = (taskId) => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this task?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: () => handleDeleteTask(taskId),
        },
      ]
    );
  };

  const navigateToTaskDescription = (taskId) => {
    const task = tasks.find((task) => task.id === taskId);
    const formattedDueDate = task.due_date
      ? new Date(task.due_date).toISOString()
      : "";

    const formattedDueTime = task.due_time ? parseTime(task.due_time) : "";

    navigate("TaskDetailScreen", {
      taskId,
      title: task?.title || "",
      description: task?.description || "",
      dueDate: formattedDueDate,
      dueTime: formattedDueTime,
      markCompleted: task?.completed,
    });
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchData();
    }, [])
  );

  const parseTime = (timeStr) => {
    const [hours, minutes, seconds] = timeStr.split(":").map(Number);
    const dateObj = new Date();
    dateObj.setHours(hours);
    dateObj.setMinutes(minutes);
    dateObj.setSeconds(seconds);
    return dateObj.toISOString();
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          padding: 20,
          backgroundColor: "white",
        }}
      >
        <Text style={{ fontSize: 34, fontWeight: "bold" }}>Home</Text>
      </View>
      <FlatList
        contentContainerStyle={styles.container}
        data={[
          { key: "events" },
          ...todayEvents,
          { key: "tasks" },
          ...todayTasks,
        ]}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        renderItem={({ item }) => {
          if (item.key === "events") {
            // if (todayEvents.length === 0) {
            //   return (
            // <View style={styles.eventBusyContainer}>
            //   <MaterialIcons name="event-busy" size={50} color="red" />
            //   <Text style={styles.noEventsText}>No events for today</Text>
            // </View>
            //   );
            // }

            return (
              <>
                <Text style={styles.headerText}>
                  {userData ? `Hi ${userData.user_data.first_name},` : "Hello,"}
                </Text>
                <Card style={styles.eventCard}>
                  {todayEvents.length > 0 ? (
                    <Text style={styles.subHeaderText}>
                      You have {todayEvents.length}{" "}
                      {todayEvents.length === 1 ? "event" : "events"} today.
                    </Text>
                  ) : (
                    <View style={styles.eventBusyContainer}>
                      <MaterialIcons name="event-busy" size={50} color="grey" />
                      <Text style={styles.noEventsText}>
                        Nothing scheduled today
                      </Text>
                    </View>
                  )}

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
                </Card>
              </>
            );
          } else if (item.key === "tasks") {
            return (
              <>
                <Text style={styles.sectionHeader}>Things to do</Text>

                <Card style={styles.taskCard}>
                  {todayTasks.length > 0 ? (
                    <Text style={styles.subHeaderText}>
                      You have {todayTasks.length}{" "}
                      {todayTasks.length === 1 ? "task" : "tasks"} due today.
                    </Text>
                  ) : (
                    <View style={styles.eventBusyContainer}>
                      <MaterialIcons
                        name="playlist-add-check"
                        size={50}
                        color="grey"
                      />
                      <Text style={styles.noEventsText}>
                        All caught up for today!
                      </Text>
                    </View>
                  )}
                  <FlatList
                    data={todayTasks}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        onPress={() => navigateToTaskDescription(item.id)}
                      >
                        <View style={styles.taskItem}>
                          <TouchableOpacity
                            onPress={() =>
                              !item.completed
                                ? handleCompleteTask(item.id)
                                : handleIncompleteTask(item.id)
                            }
                            style={styles.completeButton}
                          >
                            <View style={styles.completeButtonInner}>
                              {item.completed && (
                                <View style={styles.completeIndicator} />
                              )}
                            </View>
                          </TouchableOpacity>
                          <View style={styles.taskTextContainer}>
                            <Text
                              style={[
                                styles.taskTitle,
                                item.completed && styles.completedTaskTitle,
                              ]}
                            >
                              {item.title}
                            </Text>
                          </View>
                          <TouchableOpacity
                            onPress={() => confirmDeleteTask(item.id)}
                            style={styles.deleteButton}
                          >
                            <Ionicons
                              name="close-circle-outline"
                              size={25}
                              color="red"
                            />
                          </TouchableOpacity>
                        </View>
                      </TouchableOpacity>
                    )}
                  />
                </Card>
              </>
            );
          }
        }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 40,
    backgroundColor: "#f2f2f2",
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
  eventCard: {
    marginBottom: 15,
  },
  taskCard: {
    marginBottom: 10,
  },
  eventGroup: {
    marginBottom: 10,
  },
  taskItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 5,
  },
  completeButton: {
    flex: 1,
    alignItems: "center",
  },
  completeButtonInner: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  completeIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "black",
  },
  taskTextContainer: {
    flex: 8,
    paddingHorizontal: 10,
  },
  taskTitle: {
    fontSize: 16,
  },
  completedTaskTitle: {
    textDecorationLine: "line-through",
    opacity: 0.5,
  },
  deleteButton: {
    flex: 1,
    alignItems: "center",
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    marginTop: 20,
  },
  eventBusyContainer: {
    // flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  noEventsText: {
    fontSize: 14,
    marginTop: 8,
  },
});

export default HomeScreen;
