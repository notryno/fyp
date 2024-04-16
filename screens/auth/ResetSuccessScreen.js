import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

const ResetSuccessScreen = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Success</Text>
      <Text style={styles.text}>Your password has been resetted.</Text>
      <Ionicons
        name="checkmark-circle-outline"
        color="#4CAF50"
        style={styles.checkMark}
        size={100}
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
    width: 150,
    height: 150,
  },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 8,
  },
  text: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 60,
  },
  continueButton: {
    padding: 12,
    height: 50,
    width: 200,
    marginTop: 60,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
    borderRadius: "50%",
    backgroundColor: "black",
  },
  continueText: {
    color: "white",
    fontSize: 16,
    textAlign: "center",
    fontWeight: "bold",
  },
  checkMark: {
    width: 100,
    height: 100,
    marginBottom: 16,
  },
});

export default ResetSuccessScreen;
