import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { Camera } from "expo-camera/legacy";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";

const ScanQr = ({ navigation }) => {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [focusDepth, setFocusDepth] = useState(0);
  const [flash, setFlash] = useState(Camera.Constants.FlashMode.off);

  useEffect(() => {
    const getCameraPermissions = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    };

    getCameraPermissions();
  }, []);

  const handleBarCodeScanned = ({ data }) => {
    setScanned(true);
    navigation.navigate("PublicProfile", { userId: data });
  };

  const handleTapToFocus = (event) => {
    setFocusDepth(0);
    setScanned(false);
    setTimeout(() => {
      setFocusDepth(1);
    }, 1000);
  };

  if (hasPermission === null) {
    return <View style={styles.container} />;
  }

  if (hasPermission === false) {
    return (
      <View style={styles.permissionContainer}>
        <MaterialIcons name="error-outline" size={50} color="red" />
        <Text style={styles.permissionText}>Camera permission not granted</Text>
      </View>
    );
  }

  const toggleFlash = () => {
    setFlash(
      flash === Camera.Constants.FlashMode.off
        ? Camera.Constants.FlashMode.torch
        : Camera.Constants.FlashMode.off
    );
  };

  return (
    <TouchableWithoutFeedback onPress={handleTapToFocus}>
      <View style={styles.container}>
        <Camera
          style={styles.camera}
          type={Camera.Constants.Type.back}
          flashMode={flash}
          onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
          autoFocus={Camera.Constants.AutoFocus.on}
          focusDepth={focusDepth}
        >
          <View style={styles.overlay}>
            <View style={styles.cornerTopLeft} />
            <View style={styles.cornerTopRight} />
            <View style={styles.cornerBottomLeft} />
            <View style={styles.cornerBottomRight} />
          </View>
          <View style={styles.scanMessageContainer}>
            <Text style={styles.scanMessage}>Find QR to scan</Text>
          </View>
          <TouchableOpacity
            style={[
              styles.flashButton,
              {
                backgroundColor:
                  flash === Camera.Constants.FlashMode.off
                    ? "rgba(69, 69, 69, 0.9)"
                    : "rgba(255, 255, 255, 0.9)",
              },
            ]}
            onPress={toggleFlash}
          >
            <Ionicons
              name="flashlight"
              size={30}
              color={
                flash === Camera.Constants.FlashMode.off ? "white" : "#007AFF"
              }
            />
          </TouchableOpacity>
        </Camera>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  permissionContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  permissionText: {
    fontSize: 18,
    textAlign: "center",
    marginTop: 20,
  },
  camera: {
    flex: 1,
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  cornerTopLeft: {
    position: "absolute",
    top: "35%",
    left: "25%",
    width: 30,
    height: 30,
    borderTopWidth: 7,
    borderLeftWidth: 7,
    borderColor: "white",
    borderTopLeftRadius: 15,
  },
  cornerTopRight: {
    position: "absolute",
    top: "35%",
    right: "25%",
    width: 30,
    height: 30,
    borderTopWidth: 7,
    borderRightWidth: 7,
    borderColor: "white",
    borderTopRightRadius: 15,
  },
  cornerBottomLeft: {
    position: "absolute",
    bottom: "37%",
    left: "25%",
    width: 30,
    height: 30,
    borderBottomWidth: 7,
    borderLeftWidth: 7,
    borderColor: "white",
    borderBottomLeftRadius: 15,
  },
  cornerBottomRight: {
    position: "absolute",
    bottom: "37%",
    right: "25%",
    width: 30,
    height: 30,
    borderBottomWidth: 7,
    borderRightWidth: 7,
    borderColor: "white",
    borderBottomRightRadius: 15,
  },
  scanMessageContainer: {
    position: "absolute",
    top: 50,
    alignItems: "center",
    height: 50,
    width: 180,
    alignSelf: "center",
    borderRadius: 20,
    borderColor: "white",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(69, 69, 69, 0.8)",
  },
  scanMessage: {
    fontSize: 16,
    color: "white",
    textAlign: "center",
    fontWeight: "500",
  },
  flashButton: {
    position: "absolute",
    alignSelf: "center",
    bottom: 100,
    height: 60,
    width: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    transform: [{ rotate: "-45deg" }],
  },
});

export default ScanQr;
