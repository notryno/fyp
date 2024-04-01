import React, { useEffect, useState } from "react";
import { View, Text, FlatList, ActivityIndicator } from "react-native";
import { getTasks } from "../api/classApi";
import { useAuth } from "../api/authContext";

const ClassScreen = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { userToken } = useAuth();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersData = await getTasks(userToken);
        setUsers(usersData);
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

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text>List of Users in Class:</Text>
      <FlatList
        data={users}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={{ padding: 10 }}>
            <Text>{item.username}</Text>
            {/* Display other user details as needed */}
          </View>
        )}
      />
    </View>
  );
};

export default ClassScreen;
