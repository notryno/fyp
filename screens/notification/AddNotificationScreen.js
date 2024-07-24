import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Alert,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Switch,
  Keyboard,
  TouchableWithoutFeedback,
  Button,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../../api/authContext";
import { getStudents, getUserData } from "../../api/authApi";
import { getClassName } from "../../api/classApi";
import { Dropdown } from "react-native-element-dropdown";

const AddNotification = ({ onSubmit, onCancel }) => {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [user, setUser] = useState(null);
  const [classroom, setClassroom] = useState(null);
  const [isUser, setIsUser] = useState(false);
  const [users, setUsers] = useState([]);
  const [classrooms, setClassrooms] = useState([]);
  const [wholeUser, setWholeUser] = useState(false);
  const [wholeClassroom, setWholeClassroom] = useState(false);
  const { userToken } = useAuth();

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await getStudents(userToken);

        // Transforming the users data to match the Dropdown component's expected structure
        const formattedUsers = response.map((student) => ({
          label: `${student.first_name} ${student.last_name} (${student.email})`,
          value: student.id,
        }));

        setWholeUser(response);
        setUsers(formattedUsers);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    const fetchClassroom = async () => {
      try {
        const response = await getClassName(userToken);

        const formattedClassrooms = response.map((classroom) => ({
          label: `${classroom.name} (${classroom.start_date} - ${classroom.end_date})`,
          value: classroom.id,
        }));

        setWholeClassroom(response);
        setClassrooms(formattedClassrooms);
      } catch (error) {
        console.error("Error fetching classroom:", error);
      }
    };

    fetchClassroom();
    fetchStudents();
  }, [userToken]);

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  const handleAddNotification = async () => {
    if (title.trim() === "" || message.trim() === "") {
      Alert.alert("Error", "Please enter a title and message.");
      return;
    }

    onSubmit({
      title,
      message,
      user,
      group: classroom,
    });
  };

  const handleToggleSwitch = () => setIsUser((previousState) => !previousState);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={"padding"}
      keyboardVerticalOffset={0}
    >
      <TouchableWithoutFeedback onPress={dismissKeyboard}>
        <View style={styles.container}>
          <View style={styles.formContainer}>
            <Text style={styles.title}>Send a Notification</Text>
            <TextInput
              style={styles.input}
              placeholder="Title"
              value={title}
              onChangeText={setTitle}
            />
            <TextInput
              style={[styles.input, { height: 150, paddingTop: 15 }]}
              placeholder="Message"
              value={message}
              onChangeText={setMessage}
              multiline
            />

            <View style={styles.switchContainer}>
              <Text style={styles.switchLabel}>Users</Text>
              <Switch
                onValueChange={handleToggleSwitch}
                value={isUser}
                style={styles.switch}
              />
              <Text style={[styles.switchLabel, { marginLeft: 10 }]}>
                Classroom
              </Text>
            </View>

            {!isUser ? (
              <View>
                <Dropdown
                  style={styles.dropdown}
                  placeholderStyle={styles.placeholderStyle}
                  selectedTextStyle={styles.selectedTextStyle}
                  inputSearchStyle={styles.inputSearchStyle}
                  iconStyle={styles.iconStyle}
                  data={users}
                  dropdownPosition="top"
                  search
                  maxHeight={300}
                  labelField="label"
                  valueField="value"
                  placeholder="Select User"
                  searchPlaceholder="Search..."
                  value={user}
                  onChange={(item) => {
                    setUser(item.value);
                  }}
                />
              </View>
            ) : (
              <View>
                <Dropdown
                  style={styles.dropdown}
                  placeholderStyle={styles.placeholderStyle}
                  selectedTextStyle={styles.selectedTextStyle}
                  inputSearchStyle={styles.inputSearchStyle}
                  iconStyle={styles.iconStyle}
                  data={classrooms}
                  dropdownPosition="top"
                  search
                  maxHeight={300}
                  labelField="label"
                  valueField="value"
                  placeholder="Select Classroom"
                  searchPlaceholder="Search..."
                  value={classroom}
                  onChange={(item) => {
                    setClassroom(item.value);
                  }}
                />
              </View>
            )}

            <View style={styles.buttonContainer}>
              <Button title="Cancel" onPress={onCancel} />
              <Button title="Add Task" onPress={handleAddNotification} />
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-end",
    width: "100%",
  },
  formContainer: {
    backgroundColor: "white",
    padding: 16,
    paddingTop: 20,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  input: {
    height: 50,
    borderRadius: 8,
    borderColor: "#ccc",
    borderWidth: 1,
    marginTop: 16,
    paddingLeft: 8,
    backgroundColor: "#fff",
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    marginTop: 20,
  },
  switchLabel: {
    fontSize: 16,
    color: "#333",
  },
  switch: {
    marginLeft: 15,
    transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }],
  },
  dropdown: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    marginTop: 16,
  },
  placeholderStyle: {
    fontSize: 16,
    color: "#aaa",
  },
  selectedTextStyle: {
    fontSize: 16,
    color: "#333",
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
});

export default AddNotification;
