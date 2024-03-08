// EventItem.js

import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

const EventItem = ({ title, time, type, location, color }) => {
  const navigation = useNavigation();

  const handlePress = () => {
    navigation.navigate("EventDescription", {
      title: title,
      time: time,
      type: type,
      location: location,
      color: color,
    });
  };

  return (
    <TouchableOpacity
      style={[styles.eventContainer, { backgroundColor: color }]}
      onPress={handlePress}
    >
      <View style={styles.eventDetails}>
        <View style={styles.titleContainer}>
          <Text style={[styles.title, color !== "#ffffff" && styles.whiteText]}>
            {title}
          </Text>
          <Text
            style={[
              styles.detailText,
              styles.time,
              color !== "#ffffff" && styles.whiteText,
            ]}
          >
            {time}
          </Text>
        </View>
        <Text
          style={[
            styles.detailText,
            styles.type,
            color !== "#ffffff" && styles.whiteText,
          ]}
        >
          {type}
        </Text>
        <View style={styles.locationContainer}>
          <Ionicons name="location-outline" size={18} color="white" />
          <Text
            style={[
              styles.detailText,
              styles.location,
              color !== "#ffffff" && styles.whiteText,
            ]}
          >
            {location}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  eventContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    marginBottom: 10,
    padding: 15,
  },
  eventDetails: {},
  titleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  title: {
    fontWeight: "bold",
    fontSize: 18,
    marginBottom: 5,
  },
  time: {
    fontStyle: "italic",
    marginBottom: 5,
  },
  type: {
    marginBottom: 5,
    // color: "blue",
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  location: {
    marginLeft: 5,
  },
  detailText: {
    fontSize: 14,
    marginBottom: 5,
  },
  whiteText: {
    color: "white",
  },
});

export default EventItem;
