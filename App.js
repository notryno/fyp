// App.js

import { NavigationContainer } from "@react-navigation/native";
import { AuthProvider } from "./api/authContext";
import { HomeStack } from "./navigation/stack";

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <HomeStack />
      </NavigationContainer>
    </AuthProvider>
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
