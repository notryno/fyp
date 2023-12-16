// ChangePassword.js

import React, { useState } from "react";
import { View, Text, TextInput, Button } from "react-native";
import { updatePassword } from "../../api/authApi";

const ChangePassword = ({ userToken, navigation }) => {
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
    <View>
      <Text>Old Password</Text>
      <TextInput
        secureTextEntry
        value={oldPassword}
        onChangeText={setOldPassword}
      />

      <Text>New Password</Text>
      <TextInput
        secureTextEntry
        value={newPassword}
        onChangeText={setNewPassword}
      />

      <Text>Confirm Password</Text>
      <TextInput
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />

      <Button title="Change Password" onPress={handleChangePassword} />
    </View>
  );
};

export default ChangePassword;
