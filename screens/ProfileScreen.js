// ProfileScreen.js

import React from "react";
import { View, Text, StyleSheet, Button, Image } from "react-native";
import { useAuth } from "../api/authContext";
import { BASE_URL } from "../api/authApi";

const ProfileScreen = () => {
  const { signOut, userProfile } = useAuth();

  const handleLogout = () => {
    signOut();
  };

  console.log("User Profile:", userProfile);

  const modifiedURL = BASE_URL.replace(/\/api\/$/, "");

  console.log("Profile Picture:", modifiedURL + userProfile);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Profile Screen</Text>
      {userProfile ? (
        <Image
          source={{ uri: modifiedURL + userProfile }}
          style={styles.profileImage}
        />
      ) : (
        <Text>Loading profile image...</Text>
      )}
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
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginTop: 16,
  },
});

export default ProfileScreen;
