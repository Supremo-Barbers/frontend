import { apiClient } from "./client";
import type { Student, RegisterStudentRequest } from "../schemas/student.schemas";
import { StudentSchema } from "../schemas/student.schemas";

export const registerStudent = async (student: RegisterStudentRequest): Promise<Student> => {
  const response = await apiClient.post<unknown>("/students", student);
  return StudentSchema.parse(response.data);
};
