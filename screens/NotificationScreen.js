// NotificationScreen.js

import React from "react";
import { View, Text, StyleSheet, SafeAreaView } from "react-native";

const NotificationScreen = () => {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          padding: 20,
          backgroundColor: "white",
        }}
      >
        <Text style={{ fontSize: 34, fontWeight: "bold" }}>Notifications</Text>
      </View>
      <View style={styles.container}>
        <Text style={styles.text}>Notification Screen</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f2f2f2",
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
  },
});

export default NotificationScreen;
