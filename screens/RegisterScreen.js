// RegisterScreen.js

import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import { register } from "../api/authApi";
import RegisterSuccess from "./RegisterSuccess";
import * as ImagePicker from "expo-image-picker";

const RegisterScreen = ({ navigation }) => {
  const [first_name, setFirstName] = useState("");
  const [last_name, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [profile_picture, setProfilePicture] = useState(null);

  useEffect(() => {
    (async () => {
      if (Platform.OS !== "web") {
        const { status } =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
          alert("Sorry, we need camera roll permissions to make this work!");
        }
      }
    })();
  }, []);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      setProfilePicture(result.uri);
    }
  };

  const handleRegister = async () => {
    try {
      if (password !== confirmPassword) {
        setError("Passwords do not match");
        return;
      }

      const userData = {
        first_name,
        last_name,
        username: email,
        email,
        password,
        profile_picture,
      };
      console.log("Registration Process", userData);
      const result = await register(userData);
      console.log("Registration successful:", result);
      setRegistrationSuccess(true);
    } catch (error) {
      setError("Registration failed. Please try again."); // You can customize this message based on the error
      console.log(error);
      console.error("Registration failed:", error);
    }
  };

  if (registrationSuccess) {
    // Render the success screen
    return <RegisterSuccess />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register</Text>
      {profile_picture && (
        <Image source={{ uri: profile_picture }} style={styles.profileImage} />
      )}

      <Button title="Pick an image from camera roll" onPress={pickImage} />
      <TextInput
        style={styles.input}
        placeholder="First Name"
        autoCompleteType="name"
        onChangeText={(text) => setFirstName(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Last Name"
        autoCompleteType="name"
        onChangeText={(text) => setLastName(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        onChangeText={(text) => setEmail(text)}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        onChangeText={(text) => setPassword(text)}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        secureTextEntry
        onChangeText={(text) => setConfirmPassword(text)}
        autoCapitalize="none"
      />
      <Button title="Register" onPress={handleRegister} />
      {error && <Text style={{ color: "red" }}>{error}</Text>}
      <Text
        style={styles.loginText}
        onPress={() => navigation.navigate("Login")}
      >
        Already have an account? Login here.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
  },
  input: {
    width: "80%",
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 16,
    paddingLeft: 8,
  },
  loginText: {
    marginTop: 20,
    color: "blue",
    textDecorationLine: "underline",
  },
});

export default RegisterScreen;
