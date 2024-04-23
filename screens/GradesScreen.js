import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { DataTable } from "react-native-paper";
import { getGrades } from "../api/gradeApi";
import { useAuth } from "../api/authContext";
import { getEnrolledCourses } from "../api/courseApi";
import { get } from "react-native/Libraries/TurboModule/TurboModuleRegistry";

const GradesScreen = ({ navigation }) => {
  const { userToken } = useAuth();

  const [grades, setGrades] = useState([]);
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    fetchGrades();
    fetchCourses();
  }, [userToken]);

  const fetchGrades = async () => {
    try {
      const response = await getGrades(userToken);
      setGrades(response);
    } catch (error) {
      console.error("Error fetching grades:", error);
    }
  };

  const fetchCourses = async () => {
    try {
      const coursesData = await getEnrolledCourses(userToken);
      setCourses(coursesData);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  // Function to group grades by Year and Semester
  // Function to group grades by Year and Semester
  const groupGradesByYearAndSemester = () => {
    // Sort grades by year and then by semester
    const sortedGrades = [...grades].sort((a, b) => {
      const yearComparison = a.course[0].year - b.course[0].year;
      if (yearComparison !== 0) {
        return yearComparison;
      }
      // If years are the same, sort by semester
      return a.course[0].semester.localeCompare(b.course[0].semester);
    });

    const groupedGrades = {};

    sortedGrades.forEach((grade) => {
      // getCoursesInfo(grade.course[0]);
      let { year, semester } = {};
      try {
        const courseInfo = getCoursesInfo(grade.course[0]);
        year = courseInfo.year;
        semester = courseInfo.semester;
      } catch (error) {
        console.error("Error getting course info:", error);
      }

      const key = `${year}-${semester}`;

      if (!groupedGrades[key]) {
        groupedGrades[key] = [];
      }

      groupedGrades[key].push(grade);
    });
    return groupedGrades;
  };

  // Helper function to get year and semester information based on course ID
  const getCoursesInfo = (courseId) => {
    const course = courses.find((c) => c.id === courseId);
    if (!course) {
      return null;
    }
    return { year: course.year, semester: course.semester };
  };

  const getYear = (courseId) => {
    const course = courses.find((c) => c.id === courseId);
    if (!course) {
      return null;
    }
    return course.year;
  };

  const getSemster = (courseId) => {
    const course = courses.find((c) => c.id === courseId);
    if (!course) {
      return null;
    }
    return course.semester;
  };

  const getCode = (courseId) => {
    const course = courses.find((c) => c.id === courseId);
    if (!course) {
      return null;
    }
    return course.code;
  };

  const getName = (courseId) => {
    const course = courses.find((c) => c.id === courseId);
    if (!course) {
      return null;
    }
    return course.name;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Module Results</Text>

      <ScrollView style={{ width: "100%" }}>
        {Object.entries(groupGradesByYearAndSemester()).map(
          ([semesterKey, semesterGrades]) => (
            <View key={semesterKey} style={styles.card}>
              <Text style={styles.subtitle}>
                {`Year: ${getYear(
                  semesterGrades[0].course[0]
                )}, Semester: ${getSemster(semesterGrades[0].course[0])}`}
              </Text>
              <DataTable>
                <DataTable.Header>
                  <DataTable.Title style={styles.tableHeader25}>
                    Code
                  </DataTable.Title>
                  <DataTable.Title style={styles.tableHeader55}>
                    Name
                  </DataTable.Title>
                  <DataTable.Title style={styles.tableHeader10}>
                    Mark
                  </DataTable.Title>
                  <DataTable.Title style={styles.tableHeader10}>
                    Grade
                  </DataTable.Title>
                </DataTable.Header>

                {semesterGrades.map((item, index) => (
                  <DataTable.Row key={index}>
                    <DataTable.Cell style={styles.tableCell25}>
                      {getCode(item.course[0])}
                    </DataTable.Cell>
                    <DataTable.Cell style={styles.tableCell55}>
                      {getName(item.course[0])}
                    </DataTable.Cell>
                    <DataTable.Cell style={styles.tableCell10}>
                      {item.score}
                    </DataTable.Cell>
                    <DataTable.Cell style={styles.tableCell10}>
                      {item.grade}
                    </DataTable.Cell>
                  </DataTable.Row>
                ))}
              </DataTable>
            </View>
          )
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: 10,
  },
  title: {
    fontSize: 25,
    marginVertical: 10,
    marginBottom: 20,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 10,
    marginBottom: 5,
  },
  tableHeader25: {
    flex: 0.25,
  },
  tableHeader55: {
    flex: 0.55,
  },
  tableHeader10: {
    flex: 0.1,
  },
  tableCell25: {
    flex: 0.25,
  },
  tableCell55: {
    flex: 0.55,
  },
  tableCell10: {
    flex: 0.1,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 8,
    marginBottom: 20,
    padding: 16,
    paddingHorizontal: 4,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 3.5,
    elevation: 5,
  },
});

export default GradesScreen;
