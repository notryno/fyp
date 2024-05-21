import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Image,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { register } from "../../api/authApi";
import OTPScreen from "./OTPScreen";
import * as ImagePicker from "expo-image-picker";
import Ionicons from "@expo/vector-icons/Ionicons";
import axios from "axios";

const RegisterScreen = ({ navigation }) => {
  const [first_name, setFirstName] = useState("");
  const [last_name, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [profile_picture, setProfilePicture] = useState(null);
  const [loading, setLoading] = useState(false);
  const timestamp = new Date().getTime();
  const fileName = `profile_picture_${timestamp}.jpg`;
  const CLOUDINARY_URL =
    "https://api.cloudinary.com/v1_1/dqxfn5mdd/image/upload";
  const CLOUDINARY_UPLOAD_PRESET = "schedule";

  useEffect(() => {
    (async () => {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        alert("Sorry, we need camera roll permissions to make this work!");
      }
    })();
  }, []);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    console.log("Image Picker Result", result);

    if (!result.canceled) {
      console.log("Image Picker Result URI", result.assets[0].uri);
      setProfilePicture(result.assets[0].uri);
    }
  };

  const uploadImageToCloudinary = async (imageUri) => {
    const data = new FormData();
    data.append("file", {
      uri: imageUri,
      type: "image/jpeg",
      name: "profile_picture.jpg",
    });
    data.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

    try {
      const response = await axios.post(CLOUDINARY_URL, data);
      console.log("Image uploaded to Cloudinary:", response.data.secure_url);
      return response.data.secure_url;
    } catch (error) {
      console.error("Error uploading image to Cloudinary:", error);
      throw error;
    }
  };

  const handleRegister = async () => {
    try {
      if (password !== confirmPassword) {
        setError("Passwords do not match");
        return;
      }

      if (!first_name || !last_name || !email || !password) {
        setError("Please fill in all fields");
        return;
      }

      setLoading(true);

      const formData = new FormData();
      formData.append("first_name", first_name);
      formData.append("last_name", last_name);
      formData.append("username", email);
      formData.append("email", email);
      formData.append("password", password);

      let profileImageUrl = null;
      if (profile_picture) {
        profileImageUrl = await uploadImageToCloudinary(profile_picture);
        formData.append("profile_picture", profileImageUrl);
      }

      // if (profile_picture) {
      //   formData.append("profile_picture", {
      //     uri: profile_picture,
      //     type: "image/jpeg",
      //     name: fileName,
      //   });
      // }

      const result = await register(formData);

      navigation.navigate("OTPScreen", { email: email });
    } catch (error) {
      let errorMessage = "Registration failed. Please try again.";
      if (error.email && Array.isArray(error.email) && error.email.length > 0) {
        errorMessage = error.email[0];
      }
      setError(errorMessage);
      console.error("Registration failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account</Text>
      {profile_picture ? (
        <Image source={{ uri: profile_picture }} style={styles.profileImage} />
      ) : (
        <View style={styles.defaultProfileContainer}>
          <Ionicons name="person-outline" size={50} color="gray" />
        </View>
      )}

      <Button title="Add Picture" onPress={pickImage} />
      <View style={{ height: 20 }}>
        {error && <Text style={styles.errorText}>{error}</Text>}
      </View>
      <TextInput
        style={styles.input}
        placeholder="First Name"
        autoCompleteType="name"
        onChangeText={(text) => setFirstName(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Last Name"
        autoCompleteType="name"
        onChangeText={(text) => setLastName(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        onChangeText={(text) => setEmail(text)}
        autoCapitalize="none"
        keyboardType="email-address"
        autoCorrect={false}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        onChangeText={(text) => setPassword(text)}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        secureTextEntry
        onChangeText={(text) => setConfirmPassword(text)}
        autoCapitalize="none"
      />
      <View style={{ marginBottom: 10 }} />
      {loading ? (
        <ActivityIndicator />
      ) : (
        <TouchableOpacity
          title="Register"
          style={styles.button}
          onPress={handleRegister}
        >
          <View style={styles.buttonContent}>
            <Text style={styles.buttonText}>Register</Text>
          </View>
        </TouchableOpacity>
      )}
      <TouchableOpacity
        onPress={() => navigation.navigate("Login")}
        style={styles.linkText}
      >
        <Text style={styles.loginText}>Already have an account?</Text>
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
    marginTop: 16,
    paddingLeft: 8,
    backgroundColor: "#fff",
  },
  errorText: {
    color: "red",
    textAlign: "center",
    lineHeight: 0,
    margin: 0,
  },
  defaultProfileContainer: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: "lightgray",
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
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
  },
  loginText: {
    marginTop: 20,
    color: "#333",
    fontSize: 16,
  },
  linkText: {
    color: "blue",
    position: "absolute",
    bottom: "5%",
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
    marginTop: 10,
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
});

export default RegisterScreen;
