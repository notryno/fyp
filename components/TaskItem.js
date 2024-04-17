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
  origin,
}) => {
  const navigation = useNavigation();

  const handlePress = () => {
    // console.log("Task ID:", taskId);
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
    const monthMap = {
      January: "1",
      February: "2",
      March: "3",
      April: "4",
      May: "5",
      June: "6",
      July: "7",
      August: "8",
      September: "9",
      October: "10",
      November: "11",
      December: "12",
    };

    let formattedDueDate = dueDate;

    // Split the date string into its components
    if (origin === "calendar-list") {
      const dateComponents = dueDate.split(", ")[1].split(" ");
      const month = monthMap[dateComponents[0]];
      const day = dateComponents[1];
      const year = dueDate.split(", ")[2];
      // const formattedDate = new Date(year, month, day).toISOString().slice(0, 10);
      const formattedDate = `${year}-${month}-${day}`;

      formattedDueDate = formattedDate
        ? new Date(formattedDate).toISOString()
        : "";
    }

    const formattedDueTime = dueTime ? parseTime(dueTime) : "";

    navigation.navigate("TaskDetailScreen", {
      taskId,
      title,
      description,
      dueDate: formattedDueDate,
      dueTime: formattedDueTime,
      markCompleted,
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
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 3.84,
    elevation: 5,
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
