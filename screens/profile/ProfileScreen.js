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
  SafeAreaView,
} from "react-native";
import { useAuth } from "../../api/authContext";
import { getUserData } from "../../api/authApi";
import { useNavigation, useFocusEffect } from "@react-navigation/native";

const ProfileScreen = () => {
  const { signOut, userProfile, userToken } = useAuth();
  const navigation = useNavigation();
  const [userData, setUserData] = useState(null);
  const [isPressedLastName, setIsPressedLastName] = useState(false);

  useEffect(() => {
    fetchData();
  }, [userToken]);

  useFocusEffect(
    React.useCallback(() => {
      fetchData();
    }, [])
  );

  const fetchData = async () => {
    try {
      const data = await getUserData(userToken);
      setUserData(data.user_data);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const handleLogout = () => {
    signOut();
  };

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
        <Text style={{ fontSize: 34, fontWeight: "bold" }}>Profile</Text>
      </View>
      <View style={styles.container}>
        <TouchableOpacity onPress={() => navigation.navigate("QrCode")}>
          {userProfile ? (
            <View style={styles.defaultProfileContainer}>
              <Image
                source={{ uri: userProfile }}
                style={styles.profileImage}
              />
            </View>
          ) : (
            <View style={styles.defaultProfileContainer}>
              <Ionicons name="person-outline" size={50} color="gray" />
            </View>
          )}
        </TouchableOpacity>

        <View style={styles.infoContainer}>
          {userData && (
            <>
              <Text style={styles.emailText}>
                {userData.email}{" "}
                {userData.email_verified ? (
                  <Ionicons
                    name="shield-checkmark-outline"
                    size={20}
                    color="green"
                    style={{ marginLeft: 4 }}
                  />
                ) : (
                  <Ionicons
                    name="warning-outline"
                    size={20}
                    color="red"
                    style={{ marginLeft: 4 }}
                  />
                )}
              </Text>
              <Text style={styles.nameText}>
                {userData.first_name} {userData.last_name}
              </Text>
            </>
          )}
        </View>

        <View style={styles.line} />

        <TouchableOpacity
          style={[styles.button]}
          onPress={() => navigation.navigate("PersonalDetails")}
        >
          <View style={styles.buttonContent}>
            <View style={styles.iconContainer}>
              <Ionicons
                name="person-outline"
                size={30}
                color="white"
                style={styles.icon}
              />
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.buttonText}>Personal Details</Text>
            </View>
            <View style={styles.rightIconContainer}>
              <Ionicons
                name="chevron-forward-outline"
                size={30}
                color="white"
                style={styles.iconRight}
              />
            </View>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("Grades")}
        >
          <View style={styles.buttonContent}>
            <View style={styles.iconContainer}>
              <Ionicons
                name="school-outline"
                size={30}
                color="white"
                style={styles.icon}
              />
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.buttonText}>Grades</Text>
            </View>
            <View style={styles.rightIconContainer}>
              <Ionicons
                name="chevron-forward-outline"
                size={30}
                color="white"
                style={styles.iconRight}
              />
            </View>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("Classroom")}
        >
          <View style={styles.buttonContent}>
            <View style={styles.iconContainer}>
              <Ionicons
                name="people-outline"
                size={30}
                color="white"
                style={styles.icon}
              />
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.buttonText}>Classroom</Text>
            </View>
            <View style={styles.rightIconContainer}>
              <Ionicons
                name="chevron-forward-outline"
                size={30}
                color="white"
                style={styles.iconRight}
              />
            </View>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("Courses")}
        >
          <View style={styles.buttonContent}>
            <View style={styles.iconContainer}>
              <Ionicons
                name="book-outline"
                size={30}
                color="white"
                style={styles.icon}
              />
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.buttonText}>Courses</Text>
            </View>
            <View style={styles.rightIconContainer}>
              <Ionicons
                name="chevron-forward-outline"
                size={30}
                color="white"
                style={styles.iconRight}
              />
            </View>
          </View>
        </TouchableOpacity>

        <View style={styles.line} />

        <TouchableOpacity
          style={[
            {
              width: "100%",
              padding: 15,
              paddingLeft: 30,
              marginTop: -10,
            },
            isPressedLastName && { backgroundColor: "#dcdcdc" },
          ]}
          onPressIn={() => {
            setIsPressedLastName(true);
          }}
          onPressOut={() => {
            setIsPressedLastName(false);
          }}
          onPress={() => handleLogout()}
          activeOpacity={1}
        >
          <Text style={{ fontSize: 16, color: "red" }}>Log out</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#f2f2f2",
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
  },
  profileImage: {
    width: 200,
    height: 200,
    borderRadius: 100,
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
    height: 65,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  iconContainer: {
    alignItems: "center",
    width: 50,
    height: 50,
    justifyContent: "center",
    borderRadius: 70,
    backgroundColor: "white",
    shadowColor: "black",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  rightIconContainer: {
    alignItems: "center",
    width: 50,
    height: 50,
    justifyContent: "center",
    borderRadius: 70,
  },
  textContainer: {
    flex: 1,
    paddingLeft: 12,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  icon: {
    color: "black",
  },
  iconRight: {
    marginLeft: 10,
    color: "gray",
    fontSize: 25,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  line: {
    width: "100%",
    borderBottomColor: "lightgray",
    borderBottomWidth: 1,
    marginVertical: 20,
  },
  defaultProfileContainer: {
    width: 200,
    height: 200,
    borderRadius: 100,
    marginTop: 16,
    borderColor: "black",
    borderWidth: 0.2,
    backgroundColor: "lightgray",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "black",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
    elevation: 5,
  },
});

export default ProfileScreen;
