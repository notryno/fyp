import axios from "axios";
import { BASE_URL } from "./authApi";

export const getGrades = async (userToken, courseId) => {
  try {
    const response = await axios.get(`${BASE_URL}grade/`, {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching grades for course:", error);
    throw "Error fetching grades";
  }
};

export const createGrade = async (userToken, formData) => {
  try {
    console.log("formData:", formData);
    const courseIds = [formData.course.id];
    console.log(courseIds);

    const studentIds = [formData.student.id];
    let updatedFormData = {
      ...formData,
      student: studentIds,
      course: courseIds,
    };

    const response = await api.post(
      `/grades/${formData.student.id}/`,
      updatedFormData,
      {
        headers: {
          Authorization: `Bearer ${userToken}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const editGrade = async (userToken, gradeId, formData) => {
  try {
    console.log(formData);
    delete formData.id;
    delete formData.course;
    delete formData.grade;
    delete formData.student;

    console.log("Edited", formData);

    const response = await api.patch(`/grade/${gradeId}/`, formData, {
      headers: {
        Authorization: `Bearer ${userToken}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteGrade = async (userToken, gradeId) => {
  try {
    const response = await api.delete(`/grade/${gradeId}/`, {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
