import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { DataTable } from "react-native-paper";
import { getCourseSchedule } from "../api/courseApi";
import { useAuth } from "../api/authContext";
import { Ionicons } from "@expo/vector-icons";

const CourseDetailsScreen = ({ route, navigation }) => {
  const [schedule, setSchedule] = useState(null);
  const { userToken } = useAuth();

  const { courseId, courseName, courseCode, courseYear, courseSemester } =
    route.params;

  const fetchSchedule = async () => {
    try {
      const scheduleData = await getCourseSchedule(userToken, courseId);
      console.log("Schedule data:", scheduleData);
      setSchedule(scheduleData); // Set the retrieved schedule data
    } catch (error) {
      console.error("Error fetching course schedule:", error);
    }
  };

  useEffect(() => {
    fetchSchedule();
  }, []);

  // Helper function to format time in HH:MM AM/PM format
  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(":");
    const hour = parseInt(hours, 10);
    const minute = parseInt(minutes, 10);
    const period = hour >= 12 ? "PM" : "AM";
    const formattedHour = hour % 12 === 0 ? 12 : hour % 12;
    return `${formattedHour}:${minute < 10 ? "0" + minute : minute} ${period}`;
  };

  const formatDay = {
    0: "Sunday",
    1: "Monday",
    2: "Tuesday",
    3: "Wednesday",
    4: "Thursday",
    5: "Friday",
    6: "Saturday",
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Course Details</Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Course Information</Text>
        <DataTable style={styles.table}>
          <DataTable.Row>
            <DataTable.Cell style={styles.cellHeader}>Name</DataTable.Cell>
            <DataTable.Cell style={styles.cellData}>
              {courseName}
            </DataTable.Cell>
          </DataTable.Row>
          <DataTable.Row>
            <DataTable.Cell style={styles.cellHeader}>Code</DataTable.Cell>
            <DataTable.Cell style={styles.cellData}>
              {courseCode}
            </DataTable.Cell>
          </DataTable.Row>
          <DataTable.Row>
            <DataTable.Cell style={styles.cellHeader}>Year</DataTable.Cell>
            <DataTable.Cell style={styles.cellData}>
              {courseYear}
            </DataTable.Cell>
          </DataTable.Row>
          <DataTable.Row>
            <DataTable.Cell style={styles.cellHeader}>Semester</DataTable.Cell>
            <DataTable.Cell style={styles.cellData}>
              {courseSemester}
            </DataTable.Cell>
          </DataTable.Row>
        </DataTable>
      </View>

      {/* Schedule Information */}
      <Text style={styles.title}>Course Schedule</Text>
      <View style={styles.card}>
        <View style={styles.scheduleContainer}>
          {schedule ? (
            schedule.map((item, index) => (
              <View style={styles.scheduleItem} key={index}>
                <View style={styles.topRow}>
                  <Text style={styles.scheduleType}>Type: {item.type}</Text>
                  <Text style={styles.scheduleDay}>
                    {formatDay[item.day_of_week]}
                  </Text>
                </View>
                <View style={styles.bottomRow}>
                  <Text>Total Instances: {item.number_of_instances}</Text>

                  <Text>
                    {formatTime(item.start_time)} - {formatTime(item.end_time)}
                  </Text>
                </View>
                <View style={styles.bottomRow}>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Ionicons name="location-outline" size={16} color="#333" />
                    <Text style={{ marginLeft: 5 }}>
                      Location: {item.location}
                    </Text>
                  </View>
                </View>
              </View>
            ))
          ) : (
            <Text>No schedule available</Text>
          )}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f0f0",
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#333",
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 4,
  },
  scheduleDay: {
    fontWeight: "bold",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 8,
    marginBottom: 20,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  table: {
    marginTop: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  cellHeader: {
    fontWeight: "bold",
    backgroundColor: "#f9f9f9",
  },
  cellData: {
    borderLeftColor: "#ddd",
    borderLeftWidth: 1,
    backgroundColor: "#ffffff",
    paddingLeft: 12,
  },
  scheduleItem: {
    marginVertical: 6,
    backgroundColor: "#ddd",
    padding: 12,
    paddingVertical: 16,
    borderRadius: 4,
  },
  scheduleType: {
    fontWeight: "bold",
    marginBottom: 4,
  },
});

export default CourseDetailsScreen;
