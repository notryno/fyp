import React, { useEffect, useState } from "react";
import {
  FlatList,
  Text,
  View,
  TouchableOpacity,
  Alert,
  Button,
  StyleSheet,
  ScrollView,
  SafeAreaView,
} from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

import { Dropdown } from "react-native-element-dropdown";

import { useAuth } from "../../api/authContext";
import {
  createTask,
  deleteTask,
  getTasks,
  updateTask,
} from "../../api/taskApi";
import TaskForm from "./TaskForm";
import Overlay from "../../components/Overlay";
import { printToFileAsync } from "expo-print";
import { shareAsync } from "expo-sharing";

const sortOptions = [
  { label: "Sort by Title", value: "title" },
  { label: "Sort by Due Date (Ascending)", value: "due_date_asc" },
  { label: "Sort by Due Date (Descending)", value: "due_date_desc" },
];

const TaskScreen = () => {
  const [tasks, setTasks] = useState([]);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [showAddTaskButton, setShowAddTaskButton] = useState(true);
  const [sortBy, setSortBy] = useState("title");
  const [sortOrder, setSortOrder] = useState("asc");
  const { userToken } = useAuth();
  const { navigate } = useNavigation();
  const [isFocus, setIsFocus] = useState(false);

  const fetchTasks = async () => {
    try {
      const response = await getTasks(userToken);
      setTasks(response);
      console.log("Tasks", response);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [userToken]);

  useFocusEffect(
    React.useCallback(() => {
      fetchTasks();
    }, [])
  );

  const handleAddTask = async (taskData) => {
    try {
      await createTask(userToken, taskData);
      fetchTasks(); // Fetch tasks again after adding a new task
      setShowTaskForm(false);
      setShowAddTaskButton(true);
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  const handleCancelAddTask = () => {
    setShowTaskForm(false);
    setShowAddTaskButton(true);
  };

  const handleCompleteTask = async (taskId) => {
    try {
      await updateTask(userToken, taskId, { completed: true });
      fetchTasks();
    } catch (error) {
      console.error("Error completing task:", error);
    }
  };

  const handleIncompleteTask = async (taskId) => {
    try {
      await updateTask(userToken, taskId, { completed: false });
      fetchTasks();
    } catch (error) {
      console.error("Error marking task as incomplete:", error);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await deleteTask(userToken, taskId);
      fetchTasks(); // Fetch tasks again after deleting a task
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
    const formattedDueDate = task ? new Date(task.due_date).toISOString() : "";
    const formattedDueTime = task?.due_time ? parseTime(task.due_time) : "";

    console.log("Due Time", task?.due_time);
    console.log("Formatted Due Time", formattedDueTime);

    navigate("TaskDetailScreen", {
      taskId,
      title: task?.title || "",
      description: task?.description || "",
      dueDate: formattedDueDate,
      dueTime: formattedDueTime,
      markCompleted: task?.completed,
    });
  };

  const parseTime = (timeStr) => {
    const [hours, minutes, seconds] = timeStr.split(":").map(Number);
    const dateObj = new Date();
    dateObj.setHours(hours);
    dateObj.setMinutes(minutes);
    dateObj.setSeconds(seconds);
    return dateObj.toISOString();
  };

  const handleSort = (sortByField) => {
    let newSortOrder = sortOrder;
    if (sortByField === sortBy) {
      newSortOrder = sortOrder === "asc" ? "desc" : "asc";
    } else if (sortByField === "due_date_asc") {
      setSortBy("due_date");
      newSortOrder = "asc";
    } else if (sortByField === "due_date_desc") {
      setSortBy("due_date");
      newSortOrder = "desc";
    } else {
      setSortBy(sortByField);
      newSortOrder = "asc";
    }
    setSortOrder(newSortOrder);
  };

  // Group tasks by their due date
  const groupedTasks = tasks.reduce((acc, task) => {
    const formattedDueDate = task
      ? new Date(task.due_date).toLocaleDateString(undefined, {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : "";
    if (!acc[formattedDueDate]) {
      acc[formattedDueDate] = [];
    }
    acc[formattedDueDate].push(task);
    return acc;
  }, {});

  Object.keys(groupedTasks).forEach((key) => {
    groupedTasks[key] = groupedTasks[key].sort((a, b) => {
      if (a.completed && !b.completed) {
        return 1; // Place completed tasks at the bottom
      } else if (!a.completed && b.completed) {
        return -1; // Place completed tasks at the bottom
      } else {
        return 0;
      }
    });
  });

  const sortedDates = Object.keys(groupedTasks).sort((a, b) => {
    const dateA = new Date(a).getTime();
    const dateB = new Date(b).getTime();
    if (sortOrder === "asc") {
      return dateA - dateB;
    } else {
      return dateB - dateA;
    }
  });

  let generatePDF = async () => {
    const file = await printToFileAsync({
      html: generateHTMLForTasksPDF(),
      base64: false,
    });

    await shareAsync(file.uri, {
      dialogTitle: "Save PDF As",
      UTI: "com.adobe.pdf",
      mimeType: "application/pdf",
      filename: "YourFileName.pdf",
    });
  };

  const generateHTMLForTasksPDF = () => {
    const formattedTasks = tasks.map((task) => {
      const formattedDueDate = new Date(task.due_date).toLocaleDateString(
        undefined,
        {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        }
      );
      const status = task.completed ? "Completed" : "Incomplete";

      return `
        <div class="task-item">
          <h2>${task.title}</h2>
          <p><strong>Description:</strong> ${task.description}</p>
          <p><strong>Due Date:</strong> ${formattedDueDate}</p>
          <p><strong>Status:</strong> ${status}</p>
        </div>
      `;
    });

    const html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Tasks PDF</title>
        <style>
          body {
            font-family: Arial, sans-serif;
          }
          .task-item {
            margin-bottom: 20px;
            border-bottom: 1px solid #ccc;
            padding-bottom: 10px;
          }
          h2 {
            margin-bottom: 5px;
          }
          p {
            margin: 5px 0;
          }
        </style>
      </head>
      <body>
        <h1>Tasks</h1>
        ${formattedTasks.join("")}
      </body>
      </html>
    `;

    return html;
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
        <Text style={{ fontSize: 34, fontWeight: "bold" }}>Tasks</Text>
        <TouchableOpacity onPress={() => generatePDF()}>
          <View>
            <Ionicons
              name="download-outline"
              size={28}
              color="black"
            ></Ionicons>
          </View>
        </TouchableOpacity>
      </View>
      <View style={styles.container}>
        <Dropdown
          style={{
            borderWidth: 1,
            padding: 5,
            paddingHorizontal: 10,
            borderRadius: 5,
            marginBottom: 10,
          }}
          data={sortOptions}
          labelField="label"
          valueField="value"
          value={sortBy}
          onFocus={() => setIsFocus(true)}
          onChange={(item) => {
            handleSort(item.value);
            setIsFocus(false);
          }}
        />

        <ScrollView style={styles.taskList}>
          {sortedDates.map((date) => (
            <View key={date} style={styles.taskGroup}>
              <Text style={styles.groupHeader}>{date}</Text>
              {groupedTasks[date].map((item) => (
                <TouchableOpacity
                  key={item.id}
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
              ))}
            </View>
          ))}
          {tasks.length === 0 && (
            <View style={styles.noTasksContainer}>
              <Ionicons name="checkmark-circle-outline" size={60} />
              <Text style={[styles.noTasksText, { fontSize: 26 }]}>
                All caught up!
              </Text>
              <Text style={styles.noTasksText}>
                Use the <Ionicons name="add-circle" size={20} /> button to add
                tasks!
              </Text>
            </View>
          )}
        </ScrollView>
        {showAddTaskButton && (
          <TouchableOpacity
            style={styles.addButtonContainer}
            onPress={() => {
              setShowTaskForm(true);
              setShowAddTaskButton(false);
            }}
          >
            <Text
              style={{
                fontSize: 25,
                fontWeight: "bold",
                color: "white",
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,
                elevation: 5,
              }}
            >
              +
            </Text>
          </TouchableOpacity>
        )}
        <Overlay visible={showTaskForm} zIndex={2}>
          <TaskForm onSubmit={handleAddTask} onCancel={handleCancelAddTask} />
        </Overlay>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f2f2f2",
  },
  taskGroup: {
    marginBottom: 20,
  },
  groupHeader: {
    fontSize: 18,
    fontWeight: "bold",
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
  addButtonContainer: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "black",
    height: 60,
    width: 60,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "100%",
  },
  dropdownContainer: {
    marginVertical: 10,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    backgroundColor: "#fff",
  },
  dropdownLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: "black",
  },
  dropdown: {
    marginTop: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "black",
  },
  dropdownText: {
    fontSize: 16,
    color: "black",
  },
  noTasksContainer: {
    flex: 1,
    marginTop: 180,
    justifyContent: "center",
    alignItems: "center",
  },
  noTasksText: {
    fontSize: 20,
    marginTop: 10,
    color: "gray",
    alignItems: "center",
  },
});

export default TaskScreen;
