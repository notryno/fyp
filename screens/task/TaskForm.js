import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  Switch,
  StyleSheet,
} from "react-native";
import DatePicker from "@react-native-community/datetimepicker";

const TaskForm = ({ onSubmit, onCancel }) => {
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState(new Date());
  const [dueTime, setDueTime] = useState(new Date());
  const [allDay, setAllDay] = useState(false);

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
    <View style={styles.container}>
      <View style={styles.formContainer}>
        <Text style={styles.heading}>New Task</Text>
        <TextInput
          style={styles.input}
          placeholder="New Task Title"
          value={newTaskTitle}
          onChangeText={(text) => setNewTaskTitle(text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Description"
          value={description}
          onChangeText={(text) => setDescription(text || null)}
        />
        <View style={styles.rowContainer}>
          <View style={styles.labelContainer}>
            <Text style={styles.label}>Due Date:</Text>
          </View>
          <View style={styles.datePickerContainer}>
            <DatePicker
              style={styles.datePicker}
              value={dueDate} // Ensure dueDate is a Date object
              mode="date"
              format="YYYY-MM-DD"
              minDate={new Date(2000, 0, 1)} // Use Date constructor to set minDate
              maxDate={new Date(2100, 11, 31)} // Use Date constructor to set maxDate
              confirmBtnText="Confirm"
              cancelBtnText="Cancel"
              customStyles={styles.datePickerCustomStyles}
              onChange={(event, date) => {
                if (date !== undefined) {
                  setDueDate(date);
                }
              }} // Update dueDate state if date is defined
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
                value={dueTime} // Ensure dueTime is a Date object
                mode="time"
                format="HH:mm"
                confirmBtnText="Confirm"
                cancelBtnText="Cancel"
                customStyles={styles.datePickerCustomStyles}
                onChange={(event, time) => {
                  if (time !== undefined) {
                    setDueTime(time);
                  }
                }} // Update dueTime state if time is defined
              />
            </View>
          </View>
        )}
        <View style={styles.switchContainer}>
          <Text style={styles.switchLabel}>All Day</Text>
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
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    padding: 8,
  },
  datePicker: {
    width: 200,
    borderWidth: 1,
    marginLeft: -80,
  },
  datePickerCustomStyles: {
    dateIcon: {
      position: "absolute",
      right: 0,
      top: 4,
      marginLeft: 0,
    },
    dateInput: {
      marginRight: 36,
    },
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  switchLabel: {
    marginRight: 10,
  },
  switch: {},
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  dateContainer: {
    marginBottom: 10,
  },
  rowContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    borderWidth: 1,
  },
  labelContainer: {
    flex: 1,
  },
  datePickerContainer: {
    flex: 4,
  },
});

export default TaskForm;
