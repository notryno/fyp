import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  SectionList,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { getEnrolledCourses } from "../api/courseApi";
import { useAuth } from "../api/authContext";

const CoursesScreen = ({ navigation }) => {
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState("All");
  const { userToken } = useAuth();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const coursesData = await getEnrolledCourses(userToken);
        setCourses(coursesData);
        setFilteredCourses(coursesData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };

    fetchCourses();
  }, []);

  useEffect(() => {
    if (selectedYear === "All") {
      setFilteredCourses(courses);
    } else {
      setFilteredCourses(
        courses.filter((course) => course.year.toString() === selectedYear)
      );
    }
  }, [selectedYear, courses]);

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

  const groupCoursesByYear = (courses) => {
    const grouped = courses.reduce((acc, course) => {
      const year = course.year;
      if (!acc[year]) {
        acc[year] = { year, data: [] };
      }
      acc[year].data.push(course);
      return acc;
    }, {});
    return Object.values(grouped);
  };

  const sections = groupCoursesByYear(filteredCourses);

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

  const getUniqueYears = (courses) => {
    const years = courses.map((course) => course.year);
    return ["All", ...new Set(years)];
  };

  const uniqueYears = getUniqueYears(courses);

  return (
    <View style={styles.container}>
      {filteredCourses.length < 1 ? (
        <View style={styles.noCoursesContainer}>
          <Ionicons name="school-outline" size={50} color="gray" />
          <Text style={styles.noCoursesText}>
            You are not enrolled in any courses yet
          </Text>
        </View>
      ) : (
        <>
          <Text style={styles.title}>Your Enrolled Courses</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.chipsContainer}
          >
            {uniqueYears.map((year) => (
              <TouchableOpacity
                key={year}
                style={[
                  styles.chip,
                  selectedYear === year.toString() && styles.selectedChip,
                ]}
                onPress={() => setSelectedYear(year.toString())}
              >
                <Text
                  style={[
                    styles.chipText,
                    selectedYear === year.toString() && styles.selectedChipText,
                  ]}
                >
                  {year === "All" ? year : `Year ${convertToRoman(year)}`}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <SectionList
            sections={sections}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderCourseItem}
            renderSectionHeader={({ section: { year } }) => (
              <Text style={styles.yearTitle}>Year {convertToRoman(year)}</Text>
            )}
            contentContainerStyle={{
              paddingBottom: 100,
            }}
          />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
  },
  yearTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 10,
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
  chipsContainer: {
    paddingLeft: 10,
    height: 60,
  },
  chip: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginHorizontal: 5,
    borderRadius: 20,
    backgroundColor: "#E0E0E0",
    height: 40,
    maxWidth: 120,
    justifyContent: "center",
    alignItems: "center",
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
  selectedChipText: {
    color: "white",
  },
  noCoursesContainer: {
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
  },
  noCoursesText: {
    marginTop: 16,
    fontSize: 16,
    color: "gray",
  },
});

export default CoursesScreen;
