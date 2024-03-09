import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const TaskItem = ({ title, completed, onPress }) => {
  return (
    <TouchableOpacity style={styles.taskContainer} onPress={onPress}>
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
