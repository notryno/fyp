//HomeScreen.js

import { useNavigation } from "@react-navigation/native";
import { View, Text, StyleSheet, Button } from "react-native";

const HomeScreen = () => {
  const navigation = useNavigation();
  return (
    <View>
      <Text>This is home screen.</Text>
      <Button
        title="Go to Events"
        onPress={() => navigation.navigate("Event")}
      />
      <Button
        title="Go to Events 2"
        onPress={() => navigation.navigate("Event")}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    padding: 20,
  },
});

export default HomeScreen;
