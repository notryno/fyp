// stack.js

import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "../screens/HomeScreen";
import { useAuth } from "../api/authContext";
import EventData from "../screens/eventdata";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";

const Stack = createStackNavigator();

export const HomeStack = () => {
  const { userToken } = useAuth();
  console.log("UserToken:", userToken);

  return (
    <Stack.Navigator initialRouteName={userToken ? "Home" : "Login"}>
      {userToken ? (
        <>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Event" component={EventData} />
        </>
      ) : (
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
        </>
      )}
    </Stack.Navigator>
  );
};
