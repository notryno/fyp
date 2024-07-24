import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { fetchEventsAndSpecialSchedules } from "../../api/scheduleApi";
import { useAuth } from "../../api/authContext";
import EventItem from "../../components/EventItem";
import TaskItem from "../../components/TaskItem";
import { getTasks } from "../../api/taskApi";
import { useFocusEffect } from "@react-navigation/native";
import { printToFileAsync } from "expo-print";
import { shareAsync } from "expo-sharing";

const EventsPage = ({ navigation, route }) => {
  const [events, setEvents] = useState([]);
  const { userToken } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("All");

  useEffect(() => {
    const exportPdf = route.params?.exportPdf;

    if (exportPdf) {
      generatePDF();
      navigation.setParams({ exportPdf: false });
    }
  }, [route.params?.exportPdf]);

  const generateEventsHTML = () => {
    return `
      <div>
        <table style="border-collapse: collapse; width: 100%;">
          <thead>
            <tr>
              <th style="border: 1px solid #ddd; padding: 8px;">Day</th>
              <th style="border: 1px solid #ddd; padding: 8px;">Time</th>
              <th style="border: 1px solid #ddd; padding: 8px;">Class Type</th>
              <th style="border: 1px solid #ddd; padding: 8px;">Name</th>
              <th style="border: 1px solid #ddd; padding: 8px;">Location</th>
            </tr>
          </thead>
          <tbody>
            ${events
              .flatMap((eventGroup) => eventGroup.data)
              .map(
                (event) => `
                <tr>
                  <td style="border: 1px solid #ddd; padding: 8px;">${event.date}</td>
                  <td style="border: 1px solid #ddd; padding: 8px;">${event.time}</td>
                  <td style="border: 1px solid #ddd; padding: 8px;">${event.type}</td>
                  <td style="border: 1px solid #ddd; padding: 8px;">${event.title}</td>
                  <td style="border: 1px solid #ddd; padding: 8px;">${event.location}</td>
                </tr>
              `
              )
              .join("")}
          </tbody>
        </table>
      </div>
    `;
  };

  const html = `
    <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
          }
          h1, h2 {
            color: #333;
            margin-bottom: 10px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
          }
          th, td {
            border: 1px solid #ddd;
            padding: 8px;
          }
          th {
            background-color: #f2f2f2;
            font-weight: bold;
          }
        </style>
      </head>
      <body>
        <h1>Schedule</h1>
        ${generateEventsHTML()}
      </body>
    </html>
  `;

  let generatePDF = async () => {
    const file = await printToFileAsync({
      html: html,
      base64: false,
    });

    await shareAsync(file.uri, {
      dialogTitle: "Save PDF As",
      UTI: "com.adobe.pdf",
      mimeType: "application/pdf",
      filename: "YourFileName.pdf",
    });
  };

  const fetchData = async () => {
    try {
      const mergedEvents = await fetchEventsAndSpecialSchedules(userToken);
      setEvents(mergedEvents);
      const response = await getTasks(userToken);
      const formattedTasks = response.map((task) => ({
        ...task,
        due_date: formatDate(new Date(task.due_date)),
      }));
      setTasks(formattedTasks);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const formatDate = (date) => {
    const options = {
      year: "numeric",
      month: "long",
      day: "2-digit",
      weekday: "long",
    };
    return date.toLocaleDateString("en-US", options);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      fetchData();
    }, [])
  );

  const dateFormat = (date) => {
    const dateComponents = date.split(", ")[1].split(" ");
    const month = monthMap[dateComponents[0]];
    const day = dateComponents[1];
    const year = date.split(", ")[2];
    const formattedDate = `${year}-${month}-${day}`;
    return formattedDate;
  };

  const mergedData = [];

  // Map to track existing dates
  const dateMap = new Map();

  // Add events to mergedData
  events.forEach((eventGroup) => {
    const date = eventGroup.date;
    if (!dateMap.has(date)) {
      dateMap.set(date, {
        date,
        events: eventGroup.data,
        tasks: [],
      });
    } else {
      dateMap.get(date).events = eventGroup.data;
    }
  });

  // Add tasks to mergedData
  tasks.forEach((task) => {
    const date = task.due_date;
    if (!dateMap.has(date)) {
      dateMap.set(date, {
        date,
        events: [],
        tasks: [task],
      });
    } else {
      dateMap.get(date).tasks.push(task);
    }
  });

  dateMap.forEach((value) => mergedData.push(value));

  const monthMap = {
    January: "1",
    February: "2",
    March: "3",
    April: "4",
    May: "5",
    June: "6",
    July: "7",
    August: "8",
    September: "9",
    October: "10",
    November: "11",
    December: "12",
  };

  mergedData.sort((a, b) => {
    const dateA = new Date(dateFormat(a.date));
    const dateB = new Date(dateFormat(b.date));
    return dateB - dateA; // Compare dates in descending order
  });

  const filterEvents = (eventType) => {
    setSelectedFilter(eventType);
  };

  const filteredData = mergedData
    .map((data) => {
      const filteredEvents =
        selectedFilter === "All"
          ? data.events
          : selectedFilter === "Tasks"
          ? []
          : data.events.filter((event) => event.type === selectedFilter);

      const filteredTasks =
        selectedFilter === "All" || selectedFilter === "Tasks"
          ? data.tasks
          : [];

      return {
        ...data,
        events: filteredEvents,
        tasks: filteredTasks,
      };
    })
    .filter((data) => data.events.length > 0 || data.tasks.length > 0); // Filter out dates with no events or tasks

  return (
    <>
      <ScrollView
        contentContainerStyle={[
          styles.scrollViewContent,
          filteredData.length === 0 && styles.centeredContent, // Use filteredData instead of events
        ]}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.chipsContainer}
        >
          {[
            "All",
            "Lecture",
            "Workshop",
            "Tutorial",
            "Lab",
            "Assessment",
            "Tasks",
          ].map((type) => (
            <TouchableOpacity
              key={type}
              style={[
                styles.chip,
                selectedFilter === type && styles.selectedChip,
              ]}
              onPress={() => filterEvents(type)}
            >
              <Text
                style={[
                  styles.chipText,
                  selectedFilter === type && styles.selectedChipText,
                ]}
              >
                {type}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        <ScrollView
          style={[
            styles.eventsPage,
            filteredData.length === 0 ? { height: "100%" } : { height: "90%" },
          ]}
          contentContainerStyle={filteredData.length === 0 && { flex: 1 }}
        >
          {filteredData.length === 0 ? (
            <View style={styles.noScheduleContainer}>
              <MaterialIcons name="event-busy" size={48} color="grey" />
              <Text style={styles.noScheduleText}>No Schedule</Text>
            </View>
          ) : (
            filteredData.map((data, index) => (
              <View key={index} style={styles.eventGroup}>
                <Text style={styles.dateText}>{data.date}</Text>
                {data.tasks.map((task, idx) => (
                  <TaskItem
                    key={idx}
                    taskId={task.id}
                    title={task.title}
                    description={task.description}
                    dueDate={task.due_date}
                    dueTime={task.due_time}
                    markCompleted={task.completed}
                    completed={task.completed}
                    origin={"calendar-list"}
                  />
                ))}
                {data.events.map((event, idx) => (
                  <EventItem
                    key={idx}
                    title={event.title}
                    time={event.time}
                    type={event.type}
                    location={event.location}
                    color={event.color}
                    description={event.description}
                  />
                ))}
              </View>
            ))
          )}
        </ScrollView>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  scrollViewContent: {
    height: "100%",
  },
  centeredContent: {
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
  },
  eventsPage: {
    padding: 20,
    paddingTop: 0,
  },
  eventGroup: {
    marginBottom: 20,
  },
  dateText: {
    fontWeight: "bold",
    marginBottom: 10,
    fontSize: 18,
  },
  noScheduleContainer: {
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
  },
  noScheduleText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "grey",
    marginTop: 10,
    textAlign: "center",
  },
  chipsContainer: {
    height: 60,
    marginTop: 10,
    paddingHorizontal: 20,
  },
  chip: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginHorizontal: 5,
    height: 40,
    backgroundColor: "#E0E0E0",
  },
  selectedChip: {
    backgroundColor: "black",
  },
  chipText: {
    color: "#757575",
    fontWeight: "600",
  },
  selectedChipText: {
    color: "white",
  },
});

export default EventsPage;
