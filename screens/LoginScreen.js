import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import axios from "axios";

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const handleLogin = async () => {
    try {
      const userData = { username: email, password };
      console.log("Login Process", userData);

      const result = await login(userData);
      console.log("Login successful:", result);
      // Handle successful login, e.g., store tokens, navigate to another screen
    } catch (error) {
      setError("Login failed. Please check your credentials.");
      console.error("Login failed:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
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
      <Button title="Login" onPress={handleLogin} />
      {error && <Text style={{ color: "red" }}>{error}</Text>}
      <Text
        style={styles.registerText}
        onPress={() => navigation.navigate("Register")}
      >
        Don't have an account? Register here.
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
  registerText: {
    marginTop: 20,
    color: "blue",
    textDecorationLine: "underline",
  },
});

export default LoginScreen;
