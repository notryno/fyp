import React, { useState, useEffect } from "react";
import { View, Text, Button, StyleSheet, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";

// Import your API functions here
import { updateTask, deleteTask } from "../../api/taskApi";
import { useAuth } from "../../api/authContext";

const TaskDescriptionScreen = ({ route, navigation }) => {
  const {
    taskId,
    title,
    description,
    dueDate,
    dueTime,
    markCompleted,
    taskDeleted,
    onDelete,
  } = route.params;

  const [completed, setCompleted] = useState(markCompleted);
  const { userToken } = useAuth();

  // Function to toggle completion status and update button text accordingly
  const handleMarkCompleted = async () => {
    try {
      if (!completed) {
        await updateTask(userToken, taskId, { completed: true }); // Update task completion status in the database
      } else {
        await updateTask(userToken, taskId, { completed: false }); // Update task completion status in the database
      }
      // Update local state
      setCompleted(!completed);
    } catch (error) {
      console.error("Error updating task completion status:", error);
    }
  };

  const handleDeleteTask = async () => {
    try {
      await deleteTask(userToken, taskId);
      navigation.goBack();
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const confirmDeleteTask = () => {
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
          onPress: handleDeleteTask,
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={[styles.title, completed && styles.completedTitle]}>
          {title}
        </Text>
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>
          <Ionicons name="reorder-three-outline" size={20} /> Description:{" "}
          {description}
        </Text>
        <Text style={styles.infoText}>
          <Ionicons name="calendar-outline" size={20} /> Due Date: {dueDate}
        </Text>
        <Text style={styles.infoText}>
          <Ionicons name="time-outline" size={20} /> Time: {dueTime}
        </Text>
      </View>
      <View style={styles.buttonContainer}>
        <Button
          title={completed ? "Mark Uncomplete" : "Mark Completed"}
          onPress={handleMarkCompleted}
        />
        <Button
          title={taskDeleted ? "Restore" : "Delete"}
          onPress={confirmDeleteTask}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  titleContainer: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  completedTitle: {
    textDecorationLine: "line-through",
    opacity: 0.5,
  },
  infoContainer: {
    flex: 1,
  },
  infoText: {
    fontSize: 16,
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
});

export default TaskDescriptionScreen;
