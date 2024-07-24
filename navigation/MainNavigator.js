// MainNavigator.js

import React, { useContext } from "react";
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
import NotificationScreen from "../screens/notification/NotificationScreen";
import { SafeAreaView, Text, View, TouchableOpacity } from "react-native";
import PersonalDetails from "../screens/profile/PersonalDetails";
import TaskScreen from "../screens/task/TaskScreen";
import {
  useNavigation,
  getFocusedRouteNameFromRoute,
} from "@react-navigation/native";
import ChangeFirstName from "../screens/profile/ChangeFirstName";
import ChangeLastName from "../screens/profile/ChangeLastName";
import ChangePassword from "../screens/profile/ChangePassword";
import EventDescriptionScreen from "../screens/calendar/EventDescriptionScreen";
import TaskDescriptionScreen from "../screens/task/TaskDescriptionScreen";
import ClassScreen from "../screens/ClassScreen";
import OTPScreen from "../screens/auth/OTPScreen";
import RegisterSuccess from "../screens/auth/RegisterSuccess";
import ForgotPasswordScreen from "../screens/auth/ForgotPasswordScreen";
import PasswordResetScreen from "../screens/auth/PasswordResetScreen";
import CoursesScreen from "../screens/Courses";
import CourseDetailsScreen from "../screens/CourseDetails";
import GradesScreen from "../screens/GradesScreen";
import QrCodeScreen from "../screens/profile/QrCodeScreen";
import { NotificationContext } from "../api/notificationContext";
import NotificationBanner from "../components/NotificationBanner";
import ScanQr from "../screens/profile/ScanQr";
import IdCard from "../screens/profile/IdCard";
import PublicProfile from "../screens/profile/PublicProfile";
import PublicId from "../screens/profile/PublicId";
import NotificationDetailScreen from "../screens/notification/NotificationDetailScreen";
import SupportScreen from "../screens/profile/SupportScreen";
import GradingScreen from "../screens/profile/Grading/GradingScreen";
import { StudentsScreen } from "../screens/profile/Grading/StudentsScreen";
import StudentCoursesScreen from "../screens/profile/Grading/CoursesScreen";
import AddNotification from "../screens/notification/AddNotificationScreen";

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
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="TaskDetailScreen"
        component={TaskDescriptionScreen}
        options={{ title: "Task Description" }}
      />
      <Stack.Screen
        name="EventDescription"
        component={EventDescriptionScreen}
        options={{ title: "Event" }}
      />
      <Stack.Screen name="Event" component={EventData} />
    </Stack.Navigator>
  );
};

const SearchStack = () => {
  const navigation = useNavigation();
  return (
    <Stack.Navigator>
      <Stack.Screen name="Search" component={SearchScreen} />
    </Stack.Navigator>
  );
};

const CalendarTopTab = ({ navigation, route }) => {
  // const navigation = useNavigation();
  const currentScreen = getFocusedRouteNameFromRoute(route);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          padding: 16,
          alignItems: "center",
        }}
      >
        <Text style={{ fontSize: 34, fontWeight: "bold" }}>Calendar</Text>
        {currentScreen === "Calendar" ? (
          <TouchableOpacity
            onPress={() => navigation.navigate("Calendar", { exportPdf: true })}
          >
            <View>
              <Ionicons
                name="download-outline"
                size={28}
                color="black"
              ></Ionicons>
            </View>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={() => navigation.navigate("List", { exportPdf: true })}
          >
            <View>
              <Ionicons
                name="download-outline"
                size={28}
                color="black"
              ></Ionicons>
            </View>
          </TouchableOpacity>
        )}
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
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="NotificationDetail"
        component={NotificationDetailScreen}
        options={{ title: "Notification" }}
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
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="PersonalDetails"
        component={PersonalDetails}
        options={{
          title: "Personal Details",
        }}
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
      <Stack.Screen
        name="QrCode"
        component={QrCodeScreen}
        options={{ title: "Personal ID" }}
      />
      <Stack.Screen
        name="ScanQr"
        component={ScanQr}
        options={{ title: "Scan QR" }}
      />
      <Stack.Screen
        name="IdCard"
        component={IdCard}
        options={{ title: "ID Card" }}
      />
      <Stack.Screen
        name="PublicProfile"
        component={PublicProfile}
        options={{ title: "Profile" }}
      />
      <Stack.Screen
        name="PublicId"
        component={PublicId}
        options={{ title: "Public ID" }}
      />
      <Stack.Screen
        name="Classroom"
        component={ClassScreen}
        options={{
          title: "Classroom",
        }}
      />
      <Stack.Screen
        name="Courses"
        component={CoursesScreen}
        options={{
          title: "Courses",
        }}
      />
      <Stack.Screen
        name="CourseDetails"
        component={CourseDetailsScreen}
        options={{ title: "Course Details" }}
      />
      <Stack.Screen
        name="Grades"
        component={GradesScreen}
        options={{
          title: "Grades",
        }}
      />
      <Stack.Screen
        name="Grading"
        component={GradingScreen}
        options={{
          title: "Grade",
        }}
      />
      <Stack.Screen
        name="Students"
        component={StudentsScreen}
        options={{
          title: "Students",
        }}
      />
      <Stack.Screen
        name="StudentCourses"
        component={StudentCoursesScreen}
        options={{
          title: "StudentCourses",
        }}
      />
      <Stack.Screen
        name="AddNotification"
        component={AddNotification}
        options={{
          title: "Add Notification",
        }}
      />
      <Stack.Screen
        name="Support"
        component={SupportScreen}
        options={{
          headerTitle: "Support",
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => navigation.navigate("PersonalDetails")}
              style={{ marginLeft: 16 }}
            >
              <Ionicons name="chevron-back-outline" size={24} color="black" />
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen
        name="OTPScreen"
        component={OTPScreen}
        options={({ navigation, route }) => ({
          headerTitle: "",
          headerShown: true,
          headerStyle: {
            shadowColor: "transparent",
          },
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={{ marginLeft: 16 }}
            >
              <Ionicons name="chevron-back-outline" size={24} color="black" />
            </TouchableOpacity>
          ),
        })}
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
      <Stack.Screen
        name="RegisterSuccess"
        component={RegisterSuccess}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="OTPScreen"
        component={OTPScreen}
        options={({ navigation, route }) => ({
          headerTitle: "",
          headerShown: true,
          headerStyle: {
            shadowColor: "transparent",
          },
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={{ marginLeft: 16 }}
            >
              <Ionicons name="chevron-back-outline" size={24} color="black" />
            </TouchableOpacity>
          ),
        })}
      />
      <Stack.Screen
        name="ForgotPassword"
        component={ForgotPasswordScreen}
        options={({ navigation, route }) => ({
          headerTitle: "",
          headerShown: true,
          headerStyle: {
            shadowColor: "transparent",
          },
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={{ marginLeft: 16 }}
            >
              <Ionicons name="chevron-back-outline" size={24} color="black" />
            </TouchableOpacity>
          ),
        })}
      />
      <Stack.Screen
        name="PasswordResetScreen"
        component={PasswordResetScreen}
        options={({ navigation, route }) => ({
          headerTitle: "",
          headerShown: true,
          headerStyle: {
            shadowColor: "transparent",
          },
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={{ marginLeft: 16 }}
            >
              <Ionicons name="chevron-back-outline" size={24} color="black" />
            </TouchableOpacity>
          ),
        })}
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
        name="EventDescription"
        component={EventDescriptionScreen}
        options={{ title: "Event" }}
      />
      <CalendarStack.Screen
        name="TaskDetailScreen"
        component={TaskDescriptionScreen}
        options={{ title: "Task Description" }}
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
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="TaskDetailScreen"
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
    </Stack.Navigator>
  ) : (
    <AuthStack />
  );
};

const TabNavigator = () => {
  const { notifications, newNotifications, removeNotification } =
    useContext(NotificationContext);
  const unreadCount = notifications?.filter(
    (notification) => !notification.read
  ).length;

  return (
    <>
      {newNotifications.map(
        (message, index) => (
          console.log(message),
          (
            <NotificationBanner
              key={index}
              title={message.title}
              message={message.message}
              created={message.created_at}
              author={message.author}
              onClose={() => removeNotification(index)}
            />
          )
        )
      )}
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            let iconName;
            let showBadge = false;

            if (route.name === "HomeTab") {
              iconName = "home";
            } else if (route.name === "TaskTab") {
              iconName = "list-outline";
            } else if (route.name === "CalendarTab") {
              iconName = "calendar";
            } else if (route.name === "NotificationTab") {
              iconName = "notifications";
              showBadge = unreadCount > 0;
            } else if (route.name === "ProfileTab") {
              iconName = "person-circle";
            }

            return (
              <View>
                <Ionicons name={iconName} size={size} color={color} />
                {showBadge && (
                  <View
                    style={{
                      position: "absolute",
                      right: -6,
                      top: -3,
                      backgroundColor: "red",
                      borderRadius: 6,
                      width: 12,
                      height: 12,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  />
                )}
              </View>
            );
          },
        })}
      >
        <Tab.Screen
          name="HomeTab"
          component={HomeStack}
          options={{ headerShown: false, tabBarLabel: "Home" }}
        />
        <Tab.Screen
          name="TaskTab"
          component={TaskStack}
          options={{ headerShown: false, tabBarLabel: "Task" }}
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
    </>
  );
};
export default MainNavigator;
