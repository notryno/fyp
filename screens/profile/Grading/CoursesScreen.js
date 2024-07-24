import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
// import { getEnrolledCourses } from "../../../api/courses";
import { getCoursesByStudent } from "../../../api/courseApi";
import { useAuth } from "../../../api/authContext";
const StudentCoursesScreen = ({ navigation, route }) => {
  const { student } = route.params || {};
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  console.log(student);

  const { userToken } = useAuth();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const coursesData = await getCoursesByStudent(userToken, student.id);
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
    };

    const romanNumeralMap = Object.keys(romanNumerals).reduce(
      (acc, curr) => ({
        ...acc,
        [curr]: new RegExp(
          `^(${curr})(?:([0-9]|[MDCLXVI]{1,7})([BCDLMX]{0,7})?$`
        ),
      }),
      {}
    );

    const getRomanNumeral = (number) => {
      let result = "";
      Object.entries(romanNumeralMap).forEach(([key, value]) => {
        if (number >= romanNumerals[key]) {
          const match = value.test(number.toString());
          if (match) {
            const count = parseInt(match[1], 10);
            const remainder = number - romanNumerals[key] * count;
            result += Array(count + 1).join(key);
            return remainder;
          }
        }
      });

      return result;
    };

    return courses.map((course) => ({
      ...course,
      year: convertToRoman(course.year),
    }));
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

  return (
    <View style={styles.container}>
      <FlatList
        data={courses}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.courseItem}
            onPress={() =>
              navigation.navigate("Grading", {
                course: item,
              })
            }
          >
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <Text style={styles.courseName}>{item.name}</Text>
              <Text style={styles.texts}>{item.year}</Text>
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
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 20,
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

export default StudentCoursesScreen;
