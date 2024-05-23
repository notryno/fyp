import { NavigationContainer } from "@react-navigation/native";
import { AuthProvider } from "./api/authContext";
import MainNavigator from "./navigation/MainNavigator";
import { NotificationProvider } from "./api/notificationContext";

export default function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <NavigationContainer>
          <MainNavigator />
        </NavigationContainer>
      </NotificationProvider>
    </AuthProvider>
  );
}
