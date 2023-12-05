// RegisterScreen.js
import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import axios from "axios";
import { register } from "../api/authApi";

const RegisterScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);

  const handleRegister = async () => {
    try {
      if (password !== confirmPassword) {
        setError("Passwords do not match");
        return;
      }

      const userData = { username: email, email, password };
      console.log("Registration Process", userData);
      const result = await register(userData);
      console.log("Registration successful:", result);
      // Handle successful registration, e.g., navigate to another screen
    } catch (error) {
      setError("Registration failed. Please try again."); // You can customize this message based on the error
      console.error("Registration failed:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register</Text>
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
