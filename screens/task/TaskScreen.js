import React, { useEffect, useState } from "react";
import {
  FlatList,
  Text,
  View,
  TouchableOpacity,
  Alert,
  Button,
  StyleSheet,
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

const TaskScreen = () => {
  const [tasks, setTasks] = useState([]);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const { userToken } = useAuth();
  const [showAddTaskButton, setShowAddTaskButton] = useState(true);
  const { navigate } = useNavigation();

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
      fetchTasks(); // Fetch tasks again when the screen gains focus
    }, [])
  );

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
      taskId,
      title: task?.title || "",
      description: task?.description || "",
      dueDate: formattedDueDate,
      dueTime: formattedDueTime,
      markCompleted: task?.completed,
    });
  };

  return (
    <View style={styles.container}>
      <Text>Task Screen</Text>

      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => navigateToTaskDescription(item.id)}>
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
                  {item.completed && <View style={styles.completeIndicator} />}
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
                <Ionicons name="close-circle-outline" size={25} color="red" />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        )}
      />

      <Overlay visible={showTaskForm} zIndex={2}>
        <TaskForm onSubmit={handleAddTask} onCancel={handleCancelAddTask} />
      </Overlay>

      {showAddTaskButton && (
        <View style={styles.addButtonContainer}>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
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
    backgroundColor: "black", // Add this line to give the dot a color
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
    backgroundColor: "lightblue",
    padding: 10,
    borderRadius: 50, // Make the add button round
  },
});

export default TaskScreen;
