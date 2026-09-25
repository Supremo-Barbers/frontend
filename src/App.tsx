import React from "react";
import AppLayout from "./components/layout/AppLayout";
import CourseList from "./features/courses/components/CourseList";
import CategoryList from "./features/categories/components/CategoryList";
import AssessmentList from "./features/assessments/components/AssessmentList";
import StudentRoster from "./features/students/components/StudentRoster";
import CourseRoster from "./features/enrollments/components/CourseRoster";
import ScoreEntry from "./features/scores/components/ScoreEntry";
import Gradebook from "./features/grades/components/Gradebook";
import { useCourseStore } from "./stores/course.store";

export default function App(): React.JSX.Element {
  const selectedCourse = useCourseStore((state) => state.selectedCourse);

  return (
    <AppLayout>
      <CourseList />

      {selectedCourse && (
        <div className="mt-8 pt-8 border-t space-y-6">
          <div className="flex flex-col gap-2">
            <h2 className="text-2xl font-bold tracking-tight">{selectedCourse.code} Workspace</h2>
            <p className="text-muted-foreground">
              {selectedCourse.title} ({selectedCourse.term})
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-3">
              <ScoreEntry />
            </div>
            <div className="lg:col-span-1 space-y-6">
              <CategoryList />
              <AssessmentList />
            </div>
            <div className="md:col-span-1 space-y-6">
              <StudentRoster />
              <CourseRoster />
            </div>
            <div className="lg:col-span-3">
              <Gradebook />
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
