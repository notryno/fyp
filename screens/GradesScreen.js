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
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";

const GradesScreen = ({ navigation }) => {
  const { userToken } = useAuth();

  const [grades, setGrades] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    React.useCallback(() => {
      const fetchData = async () => {
        try {
          const [gradesResponse, coursesResponse] = await Promise.all([
            getGrades(userToken),
            getEnrolledCourses(userToken),
          ]);
          setGrades(gradesResponse);
          setCourses(coursesResponse);
        } catch (error) {
          console.error("Error fetching data:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }, [userToken])
  );

  const groupGradesByYearAndSemester = () => {
    const sortedGrades = [...grades].sort((a, b) => {
      const yearComparison = getYear(a.course[0]) - getYear(b.course[0]);
      if (yearComparison !== 0) {
        return yearComparison;
      }
      return getSemester(a.course[0]).localeCompare(getSemester(b.course[0]));
    });

    const groupedGrades = {};

    sortedGrades.forEach((grade) => {
      const year = getYear(grade.course[0]);
      const semester = getSemester(grade.course[0]);

      if (year && semester) {
        const key = `${year}-${semester}`;
        if (!groupedGrades[key]) {
          groupedGrades[key] = [];
        }
        groupedGrades[key].push(grade);
      } else {
        console.error("Course info not found for course ID:", grade.course[0]);
      }
    });

    return groupedGrades;
  };

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

  const getSemester = (courseId) => {
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

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Module Results</Text>

      <ScrollView style={{ width: "100%" }}>
        {grades.length === 0 ? (
          <View style={styles.noGradesContainer}>
            <Ionicons name="sad-outline" size={50} color="#888" />
            <Text style={styles.noGradesText}>No grades yet</Text>
          </View>
        ) : (
          Object.entries(groupGradesByYearAndSemester()).map(
            ([semesterKey, semesterGrades]) => (
              <View key={semesterKey} style={styles.card}>
                <Text style={styles.subtitle}>
                  {`Year: ${getYear(
                    semesterGrades[0].course[0]
                  )}, Semester: ${getSemester(semesterGrades[0].course[0])}`}
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
  noGradesContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 50,
  },
  noGradesText: {
    fontSize: 20,
    color: "#888",
    marginTop: 10,
  },
});

export default GradesScreen;
