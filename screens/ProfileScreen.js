// ProfileScreen.js

import React from "react";
import { View, Text, StyleSheet, Button, Image } from "react-native";
import { useAuth } from "../api/authContext";

const ProfileScreen = () => {
  const { signOut, userProfile } = useAuth();

  const handleLogout = () => {
    signOut();
  };

  console.log("User Profile:", userProfile);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Profile Screen</Text>
      {userProfile && userProfile.profile_picture && (
        <Image
          source={{ uri: userProfile.profile_picture }}
          style={styles.profileImage}
        />
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
