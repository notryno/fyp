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
} from "react-native";
import { verifyOtp, resendOtp } from "../../api/authApi";
import { useNavigation } from "@react-navigation/native";
import { useRoute } from "@react-navigation/native";

const OTPScreen = () => {
  const route = useRoute();
  const { email, origin } = route.params;
  const navigation = useNavigation();
  const [otp, setOTP] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState(null);
  const [focusedInput, setFocusedInput] = useState(null);
  const otpInputs = useRef([]);
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(60);
  const [timerActive, setTimerActive] = useState(false);

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
      const result = await verifyOtp(email, otpValue);
      console.log("OTP verification successful:", result);
      if (result.success) {
        if (origin === "profile") {
          navigation.navigate("PersonalDetails");
        } else {
          navigation.navigate("RegisterSuccess");
        }
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
    const maskedEmail = `${parts[0][0]}${"*".repeat(5)}@${parts[1]}`;
    return maskedEmail;
  };

  return (
    <Pressable style={styles.container} onPress={Keyboard.dismiss}>
      <Text style={styles.title}>Verify Email</Text>
      <Text style={styles.description}>We have sent a code via email to</Text>
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
});

export default OTPScreen;
