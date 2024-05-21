import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { useAuth } from "../../api/authContext";
import { encryptId, getUserData } from "../../api/authApi";
import { getClassName } from "../../api/classApi";
import { BASE_URL } from "../../api/authApi";
import Barcode from "react-native-barcode-svg";

const IdCard = () => {
  const { userToken, userProfile } = useAuth();
  const [encryptedId, setEncryptedId] = useState(null);
  const [userData, setUserData] = useState(null);
  const [classroom, setClassroom] = useState(null);
  const modifiedURL = BASE_URL.replace(/\/api\/$/, "");

  useEffect(() => {
    const getEncryptedId = async () => {
      const encryptedId = await encryptId(userToken);
      setEncryptedId(encryptedId);
    };
    const fetchData = async () => {
      try {
        const data = await getUserData(userToken);
        setUserData(data.user_data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    const getClassroom = async () => {
      try {
        const data = await getClassName(userToken);
        setClassroom(data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchData();
    getEncryptedId();
    getClassroom();
  }, []);

  if (!userData) {
    return <Text>Loading...</Text>;
  }

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.top}>
          <View style={{ width: "40%", justifyContent: "center" }}>
            <Image
              style={styles.logo}
              source={{
                uri: "https://upload.wikimedia.org/wikipedia/commons/d/dc/London_Metropolitan_University_Logo.jpg",
              }}
            />
          </View>
          <View style={styles.topRight}>
            <Text style={styles.classroom}>
              {
                classroom?.find((element) => element.id === userData?.classroom)
                  ?.name
              }
            </Text>
            <Text style={styles.role}>
              {userData.is_staff ? "Staff" : "Student"}
            </Text>
            <Text style={styles.start_date}>
              {
                classroom?.find((element) => element.id === userData?.classroom)
                  ?.start_date
              }
            </Text>
          </View>
        </View>
        <View style={styles.middle}>
          <View style={styles.left}>
            <Text
              style={[
                styles.name,
                {
                  fontSize: 20,
                  fontWeight: "bold",
                  textTransform: "uppercase",
                },
              ]}
            >
              {userData.first_name}
            </Text>
            <Text
              style={[
                styles.name,
                {
                  fontSize: 20,
                  fontWeight: "bold",
                  textTransform: "uppercase",
                  marginBottom: 10,
                },
              ]}
            >
              {userData.last_name}
            </Text>
            <View style={styles.qrCodeContainer}>
              <Text style={styles.end_date}>
                Expires on:{" "}
                {
                  classroom?.find(
                    (element) => element.id === userData?.classroom
                  )?.end_date
                }
              </Text>
              {encryptedId && (
                <Barcode
                  value={JSON.stringify(encryptedId)}
                  format="CODE128"
                  maxWidth={250}
                  height={30}
                />
              )}
            </View>
          </View>
          <View style={styles.right}>
            <View style={styles.photo}>
              <Image
                source={{ uri: modifiedURL + userProfile }}
                style={{ width: "100%", height: "100%" }}
              />
            </View>
          </View>
        </View>
        <View style={styles.bottom}>
          <Text style={styles.infoText}>
            Please display when requested to do so by a member of the University
            staff.
          </Text>
          <Text style={styles.infoText}>
            This card remains the property of London Metropolitan University.
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f2f2",
    alignItems: "center",
    paddingTop: 20,
  },
  card: {
    width: "95%",
    height: 250,
    backgroundColor: "#fff",
    borderRadius: 15,
    paddingHorizontal: 20,
    paddingVertical: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    flexDirection: "column",
  },
  top: {
    // borderWidth: 1,
    height: "25%",
    flexDirection: "row",
  },
  middle: {
    flexDirection: "row",
    alignItems: "center",
    // borderWidth: 1,
    height: "60%",
  },
  bottom: {
    // borderWidth: 1,
    height: "15%",
    justifyContent: "flex-end",
  },
  topRight: {
    width: "60%",
    height: "100%",
    // borderWidth: 1,
    borderColor: "red",
    justifyContent: "center",
    alignItems: "flex-end",
    flexDirection: "Column",
  },
  logo: {
    width: 150,
    height: 50,
    // borderWidth: 1,
    resizeMode: "contain",
  },
  left: {
    width: "70%",
    height: "100%",
    // borderWidth: 1,
    borderColor: "red",
    justifyContent: "flex-end",
    paddingRight: 10,
  },
  right: {
    width: "30%",
    // borderWidth: 1,
    borderColor: "red",
    alignItems: "flex-end",
    height: "100%",
    justifyContent: "center",
  },
  photo: {
    width: 105,
    height: 135,
    resizeMode: "cover",
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "right",
    // borderWidth: 1,
  },
  role: {
    fontSize: 16,
    color: "black",
    textTransform: "uppercase",
  },
  classroom: {
    fontSize: 12,
    color: "black",
  },
  start_date: {
    fontSize: 12,
    color: "black",
  },
  end_date: {
    fontSize: 12,
    color: "black",
    // borderWidth: 1,
  },
  infoText: {
    fontSize: 9,
    // borderWidth: 1,
    color: "black",
  },
  qrCodeContainer: {
    // borderWidth: 1,
    borderColor: "blue",
    overflow: "hidden",
  },
});

export default IdCard;
