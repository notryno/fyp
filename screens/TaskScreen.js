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
} from "react-native";

import { useAuth } from "../api/authContext";
import { createTask, deleteTask, getTasks, updateTask } from "../api/authApi";

const TaskScreen = () => {
  const [tasks, setTasks] = useState([]);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const { userToken } = useAuth();

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await getTasks(userToken);
        setTasks(response); // Assuming the response is an array of tasks
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    fetchTasks();
  }, [userToken]);

  const handleAddTask = async () => {
    try {
      // Send a request to create a new task
      await createTask(userToken, {
        title: newTaskTitle,
        description: "Your description",
      });
      // Fetch tasks again after adding a new task
      const response = await getTasks(userToken);
      setTasks(response);
      // Clear the input field
      setNewTaskTitle("");
    } catch (error) {
      console.error("Error adding task:", error);
    }
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

  return (
    <View>
      <Text>Task Screen</Text>
      <TextInput
        placeholder="New Task Title"
        value={newTaskTitle}
        onChangeText={(text) => setNewTaskTitle(text)}
      />
      <Button title="Add Task" onPress={handleAddTask} />
      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View>
            <Text>{item.title}</Text>
            <Text>{item.description}</Text>
            <Text>Completed: {item.completed ? "Yes" : "No"}</Text>
            {!item.completed ? (
              <TouchableOpacity onPress={() => handleCompleteTask(item.id)}>
                <View
                  style={{
                    backgroundColor: "green",
                    padding: 10,
                    borderRadius: 5,
                    marginTop: 5,
                  }}
                >
                  <Text style={{ color: "white" }}>Complete Task</Text>
                </View>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity onPress={() => handleIncompleteTask(item.id)}>
                <View
                  style={{
                    backgroundColor: "orange",
                    padding: 10,
                    borderRadius: 5,
                    marginTop: 5,
                  }}
                >
                  <Text style={{ color: "white" }}>Mark as Incomplete</Text>
                </View>
              </TouchableOpacity>
            )}
            <TouchableOpacity onPress={() => confirmDeleteTask(item.id)}>
              <View
                style={{
                  backgroundColor: "red",
                  padding: 10,
                  borderRadius: 5,
                  marginTop: 5,
                }}
              >
                <Text style={{ color: "white" }}>Delete Task</Text>
              </View>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
};

export default TaskScreen;
