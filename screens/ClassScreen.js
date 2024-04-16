import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Image,
  StyleSheet,
} from "react-native";
import { getClass, getClassName } from "../api/classApi";
import { useAuth } from "../api/authContext";
import { Ionicons } from "@expo/vector-icons";

const ClassScreen = ({ navigation }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { userToken } = useAuth();
  const [userClass, setUserClass] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersData = await getClass(userToken);
        const classNameData = await getClassName(userToken);
        setUsers(usersData);
        const classNameDataClass = classNameData.find(
          (element) => element.id === usersData[0].classroom
        );
        setUserClass(classNameDataClass.name);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  const sortedUsers = [...users].sort((a, b) =>
    `${a.first_name} ${a.last_name}`.localeCompare(
      `${b.first_name} ${b.last_name}`
    )
  );

  const renderUserItem = ({ item }) => (
    <TouchableOpacity
      style={styles.userItem}
      onPress={() => navigation.navigate("UserDetails", { userId: item.id })}
    >
      {item.profile_picture ? (
        <Image
          source={{ uri: item.profile_picture }}
          style={styles.profileImage}
        />
      ) : (
        <Ionicons
          name="person-circle-outline"
          size={60}
          style={styles.profileImage}
          color={"#aaa"}
        />
      )}
      <View style={styles.userInfo}>
        <Text
          style={styles.userName}
        >{`${item.first_name} ${item.last_name}`}</Text>
        <Text>{item.email}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Students in your Class - {userClass}</Text>
      <FlatList
        data={sortedUsers}
        keyExtractor={(item) => item.email}
        renderItem={renderUserItem}
        style={{ width: "100%" }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
  },
  userItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    padding: 10,
    backgroundColor: "#f0f0f0",
    borderColor: "black",
    borderWidth: 1,
    borderRadius: 8,
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontWeight: "bold",
  },
  button: {
    width: "90%",
    alignSelf: "center",
    height: 70,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  iconContainer: {
    flex: 0.2,
    alignItems: "center",
  },
  textContainer: {
    flex: 0.6,
    alignItems: "center",
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  icon: {
    borderWidth: 1,
    borderColor: "black",
    color: "black",
    padding: 5,
    borderRadius: 5,
  },
});

export default ClassScreen;
