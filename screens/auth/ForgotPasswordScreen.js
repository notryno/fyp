import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { resendOtp } from "../../api/authApi";

const ForgotPasswordScreen = () => {
  const [email, setEmail] = useState("");
  const [emailSent, setEmailSent] = useState(false);

  const navigation = useNavigation();

  const handleForgotPassword = () => {
    if (!email) {
      Alert.alert("Error", "Please enter your email.");
      return;
    }
    setEmailSent(true);
    resendOtp(email);
    Alert.alert(
      "Email Sent",
      "Please check your email for reset instructions."
    );
  };

  const handleContinue = () => {
    navigation.navigate("PasswordResetScreen", { email: email });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Forgot Password</Text>
      <Text style={styles.infoText}>
        Please enter your email to search for your account.
      </Text>
      {emailSent ? (
        <>
          <Text style={styles.infoText}>
            Check your email for reset instructions.
          </Text>
          <TouchableOpacity style={styles.button} onPress={handleContinue}>
            <Text style={styles.buttonText}>Continue</Text>
          </TouchableOpacity>
        </>
      ) : (
        <View>
          <TextInput
            style={styles.input}
            placeholder="Enter Email"
            onChangeText={(text) => setEmail(text)}
            autoCapitalize="none"
          />
          <TouchableOpacity
            style={styles.button}
            onPress={handleForgotPassword}
          >
            <Text style={styles.buttonText}>Reset Password</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: "40%",
    alignItems: "center",
    backgroundColor: "#f4f4f4",
    width: "100%",
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
    color: "#333",
    fontWeight: "bold",
  },
  input: {
    width: 340,
    height: 50,
    borderRadius: 8,
    borderColor: "#ccc",
    borderWidth: 1,
    marginBottom: 16,
    paddingLeft: 8,
    backgroundColor: "#fff",
  },
  button: {
    width: 340,
    height: 50,
    borderRadius: 8,
    borderRadius: "50%",
    backgroundColor: "black",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  infoText: {
    fontSize: 16,
    color: "#333",
    marginBottom: 16,
  },
});

export default ForgotPasswordScreen;
