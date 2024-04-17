import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { getEnrolledCourses } from "../api/courseApi";
import { useAuth } from "../api/authContext";

const CoursesScreen = ({ navigation }) => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const { userToken } = useAuth();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const coursesData = await getEnrolledCourses(userToken);
        setCourses(coursesData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };

    fetchCourses();
  }, []);

  if (loading) {
    return <ActivityIndicator />;
  }

  const convertToRoman = (num) => {
    const romanNumerals = {
      M: 1000,
      CM: 900,
      D: 500,
      CD: 400,
      C: 100,
      XC: 90,
      L: 50,
      XL: 40,
      X: 10,
      IX: 9,
      V: 5,
      IV: 4,
      I: 1,
    };

    let result = "";
    for (let key in romanNumerals) {
      while (num >= romanNumerals[key]) {
        result += key;
        num -= romanNumerals[key];
      }
    }
    return result;
  };

  const getSemesterText = (semester) => {
    switch (semester) {
      case "1":
        return "First";
      case "2":
        return "Second";
      case "3":
        return "Third";
      case "4":
        return "Fourth";
      case "5":
        return "Fifth";
      case "6":
        return "Sixth";
      case "7":
        return "Seventh";
      case "8":
        return "Eighth";
      case "9":
        return "Ninth";
      case "10":
        return "Tenth";
      default:
        return semester;
    }
  };

  const renderCourseItem = ({ item }) => (
    <TouchableOpacity
      style={styles.courseItem}
      onPress={() =>
        navigation.navigate("CourseDetails", {
          courseId: item.id,
          courseName: item.name,
          courseCode: item.code,
          courseYear: item.year,
          courseSemester: item.semester,
        })
      }
    >
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <Text style={styles.courseName}>{item.name}</Text>
        <Text style={styles.texts}>{convertToRoman(item.year)}</Text>
      </View>
      <View
        style={[
          styles.texts,
          { flexDirection: "row", justifyContent: "space-between" },
        ]}
      >
        <Text style={styles.texts}>{item.code}</Text>
        <Text style={styles.texts}>{getSemesterText(item.semester)}</Text>
      </View>
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
    shadowColor: "black",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 1,
  },
  courseName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },

  texts: {
    color: "black",
  },
});

export default CoursesScreen;
