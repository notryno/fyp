import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  Switch,
  StyleSheet,
  KeyboardAvoidingView,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import DatePicker from "@react-native-community/datetimepicker";

const TaskForm = ({ onSubmit, onCancel }) => {
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState(new Date());
  const [dueTime, setDueTime] = useState(new Date());
  const [allDay, setAllDay] = useState(false);

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  const handleAddTask = () => {
    let formattedDueTime = null;
    const formattedDueDate = dueDate.toISOString().split("T")[0];

    if (!allDay) {
      const dueDateTime = new Date(dueDate);
      dueDateTime.setHours(dueTime.getHours(), dueTime.getMinutes());
      formattedDueTime = dueTime.toTimeString().split(" ")[0];
    }

    onSubmit({
      title: newTaskTitle,
      description: description,
      due_date: formattedDueDate,
      due_time: formattedDueTime,
      all_day: allDay,
    });
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : -200}
    >
      <TouchableWithoutFeedback onPress={dismissKeyboard}>
        <View style={styles.container}>
          <View style={styles.formContainer}>
            <TextInput
              style={styles.input}
              value={newTaskTitle}
              autoCapitalize="words"
              onChangeText={(text) => setNewTaskTitle(text)}
              placeholder="New Task"
              fontWeight={newTaskTitle.length == 0 ? "bold" : "normal"}
            />
            <View
              style={{
                flexDirection: "row",
                marginBottom: 10,
              }}
            >
              <Text
                style={[styles.label, styles.labelContainer, { marginTop: 5 }]}
              >
                Description:
              </Text>
              <TextInput
                style={styles.descriptionInput}
                placeholder="Add Description"
                multiline
                numberOfLines={4}
                value={description}
                onChangeText={(text) => setDescription(text || null)}
              />
            </View>
            <View style={styles.rowContainer}>
              <View style={styles.labelContainer}>
                <Text style={styles.label}>Due Date:</Text>
              </View>
              <View style={styles.datePickerContainer}>
                <DatePicker
                  style={styles.datePicker}
                  value={dueDate}
                  mode="date"
                  format="YYYY-MM-DD"
                  minDate={new Date(2000, 0, 1)}
                  maxDate={new Date(2100, 11, 31)}
                  confirmBtnText="Confirm"
                  cancelBtnText="Cancel"
                  onChange={(event, date) => {
                    if (date !== undefined) {
                      setDueDate(date);
                    }
                  }}
                />
              </View>
            </View>
            {!allDay && (
              <View style={styles.rowContainer}>
                <View style={styles.labelContainer}>
                  <Text style={styles.label}>Due Time:</Text>
                </View>
                <View style={styles.datePickerContainer}>
                  <DatePicker
                    style={styles.datePicker}
                    value={dueTime}
                    mode="time"
                    format="HH:mm"
                    confirmBtnText="Confirm"
                    cancelBtnText="Cancel"
                    onChange={(event, time) => {
                      if (time !== undefined) {
                        setDueTime(time);
                      }
                    }}
                  />
                </View>
              </View>
            )}
            <View style={styles.switchContainer}>
              <Text style={styles.switchLabel}>All Day:</Text>
              <Switch
                style={styles.switch}
                value={allDay}
                onValueChange={(value) => setAllDay(value)}
              />
            </View>
            <View style={styles.buttonContainer}>
              <Button title="Cancel" onPress={onCancel} />
              <Button title="Add Task" onPress={handleAddTask} />
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-end",
    width: "100%",
  },
  formContainer: {
    backgroundColor: "white",
    padding: 16,
    paddingTop: 20,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  heading: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  input: {
    height: 40,
    marginBottom: 10,
    borderRadius: 5,
    fontSize: 20,
  },
  descriptionInput: {
    height: 80,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    borderRadius: 5,
    padding: 8,
    flex: 1,
    fontSize: 16,
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  switchLabel: {
    marginRight: 50,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  label: {
    fontSize: 16,
  },
  dateContainer: {
    marginBottom: 10,
  },
  rowContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  labelContainer: {
    width: 100,
  },
  datePickerContainer: {
    marginLeft: -12,
  },
  placeholder: {
    fontWeight: "bold",
  },
});

export default TaskForm;
