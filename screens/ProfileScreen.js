// ProfileScreen.js

import React from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import { useAuth } from "../api/authContext";

const ProfileScreen = () => {
  const { signOut } = useAuth();

  const handleLogout = () => {
    signOut();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Profile Screen</Text>
      <Button title="Logout" onPress={handleLogout} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
  },
});

export default ProfileScreen;
