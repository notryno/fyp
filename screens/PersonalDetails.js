// PersonalDetails.js

import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Button,
  TextInput,
  Image,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useAuth } from "../api/authContext";
import * as ImagePicker from "expo-image-picker";
import { BASE_URL, getUserData, updateUserData } from "../api/authApi";
import { useRoute } from "@react-navigation/native";

const PersonalDetails = (navigation) => {
  const { userToken, signIn } = useAuth();
  const [userData, setUserData] = useState({});
  const [newData, setNewData] = useState({});
  const [image, setImage] = useState(null);
  const route = useRoute();

  const modifiedURL = BASE_URL.replace(/\/api\/$/, "");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getUserData(userToken);
        console.log("Personal details:", data);
        setUserData(data.user_data);
        setNewData(data.user_data);
      } catch (error) {
        console.error("Error fetching personal details:", error);
      }
    };

    fetchData();
  }, [userToken]);

  useEffect(() => {
    const updateProfile = route.params?.update;
    if (updateProfile) {
      handleUpdate();
    }
  }, [route.params?.update]);

  const handleUpdate = async () => {
    try {
      console.log("User Token:", userToken);
      const updatedData = await updateUserData(userToken, newData);
      console.log("newData:", newData);
      console.log("updatedData:", updatedData);
      setUserData(updatedData);
      signIn(userToken, updatedData.profile_picture);
      console.log("Personal details updated successfully:", updatedData);
    } catch (error) {
      console.error("Error updating personal details:", error);
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      setImage(result.uri);
      setNewData({ ...newData, profile_picture: { uri: result.uri } });
    }
  };

  return (
    <View>
      <View style={styles.imageContainer}>
        {image ? (
          <Image source={{ uri: image }} style={styles.profileImage} />
        ) : newData.profile_picture ? (
          <Image
            source={{ uri: modifiedURL + newData.profile_picture }}
            style={styles.profileImage}
          />
        ) : (
          <Text>Loading profile image...</Text>
        )}
        <Button title="Edit Profile" onPress={pickImage} />
      </View>

      <View style={styles.line} />

      <View style={styles.inputContainer}>
        <Text style={styles.label}>First Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter First Name"
          value={newData.first_name}
          onChangeText={(text) => setNewData({ ...newData, first_name: text })}
        />
      </View>

      <View style={styles.rightLine} />

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Last Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter Last Name"
          value={newData.last_name}
          onChangeText={(text) => setNewData({ ...newData, last_name: text })}
        />
      </View>

      <View style={styles.rightLine} />

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter Email"
          value={newData.email}
          editable={false}
        />
      </View>

      <View style={styles.line} />

      <TouchableOpacity style={styles.buttonContainer}>
        <Text style={styles.buttonText}>Change Password</Text>
      </TouchableOpacity>

      <View style={styles.line} />

      <TouchableOpacity style={styles.buttonContainer}>
        <Text style={styles.buttonText}>Support</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  imageContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    marginTop: 40,
  },
  profileImage: {
    width: 200,
    height: 200,
    borderRadius: 100,
    marginBottom: 10,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    height: 50,
  },
  label: {
    fontSize: 16,
    width: "25%",
    marginLeft: "2%",
    marginRight: "5%",
  },
  input: {
    width: "70%",
    fontSize: 16,
  },
  line: {
    width: "100%",
    borderBottomColor: "lightgray",
    borderBottomWidth: 1,
    marginVertical: 10,
  },
  rightLine: {
    width: "68%",
    borderBottomColor: "lightgray",
    borderBottomWidth: 1,
    alignSelf: "flex-end",
  },
  buttonContainer: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  buttonText: {
    fontFamily: "System",
    color: "#007aff",
    fontSize: 16,
    textAlign: "center",
  },
});

export default PersonalDetails;
