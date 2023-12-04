import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Platform,
  ScrollView,
  TextInput,
  Button,
} from "react-native";
import { HomeStack } from "./navigation/stack";

export default function App() {
  return (
    <NavigationContainer>
      <HomeStack></HomeStack>
    </NavigationContainer>
  );
}
/*
const [text, setText] = useState("");
<SafeAreaView>
      <Text style={{ fontSize: 32 }}>Hello World</Text>
      <Text>Platform: {Platform.OS}</Text>
      <ScrollView>
        <View style={styles.mainContainer}>
          <TextInput
            defaultValue=""
            onChangeText={(txt) => {}}
            style={{ borderWidth: 1, padding: 10 }}
          />
          <Button title="Press Me" onPress={() => console.log("Hello World")} />
          <Text>Word</Text>
        </View>
      </ScrollView>
      <StatusBar statusbar="dark" />
    </SafeAreaView>

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: "red",
    height: 1600,
    padding: 20,
  },
});

*/
