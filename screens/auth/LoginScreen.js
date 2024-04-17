import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { login } from "../../api/authApi";
import { useAuth } from "../../api/authContext";

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const { signIn } = useAuth();

  const handleLogin = async () => {
    try {
      const userData = { email, password };
      console.log("Login Process", userData);

      if (!email || !password) {
        setError("Please enter email and password.");
        return;
      }

      const result = await login(userData);
      console.log("Login successful:", result);
      console.log("Profile Picture result:", result.profile_picture);
      signIn(result.access_token, result.profile_picture);
    } catch (error) {
      setError("Login failed. Please check your credentials.");
      console.error("Login failed:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign In</Text>
      <View style={{ height: 40 }}>
        {error && <Text style={styles.errorText}>{error}</Text>}
      </View>

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
      <TouchableOpacity
        title="Login"
        style={styles.button}
        onPress={handleLogin}
      >
        <View style={styles.buttonContent}>
          <Text style={styles.buttonText}>Sign In</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate("ForgotPassword")}>
        <Text style={styles.forgotText}>Forgotton Password?</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => navigation.navigate("Register")}
        style={styles.registerButton}
      >
        <View style={styles.registerContent}>
          <Text style={styles.registerText}>Create new account</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f4f4f4",
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
    color: "#333",
    fontWeight: "bold",
  },
  input: {
    width: "80%",
    height: 50,
    borderRadius: 8,
    borderColor: "#ccc",
    borderWidth: 1,
    marginBottom: 16,
    paddingLeft: 8,
    backgroundColor: "#fff",
  },
  errorText: {
    color: "red",
    marginBottom: 10,
    textAlign: "center",
  },
  button: {
    width: 340,
    height: 50,
    padding: 10,
    borderRadius: "50%",
    borderColor: "#333",
    borderWidth: 1,
    marginBottom: 16,
    backgroundColor: "black",
    justifyContent: "center",
    alignItems: "center",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  registerButton: {
    width: 340,
    height: 50,
    borderRadius: "50%",
    borderColor: "#333",
    borderWidth: 2,
    marginBottom: 16,
    top: "90%",
    position: "absolute",
  },
  registerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  registerText: {
    color: "#333",
    fontWeight: "bold",
    fontSize: 16,
  },
  linkText: {
    color: "blue",
    textDecorationLine: "underline",
  },
  forgotText: {
    color: "black",
  },
});

export default LoginScreen;
