import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  Image,
} from "react-native";
import { useAuth } from "../../api/authContext";
import {
  getNotification,
  markAllAsRead,
  markAsRead,
} from "../../api/notificationApi";
import { Ionicons } from "@expo/vector-icons";
import { BASE_URL } from "../../api/authApi";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { NotificationContext } from "../../api/notificationContext";

const NotificationScreen = () => {
  const { userToken } = useAuth();
  const { notifications, setNotifications, clearBanner } =
    useContext(NotificationContext);
  const modifiedURL = BASE_URL.replace("http", "ws").replace(/\/api\/$/, "");
  const navigation = useNavigation();
  const [filter, setFilter] = useState("All");

  useFocusEffect(
    React.useCallback(() => {
      clearBanner();
      fetchNotifications();

      const ws = new WebSocket(`${modifiedURL}/ws/notifications/`);

      ws.onopen = () => {
        console.log("WebSocket connection for Notifications tab opened");
      };

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        setNotifications((prev) => {
          const updatedNotifications = [data.notification, ...prev];
          return updatedNotifications.sort(
            (a, b) => new Date(b.date) - new Date(a.date)
          );
        });
      };

      ws.onclose = () => {
        console.log("WebSocket connection for Notifications tab closed");
      };

      ws.onerror = (error) => {
        console.error("Notifications tab WebSocket error:", error);
      };

      return () => {
        ws.close();
      };
    }, [userToken])
  );

  const fetchNotifications = async () => {
    try {
      const response = await getNotification(userToken);
      setNotifications(response);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  const markAllAsReadHandler = async () => {
    try {
      await markAllAsRead(userToken);
      setNotifications((prev) =>
        prev.map((notification) => ({ ...notification, read: true }))
      );
    } catch (error) {
      console.error("Error marking all as read:", error);
    }
  };

  const navigateToNotificationDetail = async (notification) => {
    if (!notification.read) await markAsRead(userToken, notification.id);
    setNotifications((prev) =>
      prev.map((n) => {
        if (n.id === notification.id) {
          return { ...n, read: true };
        }
        return n;
      })
    );
    navigation.navigate("NotificationDetail", { notification: notification });
  };

  const renderNotificationItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.notificationItem]}
      onPress={() => navigateToNotificationDetail(item)}
    >
      <View style={styles.iconsContainer}>
        {!item.author.profile_picture ? (
          <>
            {item.author.first_name === "Admin" &&
            item.author.last_name === "Admin" ? (
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
              source={{ uri: item.author.profile_picture }}
              style={styles.notificationImage}
            />
          </View>
        )}
      </View>

      <View style={styles.notificationContent}>
        <View style={styles.titleContainer}>
          <Text style={[styles.notificationTitle]}>{item.title}</Text>
          <Text
            style={[
              styles.notificationTime,
              item.read ? styles.readText : styles.unreadText,
            ]}
          >
            {formatTime(item.created_at)}
          </Text>
        </View>
        <View style={styles.messageContainer}>
          <Text
            style={[
              styles.notificationText,
              item.read ? styles.readText : styles.unreadText,
              item.read ? { width: "100%" } : { width: "95%" },
            ]}
            numberOfLines={2}
            ellipsizeMode="tail"
          >
            {item.message}
          </Text>
          {!item.read && <View style={styles.dot} />}
        </View>
      </View>
    </TouchableOpacity>
  );

  const formatTime = (time) => {
    const createdTime = new Date(time);
    const currentTime = new Date();
    const diffInMinutes = Math.floor((currentTime - createdTime) / (1000 * 60));

    if (diffInMinutes < 1) {
      return "just now";
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`;
    } else if (diffInMinutes < 1440) {
      const diffInHours = Math.floor(diffInMinutes / 60);
      return `${diffInHours}h ago`;
    } else if (diffInMinutes < 10080) {
      const diffInDays = Math.floor(diffInMinutes / 1440);
      return `${diffInDays}d ago`;
    } else if (diffInMinutes < 43200) {
      const diffInWeeks = Math.floor(diffInMinutes / 10080);
      return `${diffInWeeks}w ago`;
    } else {
      const diffInMonths = Math.floor(diffInMinutes / 43200);
      return `${diffInMonths}mo ago`;
    }
  };

  const filterNotifications = () => {
    switch (filter) {
      case "Unread":
        return notifications.filter((n) => !n.read);
      case "Read":
        return notifications.filter((n) => n.read);
      default:
        return notifications;
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Notifications</Text>
        <TouchableOpacity onPress={markAllAsReadHandler}>
          <TouchableOpacity onPress={markAllAsReadHandler}>
            <Ionicons name="checkmark-done-outline" size={24} />
          </TouchableOpacity>
        </TouchableOpacity>
      </View>
      <View style={styles.chipsContainer}>
        <TouchableOpacity
          style={[styles.chip, filter === "All" && styles.selectedChip]}
          onPress={() => setFilter("All")}
        >
          <Text
            style={[styles.chipText, filter === "All" && styles.selectedChip]}
          >
            All
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.chip, filter === "Unread" && styles.selectedChip]}
          onPress={() => setFilter("Unread")}
        >
          <Text
            style={[
              styles.chipText,
              filter === "Unread" && styles.selectedChip,
            ]}
          >
            Unread
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.chip, filter === "Read" && styles.selectedChip]}
          onPress={() => setFilter("Read")}
        >
          <Text
            style={[styles.chipText, filter === "Read" && styles.selectedChip]}
          >
            Read
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.container}>
        {filterNotifications().length === 0 ? (
          <View style={styles.noNotificationsContainer}>
            <Ionicons
              name="notifications-off-outline"
              size={50}
              color="#d2d2d2"
            />
            <Text style={styles.noNotificationsText}>No notifications</Text>
          </View>
        ) : (
          <FlatList
            data={filterNotifications()}
            renderItem={renderNotificationItem}
            keyExtractor={(item) => item.id.toString()}
            style={styles.notificationList}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "white",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    paddingBottom: 0,
    backgroundColor: "white",
  },
  headerText: {
    fontSize: 34,
    fontWeight: "bold",
  },
  markAllAsReadText: {
    fontSize: 16,
    color: "#007BFF",
  },
  chipsContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
    paddingLeft: 10,
  },
  chip: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginHorizontal: 5,
    borderRadius: 20,
    backgroundColor: "#E0E0E0",
  },
  selectedChip: {
    backgroundColor: "black",
    color: "white",
  },
  chipText: {
    color: "#757575",
    fontWeight: "600",
    fontSize: 16,
  },
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#F2F2F2",
  },
  notificationList: {
    flex: 1,
    width: "100%",
  },
  notificationItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    marginVertical: 3,
    marginHorizontal: 5,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    backgroundColor: "white",
  },
  readNotification: {
    backgroundColor: "#E0E0E0",
  },
  unreadNotification: {
    backgroundColor: "white",
  },
  iconsContainer: {
    // height: "100%",
  },
  notificationImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 2,
    borderWidth: 0.2,
  },
  notificationImageContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  notificationIcon: {
    margin: -15,
  },
  notificationIconContainer: {
    justifyContent: "center",
    alignItems: "center",
    width: 42,
    paddingLeft: -5,
    height: 42,
    overflow: "hidden",
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
  notificationContent: {
    marginLeft: 10,
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: "500",
  },
  titleContainer: {
    marginBottom: 5,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
  },
  notificationText: {
    fontSize: 14,
  },
  notificationTime: {
    fontSize: 12,
    color: "#999",
    marginTop: 5,
  },
  readText: {
    color: "#999",
  },
  unreadText: {
    color: "black",
    fontWeight: "bold",
  },
  messageContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
  },
  dot: {
    backgroundColor: "black",
    height: 7,
    width: 7,
    borderRadius: 5,
    marginRight: 5,
  },
  noNotificationsContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  noNotificationsText: {
    marginTop: 10,
    fontSize: 18,
    color: "#d2d2d2",
    textAlign: "center",
  },
});

export default NotificationScreen;
