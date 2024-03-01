import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { fetchEvents } from "../../api/scheduleApi";
import { useAuth } from "../../api/authContext";

const EventItem = ({ title, time, type, location }) => {
  return (
    <TouchableOpacity
      style={styles.eventContainer}
      onPress={() => {
        /* Handle onPress event */
      }}
    >
      <View style={styles.eventDetails}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.time}>{time}</Text>
        </View>
        <Text style={styles.type}>{type}</Text>
        <View style={styles.locationContainer}>
          <MaterialIcons name="location-on" size={24} color="black" />
          <Text style={styles.location}>{location}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const { userToken } = useAuth();

  // const events = [
  //   {
  //     date: "March 1, 2024 Friday",
  //     data: [
  //       {
  //         title: "Sample Event 1",
  //         time: "7AM - 8AM",
  //         type: "Lecture",
  //         location: "Sample Location 1",
  //       },
  //     ],
  //   },
  //   {
  //     date: "March 2, 2024 Saturday",
  //     data: [
  //       {
  //         title: "Sample Event 2",
  //         time: "9AM - 10AM",
  //         type: "Workshop",
  //         location: "Sample Location 2",
  //       },
  //       {
  //         title: "Sample Event 3",
  //         time: "11AM - 12PM",
  //         type: "Tutorial",
  //         location: "Sample Location 3",
  //       },
  //     ],
  //   },

  //   {
  //     date: "March 2, 2024 Saturday",
  //     data: [
  //       {
  //         title: "Sample Event 2",
  //         time: "9AM - 10AM",
  //         type: "Workshop",
  //         location: "Sample Location 2",
  //       },
  //       {
  //         title: "Sample Event 3",
  //         time: "11AM - 12PM",
  //         type: "Tutorial",
  //         location: "Sample Location 3",
  //       },
  //     ],
  //   },

  //   {
  //     date: "March 2, 2024 Saturday",
  //     data: [
  //       {
  //         title: "Sample Event 2",
  //         time: "9AM - 10AM",
  //         type: "Workshop",
  //         location: "Sample Location 2",
  //       },
  //       {
  //         title: "Sample Event 3",
  //         time: "11AM - 12PM",
  //         type: "Tutorial",
  //         location: "Sample Location 3",
  //       },
  //     ],
  //   },
  // ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchEvents(userToken);
        setEvents(data);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchData();

    return () => {
      // Cleanup logic here if needed
    };
  }, []);

  return (
    <ScrollView
      contentContainerStyle={[
        styles.scrollViewContent,
        events.length === 0 && styles.centeredContent,
      ]}
    >
      <View style={styles.eventsPage}>
        {events.length === 0 ? (
          <View style={styles.noScheduleContainer}>
            <MaterialIcons name="event-busy" size={48} color="grey" />
            <Text style={styles.noScheduleText}>No Schedule</Text>
          </View>
        ) : (
          events.map((group, index) => (
            <View key={index} style={styles.eventGroup}>
              <Text style={styles.dateText}>{group.date}</Text>
              {group.data.map((event, idx) => (
                <EventItem
                  key={idx}
                  title={event.title}
                  time={event.time}
                  type={event.type}
                  location={event.location}
                />
              ))}
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollViewContent: {
    flexGrow: 1,
    paddingVertical: 20,
  },
  centeredContent: {
    justifyContent: "center",
    alignItems: "center",
  },
  eventsPage: {
    padding: 20,
  },
  eventGroup: {
    marginBottom: 20,
  },
  dateText: {
    fontWeight: "bold",
    marginBottom: 10,
  },
  eventContainer: {
    borderWidth: 2,
    borderColor: "#ccc",
    borderRadius: 10,
    marginBottom: 10,
    padding: 15,
  },
  eventDetails: {},
  titleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  title: {
    fontWeight: "bold",
    marginBottom: 5,
  },
  time: {
    fontStyle: "italic",
    marginBottom: 5,
  },
  type: {
    marginBottom: 5,
    // color: "blue",
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  location: {
    marginLeft: 5,
  },
  noScheduleContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  noScheduleText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "grey",
    marginTop: 10,
    textAlign: "center",
  },
});

export default EventsPage;
