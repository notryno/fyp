import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import { updatePassword } from "../../api/authApi";
import { useAuth } from "../../api/authContext";

const ChangePassword = () => {
  const { userToken } = useAuth();
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleChangePassword = async () => {
    try {
      if (!oldPassword || !newPassword || !confirmPassword) {
        alert("Please fill in all fields");
        return;
      }

      if (newPassword !== confirmPassword) {
        alert("New password and confirm password do not match");
        return;
      }
      await updatePassword(userToken, { oldPassword, newPassword });
      alert("Password updated successfully");
    } catch (error) {
      console.error("Error updating password:", error);
      alert("Error updating password. Please try again.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.infoText}>
        Your password is best to be at least six characters and should include a
        combination of numbers, letters and special characters (!$@%).
      </Text>
      <TextInput
        style={styles.input}
        secureTextEntry
        value={oldPassword}
        placeholder="Current Password"
        onChangeText={setOldPassword}
      />

      <TextInput
        style={styles.input}
        secureTextEntry
        value={newPassword}
        placeholder="New Password"
        onChangeText={setNewPassword}
      />

      <TextInput
        style={styles.input}
        secureTextEntry
        value={confirmPassword}
        placeholder="Confirm New Password"
        onChangeText={setConfirmPassword}
      />

      <Button title="Change Password" onPress={handleChangePassword} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  infoText: {
    marginBottom: 16,
    fontSize: 14,
    color: "#666",
  },
  input: {
    height: 50,
    borderRadius: 8,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 8,
  },
});

export default ChangePassword;
