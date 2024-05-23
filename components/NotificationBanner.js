import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Image,
} from "react-native";

import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

const NotificationBanner = ({ title, message, created, author, onClose }) => {
  const translateY = useRef(new Animated.Value(-100)).current;
  const navigation = useNavigation();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    // Animate the banner to drop down
    Animated.timing(translateY, {
      toValue: 0,
      duration: 150,
      useNativeDriver: true,
    }).start();

    // Set up timer to close the banner after 5 seconds
    const timer = setTimeout(() => {
      // Animate the banner to go up
      Animated.timing(translateY, {
        toValue: -100,
        duration: 150,
        useNativeDriver: true,
      }).start(() => onClose());
    }, 5000);

    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // 1 minute interval

    return () => {
      clearTimeout(timer), clearInterval(interval);
    };
  }, [translateY, onClose]);

  const handlePress = () => {
    // Navigate to the "Notifications" tab
    navigation.navigate("NotificationTab");
    onClose(); // Close the banner after navigation
  };

  const formatTime = (time) => {
    const now = currentTime;
    const createdTime = new Date(time);
    const diffInMinutes = Math.floor((now - createdTime) / (1000 * 60));
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInMinutes < 1) {
      return "now";
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes} minute${diffInMinutes > 1 ? "s" : ""} ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`;
    } else {
      return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`;
    }
  };

  return (
    <Animated.View style={[styles.banner, { transform: [{ translateY }] }]}>
      <TouchableOpacity onPress={handlePress} style={styles.content}>
        <View style={styles.textContainer}>
          <View style={styles.left}>
            {!author.profile_picture ? (
              <>
                {author.first_name === "Admin" &&
                author.last_name === "Admin" ? (
                  <View style={styles.notificationAdminContainer}>
                    <Ionicons
                      name={"settings-outline"}
                      color={"black"}
                      size={25}
                      style={styles.notificationIcon}
                    />
                  </View>
                ) : (
                  <View style={styles.notificationIconContainer}>
                    <Ionicons
                      name={"person-circle"}
                      color={"#d2d2d2"}
                      size={48}
                      style={styles.notificationIcon}
                    />
                  </View>
                )}
              </>
            ) : (
              <View style={styles.notificationImageContainer}>
                <Image
                  source={{ uri: author.profile_picture }}
                  style={styles.notificationImage}
                />
              </View>
            )}
          </View>
          <View style={styles.right}>
            <View style={styles.titleContainer}>
              <Text style={styles.title}>{title}</Text>
              <Text style={styles.time}>{formatTime(created)}</Text>
            </View>
            <Text style={styles.message}>{message}</Text>
          </View>
        </View>
      </TouchableOpacity>
      <View
        style={{
          backgroundColor: "#ddd",
          marginTop: 20,
          width: "12%",
          height: 5,
          borderRadius: 5,
          alignSelf: "center",
        }}
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  banner: {
    position: "absolute",
    top: 60,
    width: "95%",
    alignSelf: "center",
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingTop: 15,
    paddingBottom: 10,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    shadowColor: "black",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 3.84,
    elevation: 5,
    zIndex: 1,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
  },
  textContainer: {
    flex: 1,
    flexDirection: "row",
  },
  left: {
    alignItems: "center",
    justifyContent: "center",
    // borderWidth: 1,
    marginRight: 10,
  },
  right: {
    flex: 1,
    alignItems: "flex-start",
    justifyContent: "center",
    // borderWidth: 1,
  },
  title: {
    color: "black",
    fontSize: 16,
    fontWeight: "bold",
  },
  titleContainer: {
    marginBottom: 5,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    // borderWidth: 1,
    width: "100%",
  },
  time: {
    color: "black",
    fontSize: 12,
  },
  notificationAdminContainer: {
    justifyContent: "center",
    alignItems: "center",
    width: 42,
    paddingLeft: -5,
    height: 42,
    borderRadius: 21,
    borderWidth: 1,
    borderColor: "#d2d2d2",
    overflow: "hidden",
  },
  notificationImageContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  notificationIconContainer: {
    justifyContent: "center",
    alignItems: "center",
    width: 42,
    paddingLeft: -5,
    height: 42,
    overflow: "hidden",
  },
  notificationImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 2,
    borderWidth: 0.2,
  },
  notificationIcon: {
    margin: -15,
  },
  message: {
    color: "black",
    fontSize: 14,
  },
});

export default NotificationBanner;
