import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { getStudents } from "../../../api/authApi";
import { useAuth } from "../../../api/authContext";
import { useNavigation } from "@react-navigation/native";

export const StudentsScreen = () => {
  const { userToken } = useAuth();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigation = useNavigation();

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const studentsData = await getStudents(userToken);
        setStudents(studentsData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching students:", error);
      }
    };
    fetchStudents();
  }, []);

  function groupByClassroom(students) {
    const grouped = students.reduce((acc, curr) => {
      const existing = acc.find((group) => group.classroom === curr.classroom);
      return existing
        ? acc.map((group) =>
            group.classroom === curr.classroom
              ? { ...group, students: [...group.students, curr] }
              : group
          )
        : [...acc, { classroom: curr.classroom, students: [curr] }];
    }, []);

    return grouped.filter((group) => group.students.length > 0);
  }

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator />
      ) : (
        <FlatList
          data={groupByClassroom(students)}
          keyExtractor={(item) => item.classroom}
          renderItem={({ item: classroom }) => (
            <View>
              <Text
                style={styles.classroomHeader}
              >{`Class: ${classroom.classroom}`}</Text>
              <FlatList
                data={classroom.students}
                keyExtractor={(student) => student.id}
                renderItem={({ item: student }) => (
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate("Grading", { student: student })
                    }
                  >
                    <View style={styles.studentCard}>
                      <Text style={styles.studentName}>
                        {student.first_name} {student.last_name} (
                        {student.email})
                      </Text>
                      <Text style={styles.studentId}>ID: {student.id}</Text>
                    </View>
                  </TouchableOpacity>
                )}
              />
            </View>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  studentCard: {
    marginBottom: 16,
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 1,
  },
  studentName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  studentId: {
    fontSize: 16,
    color: "#555",
  },
});
