// ProfileScreen.js

import React from "react";
import { Ionicons } from "@expo/vector-icons";
import {
  View,
  Text,
  StyleSheet,
  Button,
  Image,
  TouchableOpacity,
} from "react-native";
import { useAuth } from "../api/authContext";
import { BASE_URL } from "../api/authApi";
import { useNavigation } from "@react-navigation/native";

const ProfileScreen = () => {
  const { signOut, userProfile } = useAuth();
  const navigation = useNavigation();

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

      <View style={styles.line} />

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("PersonalDetails")}
      >
        <View style={styles.buttonContent}>
          <Ionicons
            name="person-outline"
            size={40}
            color="white"
            style={styles.icon}
          />
          <Text style={styles.buttonText}>Personal Details</Text>
          <Ionicons
            name="chevron-forward-outline"
            size={40}
            color="white"
            style={styles.iconRight}
          />
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("PersonalDetails")}
      >
        <View style={styles.buttonContent}>
          <Ionicons
            name="school-outline"
            size={40}
            color="white"
            style={styles.icon}
          />
          <Text style={styles.buttonText}>Grades</Text>
          <Ionicons
            name="chevron-forward-outline"
            size={40}
            color="white"
            style={styles.iconRight}
          />
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("PersonalDetails")}
      >
        <View style={styles.buttonContent}>
          <Ionicons
            name="people-outline"
            size={40}
            color="white"
            style={styles.icon}
          />
          <Text style={styles.buttonText}>Classroom</Text>
          <Ionicons
            name="chevron-forward-outline"
            size={40}
            color="white"
            style={styles.iconRight}
          />
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
  },
  profileImage: {
    width: 200,
    height: 200,
    borderRadius: 100,
    marginTop: 16,
    borderColor: "black",
    borderWidth: 0.2,
  },
  button: {
    width: "90%",
    alignSelf: "center",
    height: 70,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    marginVertical: 10,
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  icon: {
    marginRight: 10,
    borderWidth: 1,
    borderColor: "black",
    color: "black",
    padding: 5,
    borderRadius: 5,
  },
  iconRight: {
    marginLeft: 90,
    color: "black",
  },
  line: {
    width: "100%",
    borderBottomColor: "lightgray",
    borderBottomWidth: 1,
    marginVertical: 10,
  },
});

export default ProfileScreen;
