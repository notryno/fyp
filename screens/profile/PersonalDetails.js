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
import { useAuth } from "../../api/authContext";
import * as ImagePicker from "expo-image-picker";
import { BASE_URL, getUserData, updateUserData } from "../../api/authApi";
import { useRoute, useFocusEffect } from "@react-navigation/native";
import { updateProfilePicture } from "../../api/authApi";
import { Ionicons } from "@expo/vector-icons";

const PersonalDetails = ({ navigation }) => {
  const { userToken, signIn } = useAuth();
  const [userData, setUserData] = useState({});
  const [newData, setNewData] = useState({});
  const [image, setImage] = useState(null);
  const route = useRoute();
  const [isPressedFirstName, setIsPressedFirstName] = useState(false);
  const [isPressedLastName, setIsPressedLastName] = useState(false);

  const modifiedURL = BASE_URL.replace(/\/api\/$/, "");

  const fetchData = async () => {
    try {
      const data = await getUserData(userToken);
      console.log("Personal details in the screen:", data);
      setNewData(data.user_data);
    } catch (error) {
      console.error("Error fetching personal details:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [userToken]);

  useEffect(() => {
    const updateProfile = route.params?.update;
    if (updateProfile) {
      handleUpdate();
    }
  }, [route.params?.update]);

  useFocusEffect(
    React.useCallback(() => {
      fetchData();
    }, [])
  );

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      setImage(result.uri);
      try {
        await updateProfilePicture(userToken, { uri: result.uri });
        const updatedData = await getUserData(userToken);
        setUserData(updatedData.user_data);
        signIn(userToken, updatedData.user_data.profile_picture);
      } catch (error) {
        console.error("Error updating profile picture:", error);
      }
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        {image ? (
          <Image source={{ uri: image }} style={styles.profileImage} />
        ) : newData.profile_picture ? (
          <Image
            source={{ uri: modifiedURL + newData.profile_picture }}
            style={styles.profileImage}
          />
        ) : (
          <View style={styles.defaultProfileContainer}>
            <Ionicons name="person-outline" size={50} color="gray" />
          </View>
        )}
        <Button title="Edit picture" onPress={pickImage} />
      </View>

      <View style={styles.line} />

      <TouchableOpacity
        style={[
          styles.inputContainer,
          isPressedFirstName && { backgroundColor: "#dcdcdc" },
        ]}
        onPressIn={() => {
          setIsPressedFirstName(true);
        }}
        onPressOut={() => {
          setIsPressedFirstName(false);
        }}
        onPress={() => navigation.navigate("ChangeFirstName")}
        activeOpacity={1}
      >
        <Text style={styles.label}>First Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter First Name"
          value={newData.first_name}
          editable={false}
        />
      </TouchableOpacity>

      <View style={styles.rightLine} />

      <TouchableOpacity
        style={[
          styles.inputContainer,
          isPressedLastName && { backgroundColor: "#dcdcdc" },
        ]}
        onPressIn={() => {
          setIsPressedLastName(true);
        }}
        onPressOut={() => {
          setIsPressedLastName(false);
        }}
        onPress={() => navigation.navigate("ChangeLastName")}
        activeOpacity={1}
      >
        <Text style={styles.label}>Last Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter Last Name"
          value={newData.last_name}
          editable={false}
        />
      </TouchableOpacity>

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
        <Text
          style={styles.buttonText}
          onPress={() => navigation.navigate("Password")}
        >
          Change Password
        </Text>
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
  defaultProfileContainer: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: "lightgray",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default PersonalDetails;
