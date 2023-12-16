// ProfileScreen.js

import React, { useState, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import {
  View,
  Text,
  StyleSheet,
  Button,
  Image,
  TouchableOpacity,
} from "react-native";
import { useAuth } from "../../api/authContext";
import { BASE_URL, getUserData } from "../../api/authApi";
import { useNavigation } from "@react-navigation/native";

const ProfileScreen = () => {
  const { signOut, userProfile, userToken } = useAuth();
  const navigation = useNavigation();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getUserData(userToken);
        setUserData(data.user_data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchData();
  }, [userToken]);

  const handleLogout = () => {
    signOut();
  };
  console.log("User Profile:", userProfile);

  const modifiedURL = BASE_URL.replace(/\/api\/$/, "");

  console.log("Profile Picture:", modifiedURL + userProfile);

  return (
    <View style={styles.container}>
      {userProfile ? (
        <Image
          source={{ uri: modifiedURL + userProfile }}
          style={styles.profileImage}
        />
      ) : (
        <Text>Loading profile image...</Text>
      )}

      <View style={styles.infoContainer}>
        {userData && (
          <>
            <Text style={styles.emailText}>{userData.email}</Text>
            <Text style={styles.nameText}>
              {userData.first_name} {userData.last_name}
            </Text>
          </>
        )}
      </View>

      <View style={styles.line} />

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("PersonalDetails")}
      >
        <View style={styles.buttonContent}>
          <View style={styles.iconContainer}>
            <Ionicons
              name="person-outline"
              size={40}
              color="white"
              style={styles.icon}
            />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.buttonText}>Personal Details</Text>
          </View>
          <View style={styles.iconContainer}>
            <Ionicons
              name="chevron-forward-outline"
              size={40}
              color="white"
              style={styles.iconRight}
            />
          </View>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("PersonalDetails")}
      >
        <View style={styles.buttonContent}>
          <View style={styles.iconContainer}>
            <Ionicons
              name="school-outline"
              size={40}
              color="white"
              style={styles.icon}
            />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.buttonText}>Grades</Text>
          </View>
          <View style={styles.iconContainer}>
            <Ionicons
              name="chevron-forward-outline"
              size={40}
              color="white"
              style={styles.iconRight}
            />
          </View>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("PersonalDetails")}
      >
        <View style={styles.buttonContent}>
          <View style={styles.iconContainer}>
            <Ionicons
              name="people-outline"
              size={40}
              color="white"
              style={styles.icon}
            />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.buttonText}>Classroom</Text>
          </View>
          <View style={styles.iconContainer}>
            <Ionicons
              name="chevron-forward-outline"
              size={40}
              color="white"
              style={styles.iconRight}
            />
          </View>
        </View>
      </TouchableOpacity>

      <Button title="Logout" onPress={handleLogout} />
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
  infoContainer: {
    marginTop: 16,
    alignItems: "center",
  },
  emailText: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  nameText: {
    fontSize: 16,
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
    flex: 1,
  },
  iconContainer: {
    flex: 0.2,
    alignItems: "center",
  },
  textContainer: {
    flex: 0.6,
    alignItems: "center",
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  icon: {
    borderWidth: 1,
    borderColor: "black",
    color: "black",
    padding: 5,
    borderRadius: 5,
  },
  iconRight: {
    marginLeft: 10,
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
