import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

const RegisterSuccess = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Success</Text>
      <Text style={styles.text}>Your account has been created</Text>
      <Ionicons
        name="checkmark-circle-outline"
        size={100}
        color="#4CAF50"
        style={styles.checkMark}
      />
      <TouchableOpacity
        style={styles.continueButton}
        onPress={() => navigation.navigate("Login")}
      >
        <Text style={styles.continueText}>Continue</Text>
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
  checkMark: {
    width: 100,
    height: 100,
    marginBottom: 16,
  },
  header: {
    fontSize: 26,
    marginBottom: 8,
  },
  text: {
    fontSize: 16,
  },
  continueButton: {
    padding: 12,
    backgroundColor: "#4CAF50",
    borderRadius: 8,
    marginTop: 8,
  },
  continueText: {
    color: "white",
    fontSize: 16,
    textAlign: "center",
  },
  checkMark: {
    width: 100,
    height: 100,
    marginBottom: 16,
  },
});

export default RegisterSuccess;
