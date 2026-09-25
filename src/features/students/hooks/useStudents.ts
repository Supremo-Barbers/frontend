import { useState } from "react";
import type { Student, RegisterStudentRequest } from "@/schemas/student.schemas";
import { registerStudent as registerStudentApi } from "@/api/student.api";
import { useStudentStore } from "@/stores/student.store";

export const useStudents = () => {
  const students = useStudentStore((state) => state.students);
  const addStudentToStore = useStudentStore((state) => state.addStudent);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const registerStudent = async (data: RegisterStudentRequest): Promise<Student> => {
    setIsLoading(true);
    setError(null);
    try {
      const newStudent = await registerStudentApi(data);
      addStudentToStore(newStudent);
      return newStudent;
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
        throw err;
      }
      const genericError = new Error("Failed to register student");
      setError(genericError.message);
      throw genericError;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    students,
    isLoading,
    error,
    registerStudent,
  };
};
