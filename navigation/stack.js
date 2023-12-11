// stack.js

import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import HomeScreen from "../screens/HomeScreen";
import EventData from "../screens/eventdata";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import { useAuth } from "../api/authContext";
import { Ionicons } from "@expo/vector-icons";
import SearchScreen from "../screens/SearchScreen";
import CalendarScreenList from "../screens/CalendarScreenList";
import CalendarScreenCalendar from "../screens/CalendarScreenCalendar";
import ProfileScreen from "../screens/ProfileScreen";
import NotificationScreen from "../screens/NotificationScreen";
import { SafeAreaView } from "react-native";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();
const TopTab = createMaterialTopTabNavigator();

const HomeStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Event" component={EventData} />
    </Stack.Navigator>
  );
};

const SearchStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Search" component={SearchScreen} />
    </Stack.Navigator>
  );
};

const CalendarTopTab = () => {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <TopTab.Navigator>
        <TopTab.Screen name="List" component={CalendarScreenList} />
        <TopTab.Screen name="Calendar" component={CalendarScreenCalendar} />
      </TopTab.Navigator>
    </SafeAreaView>
  );
};

const NotificationStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Notification" component={NotificationScreen} />
    </Stack.Navigator>
  );
};

const ProfileStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Profile" component={ProfileScreen} />
    </Stack.Navigator>
  );
};

const AuthStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
};

const MainNavigator = () => {
  const { userToken } = useAuth();

  return userToken ? (
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
        component={CalendarTopTab}
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
  ) : (
    <AuthStack />
  );
};

export default MainNavigator;
