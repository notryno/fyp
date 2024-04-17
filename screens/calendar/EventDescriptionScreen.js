import React from "react";
import { View, Text, StyleSheet } from "react-native";

const EventDescriptionScreen = ({ route }) => {
  const { title, time, type, location, description, color } = route.params;

  return (
    <View style={[styles.container, { backgroundColor: color }]}>
      <Text style={styles.title}>Title: {title}</Text>
      <Text style={styles.text}>Time: {time}</Text>
      <Text style={styles.text}>Type: {type}</Text>
      <Text style={styles.text}>Location: {location}</Text>
      <Text style={styles.text}>Description: {description}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    color: "white",
  },
  text: {
    fontSize: 18,
    marginBottom: 5,
    color: "white",
  },
});

export default EventDescriptionScreen;
