import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
// import { getCourses } from "../api/courseApi";
import { useAuth } from "../api/authContext";

const CoursesScreen = ({ navigation }) => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const { userToken } = useAuth();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        // const coursesData = await getCourses(userToken);
        setCourses(coursesData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };

    fetchCourses();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  const renderCourseItem = ({ item }) => (
    <TouchableOpacity
      style={styles.courseItem}
      onPress={() =>
        navigation.navigate("CourseDetails", { courseId: item.id })
      }
    >
      <Text style={styles.courseName}>{item.name}</Text>
      <Text>{item.description}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Enrolled Courses</Text>
      <FlatList
        data={courses}
        keyExtractor={(item) => item.id}
        renderItem={renderCourseItem}
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
  courseItem: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: "#f0f0f0",
    borderColor: "black",
    borderWidth: 1,
    borderRadius: 8,
  },
  courseName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
});

export default CoursesScreen;
