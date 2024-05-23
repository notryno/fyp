import React from "react";
import { View, Text, StyleSheet, SafeAreaView } from "react-native";
import { useRoute } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { ScrollView } from "react-native";

const NotificationDetailScreen = () => {
  const route = useRoute();
  const { notification } = route.params;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.card}>
        <View style={styles.iconContainer}>
          <Ionicons name="notifications-outline" size={48} color="black" />
        </View>
        <Text style={styles.title}>{notification.title}</Text>
        <ScrollView style={styles.messageContainer}>
          <Text style={styles.message}>{notification.message}</Text>
        </ScrollView>
        <View style={styles.infoContainer}>
          <Text style={styles.author}>
            Author: {notification.author.first_name}{" "}
            {notification.author.last_name}
          </Text>
          <Text style={styles.time}>
            Date: {new Date(notification.created_at).toLocaleString()}
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    // backgroundColor: "#F0F4F8",
    backgroundColor: "#f2f2f2",
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    width: "90%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  iconContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
    textAlign: "center",
  },
  message: {
    fontSize: 16,
    color: "#555",
    textAlign: "left",
    paddingVertical: 20,
  },
  messageContainer: {
    borderTopWidth: 1,
    borderTopColor: "#eee",
    maxHeight: 500,
  },
  infoContainer: {
    borderTopWidth: 1,
    borderTopColor: "#eee",
    paddingTop: 10,
  },
  author: {
    fontSize: 14,
    color: "#666",
    marginBottom: 5,
    textAlign: "center",
  },
  time: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
  },
});

export default NotificationDetailScreen;
