//authApi.js

import axios from "axios";

export const BASE_URL = "http://localhost:8000/api/";

export const register = async (userData) => {
  try {
    const response = await axios.post(`${BASE_URL}register/`, userData);
    return response.data;
  } catch (error) {
    if (error.response) {
      // The request was made, and the server responded with a status code that falls out of the range of 200s
      console.error("Server responded with an error:", error.response.data);
      throw error.response.data; // Return the server response data
    } else if (error.request) {
      // The request was made but no response was received
      console.error("No response received from the server");
      throw "No response received from the server";
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error("Error setting up the request:", error.message);
      throw "Error setting up the request";
    }
  }
};

export const login = async (userData) => {
  try {
    const response = await axios.post(`${BASE_URL}login/`, userData);
    return response.data;
  } catch (error) {
    if (error.response) {
      if (error.response.data.email) {
        throw error.response.data.email[0];
      }
      console.error("Server responded with an error:", error.response.data);
      throw "Login failed due to server error";
    } else if (error.request) {
      console.error("No response received from the server");
      throw "No response received from the server";
    } else {
      console.error("Error setting up the request:", error.message);
      throw "Error setting up the request";
    }
  }
};

export const getUserData = async (userToken) => {
  try {
    console.log("User Token inside getUser:", userToken);
    const response = await axios.get(`${BASE_URL}get_user_data/`, {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw "Error fetching user data";
  }
};

export const updateUserData = async (userToken, newData) => {
  try {
    const formData = new FormData();

    Object.keys(newData).forEach((key) => {
      formData.append(key, newData[key]);
    });

    const response = await axios.patch(
      `${BASE_URL}update_user_data/`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${userToken}`,
        },
      }
    );

    console.log("Response from updateUserData:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error updating user data:", error);
    throw "Error updating user data";
  }
};

export const updateProfilePicture = async (userToken, newProfilePicture) => {
  try {
    const formData = new FormData();

    if (newProfilePicture && newProfilePicture.uri) {
      const timestamp = new Date().getTime();
      const fileName = `profile_picture_${timestamp}.jpg`;

      formData.append("profile_picture", {
        uri: newProfilePicture.uri,
        name: fileName,
        type: "image/jpeg",
      });
    }
    console.log("User Token inside updateProfilePicture:", userToken);
    console.log("FormData inside updateProfilePicture:", formData);
    const response = await axios.patch(
      `${BASE_URL}update_user_data/`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${userToken}`,
        },
      }
    );

    console.log("Response from updateProfilePicture:", response.data);
    return response.data;
  } catch (error) {
    console.log("Error updating profile picture:", error);
    console.error("Error updating profile picture:", error);
    throw "Error updating profile picture";
  }
};

export const updatePassword = async (userToken, passwordData) => {
  try {
    const response = await axios.patch(
      `${BASE_URL}update_password/`,
      passwordData,
      {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error updating password:", error);
    throw "Error updating password";
  }
};

// export const updateUserData = async (userToken, newData) => {
//   try {
//     const formData = new FormData();
//     formData.append("username", newData.email);
//     formData.append("email", newData.email);
//     formData.append("first_name", newData.first_name);
//     formData.append("last_name", newData.last_name);

//     if (newData.profile_picture && newData.profile_picture.uri) {
//       const timestamp = new Date().getTime();
//       const fileName = `profile_picture_${timestamp}.jpg`;

//       formData.append("profile_picture", {
//         uri: newData.profile_picture.uri,
//         name: fileName,
//         type: "image/jpeg",
//       });
//     }

//     const response = await axios.post(`${BASE_URL}get_user_data/`, formData, {
//       headers: {
//         "Content-Type": "multipart/form-data",
//         Authorization: `Bearer ${userToken}`,
//       },
//     });
//     console.log("Response from updateUserData:", response.data);
//     return response.data;
//   } catch (error) {
//     console.error("Error updating personal details:", error);
//     throw "Error updating personal details";
//   }
// };
