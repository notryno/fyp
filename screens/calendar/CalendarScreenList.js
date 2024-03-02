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
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

const EventItem = ({ title, time, type, location, color }) => {
  const navigation = useNavigation();

  const handlePress = () => {
    navigation.navigate("EventDescription", {
      title: title,
      time: time,
      type: type,
      location: location,
      color: color,
    });
  };

  return (
    <TouchableOpacity
      style={[styles.eventContainer, { backgroundColor: color }]}
      onPress={handlePress}
    >
      <View style={styles.eventDetails}>
        <View style={styles.titleContainer}>
          <Text style={[styles.title, color !== "#ffffff" && styles.whiteText]}>
            {title}
          </Text>
          <Text
            style={[
              styles.detailText,
              styles.time,
              color !== "#ffffff" && styles.whiteText,
            ]}
          >
            {time}
          </Text>
        </View>
        <Text
          style={[
            styles.detailText,
            styles.type,
            color !== "#ffffff" && styles.whiteText,
          ]}
        >
          {type}
        </Text>
        <View style={styles.locationContainer}>
          <Ionicons name="location-outline" size={18} color="white" />
          <Text
            style={[
              styles.detailText,
              styles.location,
              color !== "#ffffff" && styles.whiteText,
            ]}
          >
            {location}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const { userToken } = useAuth();
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async () => {
    try {
      const mergedEvents = await fetchEventsAndSpecialSchedules(userToken);
      setEvents(mergedEvents);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
    setRefreshing(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const mergeEvents = (events, specialSchedules) => {
    const mergedEvents = [...events];
    specialSchedules.forEach((specialSchedule) => {
      const index = mergedEvents.findIndex(
        (event) => event.date === specialSchedule.special_date
      );
      if (index !== -1) {
        mergedEvents[index].data.push({
          title: specialSchedule.schedule.title,
          time: `${specialSchedule.start_time} - ${specialSchedule.end_time}`,
          type: specialSchedule.schedule.type,
          location: specialSchedule.schedule.location,
          color: specialSchedule.color,
        });
      } else {
        mergedEvents.push({
          date: specialSchedule.special_date,
          data: [
            {
              title: specialSchedule.schedule.title,
              time: `${specialSchedule.start_time} - ${specialSchedule.end_time}`,
              type: specialSchedule.schedule.type,
              location: specialSchedule.schedule.location,
              color: specialSchedule.color,
            },
          ],
        });
      }
    });
    return mergedEvents;
  };

  return (
    <ScrollView
      contentContainerStyle={[
        styles.scrollViewContent,
        events.length === 0 && styles.centeredContent,
      ]}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
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
                  color={event.color}
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
    fontSize: 18,
  },
  whiteText: {
    color: "white",
  },
  eventContainer: {
    borderWidth: 1,
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
    fontSize: 18,
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
  detailText: {
    fontSize: 14,
    marginBottom: 5,
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
