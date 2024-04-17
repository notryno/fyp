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

const GradesScreen = ({ navigation }) => {
  const { userToken } = useAuth();

  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const response = await getGrades(userToken);
      setGrades(response);
      console.log(response);
      setLoading(false);
    })();
  }, [userToken]);

  // Function to group grades by Year and Semester
  // Function to group grades by Year and Semester
  const groupGradesBySemester = () => {
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
      const { year, semester } = grade.course[0];
      const key = `${year}-${semester}`;

      if (!groupedGrades[key]) {
        groupedGrades[key] = [];
      }

      groupedGrades[key].push(grade);
    });

    return groupedGrades;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Module Results</Text>

      {loading ? (
        <ActivityIndicator />
      ) : (
        <ScrollView style={{ width: "100%" }}>
          {Object.entries(groupGradesBySemester()).map(
            ([semesterKey, semesterGrades]) => (
              <View key={semesterKey} style={styles.card}>
                <Text style={styles.subtitle}>
                  {`Year: ${semesterGrades[0].course[0].year}, Semester: ${semesterGrades[0].course[0].semester}`}
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
                        {item.course[0].code}
                      </DataTable.Cell>
                      <DataTable.Cell style={styles.tableCell55}>
                        {item.course[0].name}
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
      )}
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
