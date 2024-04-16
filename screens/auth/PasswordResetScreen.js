import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Pressable,
  Keyboard,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { verifyOtp, resendOtp, resetPassword } from "../../api/authApi";
import { useNavigation } from "@react-navigation/native";
import { useRoute } from "@react-navigation/native";

const PasswordResetScreen = () => {
  const route = useRoute();
  const { email } = route.params;
  const navigation = useNavigation();
  const [otp, setOTP] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState(null);
  const [focusedInput, setFocusedInput] = useState(null);
  const otpInputs = useRef([]);
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(60);
  const [timerActive, setTimerActive] = useState(false);
  const [otpValid, setOtpValid] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [resetToken, setResetToken] = useState("");

  useEffect(() => {
    const lastBox = otpInputs.current[5];
    if (lastBox && otp.every((value) => value !== "")) {
      handleOTPVerification();
    }
  }, [otp]);

  useEffect(() => {
    otpInputs.current[0]?.focus();
  }, []);

  const startResendTimer = () => {
    setTimerActive(true);
    const timerInterval = setInterval(() => {
      setResendTimer((prevTimer) => {
        if (prevTimer > 0) {
          return prevTimer - 1;
        } else {
          clearInterval(timerInterval);
          setTimerActive(false);
          return 0;
        }
      });
    }, 1000);
  };

  const handleOTPVerification = async () => {
    try {
      const otpValue = otp.join("");
      const result = await verifyOtp(email, otpValue, "reset_password");
      console.log("OTP verification successful:", result);
      if (result.success) {
        setOtpValid(true);
        setResetToken(result.reset_token);
        console.log("Reset token:", result.reset_token);
        setError(null);
      } else {
        setError("OTP verification failed. Please try again.");
      }
    } catch (error) {
      setError("OTP verification failed. Please try again.");
      console.error("OTP verification failed:", error);
    }
  };

  const handleResendOTP = async () => {
    try {
      setLoading(true);
      const result = await resendOtp(email);
      console.log("OTP resend successful:", result);
      setResendTimer(60);
      startResendTimer();
    } catch (error) {
      console.error("OTP resend failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChangeOTP = (index, value) => {
    if (value.length > 1) {
      value = value[value.length - 1];
    }
    const newOTP = [...otp];
    newOTP[index] = value;
    setOTP(newOTP);

    if (value && index < 5) {
      otpInputs.current[index + 1].focus();
    }

    if (!value && index > 0) {
      otpInputs.current[index - 1].focus();
    }
  };

  const handleInputFocus = (index) => {
    setFocusedInput(index);
  };

  const renderMaskedEmail = (email) => {
    const parts = email.split("@");
    const maskedEmail = `${parts[0][0]}${"*".repeat(parts[0].length - 2)}${
      parts[0][parts[0].length - 1]
    }@${parts[1]}`;
    return maskedEmail;
  };

  const handleResetPassword = async () => {
    try {
      if (!newPassword || !confirmPassword) {
        setError("Please enter new password and confirm password");
        return;
      }

      if (newPassword !== confirmPassword) {
        alert("New password and confirm password do not match");
        return;
      }
      const result = await resetPassword(email, newPassword, resetToken);
      console.log(result);
      if (!result.success) {
        alert("Password reset failed. Please try again.");
        return;
      } else if (result.success) {
        alert("Password reset successful");
        navigation.navigate("Login");
      }
    } catch (error) {
      console.error("Error updating password:", error);
      alert("Error updating password. Please try again.");
    }
  };

  return (
    <Pressable style={styles.container} onPress={Keyboard.dismiss}>
      <Text style={styles.title}>Reset Password</Text>
      {!otpValid ? (
        <>
          <Text style={styles.description}>
            We have sent a code via email to
          </Text>
          <Text style={styles.emailText}>{renderMaskedEmail(email)}</Text>
          <View style={styles.otpContainer}>
            {otp.map((value, index) => (
              <TextInput
                key={index}
                ref={(ref) => (otpInputs.current[index] = ref)}
                style={[
                  styles.otpInput,
                  focusedInput === index && styles.focusedInput,
                ]}
                maxLength={1}
                value={value}
                onChangeText={(text) => handleChangeOTP(index, text)}
                onFocus={() => handleInputFocus(index)}
                keyboardType="numeric"
              />
            ))}
          </View>
          {error && <Text style={styles.errorText}>{error}</Text>}
          {loading ? (
            <ActivityIndicator />
          ) : (
            <View style={styles.resendContainer}>
              <Text>
                Didn't receive the OTP?{" "}
                {timerActive ? (
                  <Text style={styles.timerText}>
                    Resend in {resendTimer} seconds
                  </Text>
                ) : (
                  <Text style={styles.resendText} onPress={handleResendOTP}>
                    Resend Code
                  </Text>
                )}
              </Text>
            </View>
          )}
        </>
      ) : (
        <View style={styles.resetContainer}>
          <Text style={styles.infoText}>
            Your password is best to be at least six characters and should
            include a combination of numbers, letters and special characters
            (!$@%).
          </Text>
          <View style={{ height: 30 }}>
            {error && <Text style={styles.errorText}>{error}</Text>}
          </View>
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

          <TouchableOpacity style={styles.button} onPress={handleResetPassword}>
            <Text style={styles.buttonText}>Reset Password</Text>
          </TouchableOpacity>
        </View>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    paddingTop: "20%",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    marginBottom: 8,
    textAlign: "center",
  },
  emailText: {
    fontSize: 18,
    marginBottom: 16,
    fontWeight: "bold",
  },
  otpContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  otpInput: {
    width: 40,
    height: 50,
    borderRadius: 8,
    borderColor: "#ccc",
    borderWidth: 1,
    marginRight: 10,
    textAlign: "center",
    fontSize: 20,
  },
  focusedInput: {
    borderColor: "blue",
  },
  errorText: {
    color: "red",
    marginBottom: 10,
    textAlign: "center",
  },
  resendContainer: {
    marginTop: 20,
    alignItems: "center",
  },
  resendText: {
    color: "blue",
    textDecorationLine: "underline",
  },
  timerText: {
    color: "#555",
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
  resetContainer: {
    flex: 1,
    width: "80%",
    alignItems: "center",
  },
  infoText: {
    marginBottom: 8,
    marginTop: 16,
    fontSize: 14,
    color: "#666",
  },
});

export default PasswordResetScreen;
