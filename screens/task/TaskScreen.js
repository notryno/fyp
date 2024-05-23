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

const TaskScreen = () => {
  const [tasks, setTasks] = useState([]);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [showAddTaskButton, setShowAddTaskButton] = useState(true);
  const [sortBy, setSortBy] = useState("title");
  const [sortOrder, setSortOrder] = useState("asc");
  const { userToken } = useAuth();
  const { navigate } = useNavigation();
  const [filter, setFilter] = useState("All");

  const fetchTasks = async () => {
    try {
      const response = await getTasks(userToken);
      setTasks(response);
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
    setFilter(sortByField);
    if (sortByField === sortBy) {
      newSortOrder = sortOrder === "asc" ? "desc" : "asc";
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
      if (a.completed !== b.completed) {
        return a.completed ? 1 : -1;
      }

      if (sortBy === "title") {
        const titleA = a.title.toLowerCase();
        const titleB = b.title.toLowerCase();
        if (sortOrder === "asc") {
          return titleA < titleB ? -1 : titleA > titleB ? 1 : 0;
        } else {
          return titleA > titleB ? -1 : titleA < titleB ? 1 : 0;
        }
      } else if (sortBy === "due_date") {
        const dateA = new Date(a.due_date).getTime();
        const dateB = new Date(b.due_date).getTime();
        return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
      } else if (sortBy === "due_time") {
        if (a.all_day && !b.all_day) {
          return -1;
        } else if (!a.all_day && b.all_day) {
          return 1;
        }

        const timeA = a.due_time
          ? new Date(`1970-01-01T${a.due_time}Z`).getTime()
          : 0;
        const timeB = b.due_time
          ? new Date(`1970-01-01T${b.due_time}Z`).getTime()
          : 0;
        if (sortOrder === "asc") {
          return timeA - timeB;
        } else {
          return timeB - timeA;
        }
      }
    });
  });

  // Always keep dates sorted in ascending order
  const sortedDates = Object.keys(groupedTasks).sort((a, b) => {
    const dateA = new Date(a).getTime();
    const dateB = new Date(b).getTime();
    if (sortBy === "due_date") {
      if (sortOrder === "asc") {
        return dateB - dateA;
      } else {
        return dateA - dateB;
      }
    } else {
      return dateA - dateB;
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
          paddingBottom: 0,
          backgroundColor: "white",
        }}
      >
        <Text style={{ fontSize: 34, fontWeight: "bold" }}>Tasks</Text>
        <TouchableOpacity onPress={() => generatePDF()}>
          <Ionicons name="download-outline" size={28} color="black" />
        </TouchableOpacity>
      </View>
      <View style={styles.chipsContainer}>
        <TouchableOpacity
          style={[styles.chip, filter === "title" && styles.selectedChip]}
          onPress={() => handleSort("title")}
        >
          <Text
            style={[styles.chipText, filter === "title" && styles.selectedChip]}
          >
            Title
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.chip, filter === "due_date" && styles.selectedChip]}
          onPress={() => handleSort("due_date")}
        >
          <Text
            style={[
              styles.chipText,
              filter === "due_date" && styles.selectedChip,
            ]}
          >
            Due Date
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.chip, filter === "due_time" && styles.selectedChip]}
          onPress={() => handleSort("due_time")}
        >
          <Text
            style={[
              styles.chipText,
              filter === "due_time" && styles.selectedChip,
            ]}
          >
            Due Time
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.container}>
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
  chipsContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
    paddingLeft: 10,
  },
  chip: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginHorizontal: 5,
    borderRadius: 20,
    backgroundColor: "#E0E0E0",
  },
  selectedChip: {
    backgroundColor: "black",
    color: "white",
  },
  chipText: {
    color: "#757575",
    fontWeight: "600",
    fontSize: 16,
  },
});

export default TaskScreen;
