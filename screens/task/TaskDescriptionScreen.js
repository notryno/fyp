import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  Text,
  Switch,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { updateTask, deleteTask } from "../../api/taskApi";
import { useAuth } from "../../api/authContext";
import DatePicker from "@react-native-community/datetimepicker";

const TaskDescriptionScreen = ({ route, navigation }) => {
  const {
    taskId,
    title: initialTitle,
    description: initialDescription,
    dueDate: initialDueDate,
    dueTime: initialDueTime,
    markCompleted,
  } = route.params;

  const [title, setTitle] = useState(initialTitle);
  const [description, setDescription] = useState(initialDescription);
  const [completed, setCompleted] = useState(markCompleted);
  const [dueDate, setDueDate] = useState(new Date(initialDueDate));
  const [dueTime, setDueTime] = useState(
    initialDueTime ? new Date(initialDueTime) : new Date()
  );
  const [allDay, setAllDay] = useState(
    initialDueTime.length === 0 ? true : false
  );

  const { userToken } = useAuth();

  const handleMarkCompleted = async () => {
    try {
      if (!completed) {
        await updateTask(userToken, taskId, { completed: true });
      } else {
        await updateTask(userToken, taskId, { completed: false });
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

  const handleTitleChange = async (newTitle) => {
    try {
      await updateTask(userToken, taskId, { title: newTitle });
      // Update local state
      setTitle(newTitle);
    } catch (error) {
      console.error("Error updating task title:", error);
    }
  };

  const handleDescriptionChange = async (newDescription) => {
    try {
      await updateTask(userToken, taskId, { description: newDescription });
      setDescription(newDescription);
    } catch (error) {
      console.error("Error updating task description:", error);
    }
  };

  const handleDueDateChange = async () => {
    const formattedDueDate = dueDate.toISOString().split("T")[0];
    try {
      await updateTask(userToken, taskId, {
        due_date: formattedDueDate,
      });
    } catch (error) {
      console.error("Error updating task due date:", error);
    }
  };

  const handleDueTimeChange = async () => {
    const formattedDueTime = dueTime.toTimeString().split(" ")[0];
    try {
      await updateTask(userToken, taskId, {
        due_time: formattedDueTime,
      });
    } catch (error) {
      console.error("Error updating task due time:", error);
    }
  };

  const handleAllDayChange = async () => {
    try {
      if (!allDay) {
        await updateTask(userToken, taskId, {
          all_day: !allDay,
          due_time: null,
        });
      } else {
        await updateTask(userToken, taskId, {
          all_day: !allDay,
          due_time: dueTime.toTimeString().split(" ")[0],
        });
      }

      setAllDay(!allDay);
    } catch (error) {
      console.error("Error updating task due time:", error);
    }
  };

  useEffect(() => {
    handleDueDateChange();
  }, [dueDate]);

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <TextInput
          style={[styles.title, completed && styles.completedTitle]}
          value={title}
          onChangeText={(text) => setTitle(text)}
          onBlur={() => handleTitleChange(title)}
        />
      </View>
      <View style={styles.infoContainer}>
        <View style={styles.descriptionContainer}>
          <Text style={styles.label}>
            <Ionicons name="reorder-three-outline" size={20} /> Description:
          </Text>
          <TextInput
            style={styles.input}
            multiline
            numberOfLines={4}
            placeholder="Add description"
            value={description}
            onChangeText={(text) => setDescription(text)}
            onBlur={() => handleDescriptionChange(description)}
          />
        </View>
        <View style={styles.calendarContainer}>
          <Text style={styles.infoText}>
            <Ionicons name="calendar-outline" size={20} /> Due Date:
          </Text>
          <DatePicker
            style={styles.datePicker}
            value={dueDate}
            mode="date"
            format="YYYY-MM-DD"
            minDate={new Date(2000, 0, 1)}
            maxDate={new Date(2100, 11, 31)}
            accentColor="red"
            onChange={(event, date) => {
              if (date !== undefined) {
                setDueDate(date);
              }
            }}
          />
        </View>

        <View style={styles.calendarContainer}>
          <Text style={[styles.infoText, { marginRight: 40 }]}>
            <Ionicons name="time-outline" size={20} /> All Day:
          </Text>
          <Switch
            style={styles.switch}
            value={allDay}
            onValueChange={handleAllDayChange}
          />
        </View>

        <View style={styles.calendarContainer}>
          {!allDay && (
            <>
              <Text style={[styles.infoText, { marginRight: 5 }]}>
                <Ionicons name="time-outline" size={20} /> Due Time:
              </Text>
              <DatePicker
                style={styles.datePicker}
                value={dueTime}
                mode="time"
                format="HH:mm"
                accentColor="red"
                onChange={(event, time) => {
                  if (time !== undefined) {
                    setDueTime(time);
                    handleDueTimeChange(
                      time.toISOString().split("T")[1].split(".")[0]
                    );
                  }
                }}
              />
            </>
          )}
        </View>
      </View>
      <View style={styles.buttonContainer}>
        <Button
          title={completed ? "Mark Uncomplete" : "Mark Completed"}
          onPress={handleMarkCompleted}
        />
        <Button title="Delete" onPress={confirmDeleteTask} />
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
  input: {
    borderRadius: 5,
    flex: 1,
    fontSize: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginRight: 10,
  },
  infoContainer: {
    flex: 1,
  },
  infoText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  descriptionContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  calendarContainer: {
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  datePicker: { marginLeft: 10 },
});

export default TaskDescriptionScreen;
