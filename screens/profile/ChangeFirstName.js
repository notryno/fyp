// ChangeFirstName.js

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useAuth } from "../../api/authContext";
import { getUserData, updateUserData } from "../../api/authApi";
import { useRoute } from "@react-navigation/native";
import Ionicons from "@expo/vector-icons/Ionicons";

const ChangeFirstName = ({ navigation }) => {
  const { userToken } = useAuth();
  const [firstName, setFirstName] = useState("");
  const route = useRoute();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userData = await getUserData(userToken);
        setFirstName(userData.user_data.first_name);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchData();
  }, [userToken]);

  useEffect(() => {
    const updateProfile = route.params?.update;
    if (updateProfile) {
      handleUpdate();
      navigation.setParams({ update: false });
      navigation.navigate("PersonalDetails");
    }
  }, [route.params?.update]);

  const handleUpdate = async () => {
    try {
      const updatedData = await updateUserData(userToken, {
        first_name: firstName,
      });
      console.log("First name updated successfully:", updatedData);
    } catch (error) {
      console.error("Error updating first name:", error);
    }
  };

  const handleInputChange = (text) => {
    setFirstName(text);
  };

  const handleClear = () => {
    setFirstName("");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>First Name</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter New First Name"
          onChangeText={handleInputChange}
          value={firstName}
          autoFocus={true}
          keyboardShouldPersistTaps="handled"
          returnKeyType="none"
        />
        {firstName.length > 0 && (
          <TouchableOpacity style={styles.clearButton} onPress={handleClear}>
            <Ionicons name="close-circle" size={24} color="gray" />
          </TouchableOpacity>
        )}
      </View>
      <Text style={styles.text}>
        Add your first name to recieve a personalized and friendly experience!
        Enhance your experience and make interactions uniquely yours. {"\n"}
        {"\n"}
        This information will be visible to everyone.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderTopWidth: 1,
    borderColor: "lightgray",
  },
  text: {
    color: "grey",
    margin: 15,
    marginBottom: 0,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    height: 40,
    borderColor: "lightgray",
    borderBottomWidth: 1,
  },
  input: {
    flex: 1,
    height: "100%",
    marginLeft: 15,
    fontSize: 18,
  },
  clearButton: {
    padding: 8,
  },
});

export default ChangeFirstName;
