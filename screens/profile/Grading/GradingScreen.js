import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
} from "react-native";
import { useAuth } from "../../../api/authContext";
import { createGrade, editGrade } from "../../../api/gradeApi";
import { Dropdown } from "react-native-element-dropdown";
import { getStudents } from "../../../api/authApi";
import { getCoursesByStudent } from "../../../api/courseApi";

const GradingScreen = ({ navigation, route }) => {
  const { student, course } = route.params || {};
  const [formData, setFormData] = useState({
    student: "",
    course: "",
    grade: "",
    score: "",
  });
  const { userToken } = useAuth();
  const [courses, setCourses] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [students, setStudents] = useState([]);

  const handleChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  const fetchStudentsData = async () => {
    try {
      const studentsData = await getStudents(userToken);
      setStudents(studentsData);
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

  const fetchCourseData = async (id) => {
    try {
      const courseData = await getCoursesByStudent(userToken, id);
      setCourses(courseData);
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

  const handleStudentSelect = (student) => {
    console.log("Student", student);
    setSelectedStudent(student);
    fetchCourseData(student.value.id);
  };

  useEffect(() => {
    fetchStudentsData();
  }, []);

  const handleSubmit = async () => {
    try {
      formData.student = selectedStudent;
      formData.course = courses.find((course) => course.id === formData.course);

      await createGrade(userToken, formData);
      console.log("Grade created/updated successfully!");
      fetchGradesData(selectedStudent.id);
      resetFormData();
      navigation.goBack();
    } catch (error) {
      console.error("Error creating/updating grade:", error);
    }
  };

  const resetFormData = () => {
    setFormData({ student: "", course: "", grade: "", score: "" });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Add a Grade</Text>
      </View>
      <View style={styles.form}>
        <Dropdown
          style={styles.dropdown}
          data={students.map((student) => ({
            label: `${student.first_name} ${student.last_name} (${student.email})`,
            value: student,
          }))}
          labelField="label"
          valueField="value"
          placeholder="Select Student"
          value={selectedStudent}
          onChange={(item) => handleStudentSelect(item)}
        />
        <Dropdown
          style={styles.dropdown}
          data={courses.map((course) => ({
            label: course.name,
            value: course,
          }))}
          labelField="label"
          valueField="value"
          placeholder="Select Course"
          value={selectedCourse}
          onChange={(item) => setSelectedCourse(item)}
        />
        <TextInput
          style={styles.input}
          placeholder="Score"
          value={formData.score}
          onChangeText={(value) => handleChange("score", value)}
          keyboardType="numeric"
        />
        <Button title="Submit" onPress={handleSubmit} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#ffffff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  form: {
    marginTop: 20,
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 8,
    marginBottom: 16,
  },
  dropdown: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 8,
    marginBottom: 16,
  },
});

export default GradingScreen;
