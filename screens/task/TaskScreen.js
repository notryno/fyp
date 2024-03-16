// TaskScreen.js
import React, { useEffect, useState } from "react";
import {
  FlatList,
  Text,
  View,
  TextInput,
  Button,
  TouchableOpacity,
  Alert,
  Switch,
  Modal,
} from "react-native";

import { useAuth } from "../../api/authContext";
import {
  createTask,
  deleteTask,
  getTasks,
  updateTask,
} from "../../api/taskApi";
import DatePicker from "@react-native-community/datetimepicker";
import TaskForm from "./TaskForm";
import Overlay from "../../components/Overlay";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import TaskDescriptionScreen from "./TaskDescriptionScreen";

const TaskScreen = () => {
  const [tasks, setTasks] = useState([]);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const { userToken } = useAuth();
  const [showAddTaskButton, setShowAddTaskButton] = useState(true);
  const { navigate } = useNavigation();

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await getTasks(userToken);
        setTasks(response);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    fetchTasks();
  }, [userToken]);

  const handleAddTask = async (taskData) => {
    try {
      await createTask(userToken, taskData);
      const response = await getTasks(userToken);
      setTasks(response);
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
      // Send a request to mark the task as completed
      await updateTask(userToken, taskId, { completed: true });
      // Fetch tasks again after completing a task
      const response = await getTasks(userToken);
      setTasks(response);
    } catch (error) {
      console.error("Error completing task:", error);
    }
  };

  const handleIncompleteTask = async (taskId) => {
    try {
      // Send a request to mark the task as incomplete
      await updateTask(userToken, taskId, { completed: false });
      // Fetch tasks again after marking a task as incomplete
      const response = await getTasks(userToken);
      setTasks(response);
    } catch (error) {
      console.error("Error marking task as incomplete:", error);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      // Send a request to delete the task
      await deleteTask(userToken, taskId);
      // Fetch tasks again after deleting a task
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
    const formattedDueDate = task
      ? new Date(task.due_date).toLocaleDateString()
      : "";
    const formattedDueTime = task
      ? new Date(`1970-01-01T${task.due_time}Z`).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })
      : "";

    navigate("TaskDescriptionScreen", {
      title: task?.title || "",
      description: task?.description || "",
      dueDate: formattedDueDate,
      dueTime: formattedDueTime,
      onMarkCompleted: () => handleCompleteTask(taskId),
      onDelete: () => confirmDeleteTask(taskId),
    });
  };

  return (
    <View style={{ flex: 1, padding: 10 }}>
      <Text>Task Screen</Text>

      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => navigateToTaskDescription(item.id)}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                marginVertical: 5,
              }}
            >
              <TouchableOpacity
                onPress={() =>
                  !item.completed
                    ? handleCompleteTask(item.id)
                    : handleIncompleteTask(item.id)
                }
                style={{ flex: 1, alignItems: "center" }}
              >
                <View
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: 10,
                    borderWidth: 2,
                    borderColor: !item.completed ? "green" : "orange",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {item.completed && (
                    <View
                      style={{
                        width: 10,
                        height: 10,
                        borderRadius: 5,
                        backgroundColor: !item.completed ? "green" : "orange",
                      }}
                    />
                  )}
                </View>
              </TouchableOpacity>

              <View style={{ flex: 8, paddingHorizontal: 10 }}>
                <Text
                  style={{
                    textDecorationLine: item.completed
                      ? "line-through"
                      : "none",
                    opacity: item.completed ? 0.5 : 1,
                  }}
                >
                  {item.title}
                </Text>
                <Text
                  style={{
                    textDecorationLine: item.completed
                      ? "line-through"
                      : "none",
                    opacity: item.completed ? 0.5 : 1,
                  }}
                >
                  {item.description}
                </Text>
              </View>

              <TouchableOpacity
                onPress={() => confirmDeleteTask(item.id)}
                style={{ flex: 1, alignItems: "center" }}
              >
                <View
                  style={{
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Ionicons name="close-circle-outline" size={25} color="red" />
                </View>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        )}
      />
      <Overlay visible={showTaskForm} zIndex={2}>
        <TaskForm onSubmit={handleAddTask} onCancel={handleCancelAddTask} />
      </Overlay>

      {showAddTaskButton && (
        <View
          style={{
            position: "absolute",
            bottom: 20,
            right: 20,
            backgroundColor: "lightblue",
            padding: 10,
            borderRadius: 40,
          }}
        >
          <Button
            title="+"
            onPress={() => {
              setShowTaskForm(true);
              setShowAddTaskButton(false);
            }}
          />
        </View>
      )}
    </View>
  );
};

export default TaskScreen;
