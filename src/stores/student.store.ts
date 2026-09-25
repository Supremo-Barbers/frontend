import { create } from "zustand";
import type { Student } from "../schemas/student.schemas";

interface StudentState {
  students: Student[];
  addStudent: (student: Student) => void;
}

export const useStudentStore = create<StudentState>((set) => ({
  students: [],
  addStudent: (student) => set((state) => ({ students: [...state.students, student] })),
}));
