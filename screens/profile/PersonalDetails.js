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
  ActivityIndicator,
} from "react-native";
import { useAuth } from "../../api/authContext";
import * as ImagePicker from "expo-image-picker";
import { BASE_URL, getUserData, resendOtp } from "../../api/authApi";
import { useRoute, useFocusEffect } from "@react-navigation/native";
import { updateProfilePicture } from "../../api/authApi";
import { Ionicons } from "@expo/vector-icons";

const PersonalDetails = ({ navigation }) => {
  const { userToken, refreshToken, signIn, isStaff } = useAuth();
  const [userData, setUserData] = useState({});
  const [newData, setNewData] = useState({});
  const [image, setImage] = useState(null);
  const route = useRoute();
  const [isPressedFirstName, setIsPressedFirstName] = useState(false);
  const [isPressedLastName, setIsPressedLastName] = useState(false);
  const [isPressedEmail, setIsPressedEmail] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    try {
      const data = await getUserData(userToken);
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
  const handleEmailVerification = async () => {
    try {
      await resendOtp(newData.email);
      navigation.navigate("OTPScreen", {
        email: newData.email,
        origin: "profile",
      });
    } catch (error) {
      console.error("Error updating email verification:", error);
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      try {
        console.log("Image Picker Result URI", result);
        console.log("Image Picker URI", result.assets[0].uri);
        setLoading(true);
        await updateProfilePicture(userToken, { uri: result.assets[0].uri });
        setLoading(false);
        const updatedData = await getUserData(userToken);
        console.log("Image changed");
        setUserData(updatedData.user_data);
        signIn(
          userToken,
          refreshToken,
          updatedData.user_data.profile_picture,
          isStaff
        );
      } catch (error) {
        console.error("Error updating profile picture:", error);
      }
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        {loading ? (
          <ActivityIndicator style={styles.activityIndicator} />
        ) : (
          <>
            {image ? (
              <Image source={{ uri: image }} style={styles.profileImage} />
            ) : newData.profile_picture ? (
              <Image
                source={{ uri: newData.profile_picture }}
                style={styles.profileImage}
              />
            ) : (
              <View style={styles.defaultProfileContainer}>
                <Ionicons name="person-outline" size={50} color="gray" />
              </View>
            )}
          </>
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

      <TouchableOpacity
        style={[
          styles.inputContainer,
          isPressedEmail && { backgroundColor: "#dcdcdc" },
        ]}
        onPressIn={() => {
          setIsPressedEmail(true);
        }}
        onPressOut={() => {
          setIsPressedEmail(false);
        }}
        onPress={newData.email_verified ? null : handleEmailVerification}
        activeOpacity={1}
        disabled={newData.email_verified}
      >
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter Email"
          value={newData.email}
          editable={false}
        />
        {newData.email_verified ? (
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
      </TouchableOpacity>

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
        <Text
          style={styles.buttonText}
          onPress={() => navigation.navigate("Support")}
        >
          Support
        </Text>
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
  activityIndicator: {
    width: 200,
    height: 200,
    borderRadius: 100,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#d2d2d2",
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
