import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const TaskItem = ({
  taskId,
  title,
  description,
  dueDate,
  dueTime,
  markCompleted,
  completed,
}) => {
  const navigation = useNavigation();

  // console.log(
  //   "TaskItem:",
  //   `\n Task ID: ${taskId}`,
  //   `\n Title: ${title}`,
  //   `\n Description: ${description}`,
  //   `\n Due Date: ${dueDate}`,
  //   `\n Due Time: ${dueTime}`,
  //   `\n Completed: ${markCompleted}`,
  //   `\n Completed locally: ${completed}`
  // );

  const handlePress = () => {
    console.log("Task ID:", taskId);
    navigation.navigate("TaskDetailScreen", {
      taskId,
      title,
      description,
      dueDate,
      dueTime,
      markCompleted,
    });
  };

  return (
    <TouchableOpacity style={styles.taskContainer} onPress={handlePress}>
      <Ionicons
        name={"checkmark-circle-outline"}
        size={24}
        color={"white"}
        style={styles.icon}
      />
      <Text style={[styles.title, completed ? styles.completedTitle : null]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  taskContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderBottomColor: "#ccc",
    backgroundColor: "#2584fc",
    borderRadius: 5,
    marginBottom: 5,
    width: "100%",
  },
  icon: {
    marginRight: 10,
  },
  title: {
    fontSize: 16,
    color: "white",
  },
  completedTitle: {
    textDecorationLine: "line-through",
    opacity: 0.5,
  },
});

export default TaskItem;
