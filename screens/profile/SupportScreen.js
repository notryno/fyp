import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Alert,
  TouchableOpacity,
  Linking,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";

const SupportScreen = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async () => {
    if (!name || !email || !message) {
      Alert.alert("Error", "Please fill out all fields");
      return;
    }

    try {
      await axios.post("https://your-api-endpoint.com/support", {
        name,
        email,
        message,
      });
      Alert.alert("Success", "Your message has been sent");
      setName("");
      setEmail("");
      setMessage("");
    } catch (error) {
      Alert.alert("Error", "There was a problem sending your message");
    }
  };

  const handlePhonePress = () => {
    Linking.openURL("tel:+1234567890");
  };

  const handleEmailPress = () => {
    Linking.openURL("mailto:support@yourdomain.com?subject=Support%20Request");
  };

  const handleMessagePress = () => {
    Linking.openURL(`sms:+1234567890`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Support</Text>
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={[styles.input, { height: 150 }]}
        placeholder="Message"
        value={message}
        onChangeText={setMessage}
        multiline
      />
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Submit</Text>
      </TouchableOpacity>
      <View style={styles.linkContainer}>
        <TouchableOpacity onPress={handlePhonePress} style={styles.link}>
          <Ionicons name="call-outline" size={20} color="black" />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleEmailPress} style={styles.link}>
          <Ionicons name="mail-outline" size={20} color="black" />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleMessagePress} style={styles.link}>
          <Ionicons name="chatbubble-outline" size={20} color="black" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f8f8f8",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  input: {
    width: "90%",
    height: 50,
    borderRadius: 8,
    borderColor: "#ccc",
    borderWidth: 1,
    marginTop: 16,
    paddingLeft: 8,
    backgroundColor: "#fff",
  },
  linkContainer: {
    marginTop: 30,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "50%",
  },
  link: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    borderColor: "#ccc",
    backgroundColor: "white",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  button: {
    width: 350,
    height: 50,
    padding: 10,
    borderRadius: "50%",
    borderColor: "#333",
    borderWidth: 1,
    marginBottom: 16,
    backgroundColor: "black",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 40,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    alignSelf: "center",
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
});

export default SupportScreen;
