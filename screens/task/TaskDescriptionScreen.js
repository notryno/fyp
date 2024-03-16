import React from "react";
import { View, Text, Button } from "react-native";

const TaskDescriptionScreen = ({
  route, // Add route to access navigation params
  navigation, // Add navigation to navigate back
}) => {
  // Destructure data from route.params
  const { title, description, dueDate, dueTime, onMarkCompleted, onDelete } =
    route.params;

  return (
    <View style={{ flex: 1, padding: 10 }}>
      <Text>Title: {title}</Text>
      <Text>Description: {description}</Text>
      <Text>
        Date/Time: {dueDate} {dueTime}
      </Text>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginTop: 10,
        }}
      >
        <Button title="Mark Completed" onPress={onMarkCompleted} />
        <Button title="Delete" onPress={onDelete} />
      </View>
    </View>
  );
};

export default TaskDescriptionScreen;
