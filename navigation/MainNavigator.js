// MainNavigator.js

import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import HomeScreen from "../screens/HomeScreen";
import EventData from "../screens/eventdata";
import LoginScreen from "../screens/auth/LoginScreen";
import RegisterScreen from "../screens/auth/RegisterScreen";
import { useAuth } from "../api/authContext";
import { Ionicons } from "@expo/vector-icons";
import SearchScreen from "../screens/SearchScreen";
import CalendarScreenList from "../screens/calendar/CalendarScreenList";
import CalendarScreenCalendar from "../screens/calendar/CalendarScreenCalendar";
import ProfileScreen from "../screens/profile/ProfileScreen";
import NotificationScreen from "../screens/NotificationScreen";
import { SafeAreaView, Text, View, TouchableOpacity } from "react-native";
import PersonalDetails from "../screens/profile/PersonalDetails";
import TaskScreen from "../screens/task/TaskScreen";
import { useNavigation } from "@react-navigation/native";
import ChangeFirstName from "../screens/profile/ChangeFirstName";
import ChangeLastName from "../screens/profile/ChangeLastName";
import ChangePassword from "../screens/profile/ChangePassword";
import EventDescriptionScreen from "../screens/calendar/EventDescriptionScreen";
import TaskDescriptionScreen from "../screens/task/TaskDescriptionScreen";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();
const TopTab = createMaterialTopTabNavigator();
const CalendarStack = createStackNavigator();

const HomeStack = () => {
  const navigation = useNavigation();
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{
          headerRight: () => (
            <TouchableOpacity
              style={{ marginRight: 16 }}
              onPress={() => navigation.navigate("HomeTask")}
            >
              <Ionicons name="list-outline" size={24} color="#007aff" />
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen
        name="HomeTask"
        component={TaskStack}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="Event" component={EventData} />
    </Stack.Navigator>
  );
};

const SearchStack = () => {
  const navigation = useNavigation();
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Search"
        component={SearchScreen}
        options={{
          headerRight: () => (
            <TouchableOpacity
              style={{ marginRight: 16 }}
              onPress={() => navigation.navigate("SearchTask")}
            >
              <Ionicons name="list-outline" size={24} color="#007aff" />
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen
        name="SearchTask"
        component={TaskStack}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

const CalendarTopTab = () => {
  const navigation = useNavigation();
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          padding: 16,
        }}
      >
        <Text style={{ fontSize: 20, fontWeight: "bold" }}>Calendar</Text>
        <TouchableOpacity onPress={() => navigation.navigate("CalendarTask")}>
          <Ionicons name="list-outline" size={24} color="#007aff" />
        </TouchableOpacity>
      </View>
      <TopTab.Navigator>
        <TopTab.Screen
          name="List"
          component={CalendarScreenList}
          options={{
            tabBarLabel: ({ focused }) => (
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Ionicons
                  name={focused ? "list" : "list-outline"}
                  size={18}
                  color="black"
                  style={{ marginRight: 5 }}
                />
                <Text style={{ fontWeight: focused ? "bold" : "normal" }}>
                  List
                </Text>
              </View>
            ),
          }}
        />
        <TopTab.Screen
          name="Calendar"
          component={CalendarScreenCalendar}
          options={{
            tabBarLabel: ({ focused }) => (
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Ionicons
                  name={focused ? "calendar" : "calendar-outline"}
                  size={18}
                  color="black"
                  style={{ marginRight: 5 }}
                />
                <Text style={{ fontWeight: focused ? "bold" : "normal" }}>
                  Calendar
                </Text>
              </View>
            ),
          }}
        />
      </TopTab.Navigator>
    </SafeAreaView>
  );
};

const NotificationStack = () => {
  const navigation = useNavigation();
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Notification"
        component={NotificationScreen}
        options={{
          headerRight: () => (
            <TouchableOpacity
              style={{ marginRight: 16 }}
              onPress={() => navigation.navigate("NotificationTask")}
            >
              <Ionicons name="list-outline" size={24} color="#007aff" />
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen
        name="NotificationTask"
        component={TaskStack}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

const ProfileStack = () => {
  const navigation = useNavigation();
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          headerRight: () => (
            <TouchableOpacity
              style={{ marginRight: 16 }}
              onPress={() => navigation.navigate("ProfileTask")}
            >
              <Ionicons name="list-outline" size={24} color="#007aff" />
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen
        name="PersonalDetails"
        component={PersonalDetails}
        options={{
          title: "Personal Details",
        }}
      />
      <Stack.Screen
        name="ProfileTask"
        component={TaskStack}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ChangeFirstName"
        component={ChangeFirstName}
        options={({ navigation }) => ({
          title: "Change First Name",
          headerRight: () => (
            <TouchableOpacity
              style={{ marginRight: 16 }}
              onPress={() => navigation.setParams({ update: true })}
            >
              <Text style={{ color: "#007aff", fontSize: 16 }}>Update</Text>
            </TouchableOpacity>
          ),
        })}
      />
      <Stack.Screen
        name="ChangeLastName"
        component={ChangeLastName}
        options={({ navigation }) => ({
          title: "Change Last Name",
          headerRight: () => (
            <TouchableOpacity
              style={{ marginRight: 16 }}
              onPress={() => navigation.setParams({ update: true })}
            >
              <Text style={{ color: "#007aff", fontSize: 16 }}>Update</Text>
            </TouchableOpacity>
          ),
        })}
      />
      <Stack.Screen
        name="Password"
        component={ChangePassword}
        options={{
          title: "Change Password",
        }}
      />
    </Stack.Navigator>
  );
};

const AuthStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Register"
        component={RegisterScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

const CalendarStackNavigator = () => {
  return (
    <CalendarStack.Navigator>
      <CalendarStack.Screen
        name="CalendarTopTab"
        component={CalendarTopTab}
        options={{ title: "List", headerShown: false }}
      />
      <CalendarStack.Screen
        name="CalendarTask"
        component={TaskStack}
        options={{ headerShown: false }}
      />
      <CalendarStack.Screen
        name="EventDescription"
        component={EventDescriptionScreen}
        options={{ title: "Event" }}
      />
    </CalendarStack.Navigator>
  );
};

const TaskStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="TaskList"
        component={TaskScreen}
        options={{ title: "TaskStack" }}
      />
      <Stack.Screen
        name="TaskDescriptionScreen"
        component={TaskDescriptionScreen}
        options={{ title: "Task Description" }}
      />
    </Stack.Navigator>
  );
};

const MainNavigator = () => {
  const { userToken } = useAuth();

  return userToken ? (
    <Stack.Navigator>
      <Stack.Screen
        name="Tabs"
        component={TabNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="TaskTab"
        component={TaskStack}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  ) : (
    <AuthStack />
  );
};

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === "HomeTab") {
            iconName = "home";
          } else if (route.name === "SearchTab") {
            iconName = "search";
          } else if (route.name === "CalendarTab") {
            iconName = "calendar";
          } else if (route.name === "NotificationTab") {
            iconName = "notifications";
          } else if (route.name === "ProfileTab") {
            iconName = "person-circle";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeStack}
        options={{ headerShown: false, tabBarLabel: "Home" }}
      />
      <Tab.Screen
        name="SearchTab"
        component={SearchStack}
        options={{ headerShown: false, tabBarLabel: "Search" }}
      />
      <Tab.Screen
        name="CalendarTab"
        component={CalendarStackNavigator}
        options={{ headerShown: false, tabBarLabel: "Calendar" }}
      />
      <Tab.Screen
        name="NotificationTab"
        component={NotificationStack}
        options={{ headerShown: false, tabBarLabel: "Notification" }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileStack}
        options={{ headerShown: false, tabBarLabel: "Profile" }}
      />
    </Tab.Navigator>
  );
};
export default MainNavigator;
