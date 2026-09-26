import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Student, RegisterStudentRequest } from "../schemas/student.schemas";
import { RegisterStudentRequestSchema } from "../schemas/student.schemas";

interface StudentState {
  students: Student[];
  createStudent: (request: RegisterStudentRequest) => Promise<Student>;
}

export const useStudentStore = create<StudentState>()(
  persist(
    (set) => ({
      students: [],
      createStudent: async (request) => {
        const validatedData = RegisterStudentRequestSchema.parse(request);
        const newStudent: Student = {
          id: crypto.randomUUID(),
          createdAt: new Date().toISOString(),
          ...validatedData,
        };
        set((state) => ({ students: [...state.students, newStudent] }));
        return newStudent;
      },
    }),
    {
      name: "student-store",
    },
  ),
);
