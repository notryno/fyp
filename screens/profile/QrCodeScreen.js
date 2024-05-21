import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  Image,
  TouchableOpacity,
} from "react-native";
import QRCode from "react-native-qrcode-svg";
import { useAuth } from "../../api/authContext";
import { useNavigation } from "@react-navigation/native";
import { encryptId, getUserData } from "../../api/authApi";
import { Ionicons } from "@expo/vector-icons";
import { getClassName } from "../../api/classApi";
import { BASE_URL } from "../../api/authApi";

const QrCodeScreen = () => {
  const { userToken, userProfile } = useAuth();
  const navigate = useNavigation();
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

  const handlePress = () => {
    navigate.navigate("IdCard");
  };

  return (
    <View style={styles.container}>
      <View style={styles.shadow}>
        <View style={styles.card}>
          <View style={styles.top}>
            <Text style={styles.title}>Personal ID</Text>
            <TouchableOpacity style={styles.icon} onPress={handlePress}>
              <Ionicons name="id-card-outline" size={30} color="#eb514a" />
            </TouchableOpacity>
          </View>
          <View style={styles.center}>
            <View style={styles.left}>
              <Text style={styles.name}>
                {userData?.first_name} {userData?.last_name}
              </Text>
              <Text style={styles.textTitle}>Group</Text>
              <Text style={styles.text}>
                {
                  classroom?.find(
                    (element) => element.id === userData?.classroom
                  )?.name
                }
              </Text>

              <Text style={styles.textTitle}>Start Date</Text>
              <Text style={styles.text}>
                {
                  classroom?.find(
                    (element) => element.id === userData?.classroom
                  )?.start_date
                }
              </Text>

              <Text style={styles.textTitle}>Email</Text>
              <Text style={styles.text}>{userData?.email}</Text>
            </View>
            <View style={styles.right}>
              <View style={styles.profileShadow}>
                <View style={styles.profileImageContainer}>
                  <View style={styles.profileImage}>
                    {userProfile ? (
                      <Image
                        source={{ uri: modifiedURL + userProfile }}
                        style={{ width: "100%", height: "100%" }}
                      />
                    ) : (
                      <View
                        style={{
                          width: "100%",
                          height: "100%",
                          justifyContent: "center",
                          alignItems: "center",
                          backgroundColor: "white",
                        }}
                      >
                        <View
                          style={{
                            position: "absolute",
                            left: 0,
                            right: 0,
                            top: 0,
                            bottom: 0,
                            justifyContent: "center",
                            alignItems: "center",
                            transform: [{ rotate: "45deg" }],
                          }}
                        >
                          <Text style={{ fontSize: 24, fontWeight: "bold" }}>
                            NO IMAGE
                          </Text>
                        </View>
                      </View>
                    )}
                  </View>

                  <View style={styles.role}>
                    <Text style={{ fontWeight: "bold", fontSize: 20 }}>
                      {userData?.is_staff ? "Staff" : "Student"}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
          <View style={styles.bottom}>
            <View style={styles.qr}>
              <QRCode value={JSON.stringify(encryptedId?.id)} size={200} />
            </View>
            <Text style={styles.endText}>
              {new Date(
                classroom?.find(
                  (element) => element.id === userData?.classroom
                )?.end_date
              ).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </Text>
          </View>
        </View>
      </View>
      <TouchableOpacity
        style={styles.scanButton}
        onPress={() => navigate.navigate("ScanQr")}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Ionicons name="qr-code-outline" size={28} color="white" />
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f2f2",
    alignItems: "center",
    justifyContent: "center",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    marginBottom: 10,
    overflow: "hidden",
  },
  shadow: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 3.84,
    elevation: 5,
    height: "85%",
    width: "90%",
  },
  top: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#eb514a",
    height: "10%",
    width: "100%",
    flexDirection: "row",
  },
  center: {
    backgroundColor: "#cc3232",
    height: "40%",
    width: "100%",
    flexDirection: "row",
  },
  left: {
    width: "60%",
    paddingLeft: 20,
    paddingTop: 20,
    paddingRight: 15,
  },
  right: {
    alignItems: "center",
    justifyContent: "center",
    width: "40%",
    // backgroundColor: "white",
    paddingRight: 20,
  },
  profileImage: {
    width: 140,
    height: 160,
    overflow: "hidden",
  },
  role: {
    backgroundColor: "white",
    paddingVertical: 15,
    width: 140,
    alignItems: "center",
  },
  profileImageContainer: {
    borderRadius: 5,
    overflow: "hidden",
  },
  profileShadow: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3.84,
    elevation: 5,
  },
  bottom: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#eb514a",
    height: "50%",
    flexDirection: "row",
    width: "100%",
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "white",
    width: "80%",
    alignSelf: "center",
    paddingLeft: 3,
  },
  icon: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 3.84,
    elevation: 5,
  },
  textTitle: {
    fontSize: 16,
    color: "white",
    marginTop: 15,
  },
  text: {
    fontSize: 18,
    color: "white",
    fontWeight: "bold",
  },
  name: {
    fontSize: 24,
    color: "white",
    fontWeight: "bold",
  },
  endText: {
    fontSize: 18,
    color: "white",
    fontWeight: "bold",
    position: "absolute",
    left: -5,
    alignSelf: "center",
    transform: [{ rotate: "-90deg" }],
  },
  qr: {
    borderRadius: 10,
    backgroundColor: "white",
    height: 220,
    width: 220,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 3.84,
    elevation: 5,
    borderWidth: 1,
  },
  scanButton: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.6,
    shadowRadius: 3.84,
    elevation: 5,
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "black",
    height: 60,
    width: 60,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "100%",
  },
  scanButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default QrCodeScreen;
