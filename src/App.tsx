import React from "react";
import AppLayout from "./components/layout/AppLayout";
import CourseList from "./features/courses/components/CourseList";
import CategoryList from "./features/categories/components/CategoryList";
import AssessmentList from "./features/assessments/components/AssessmentList";
import StudentRoster from "./features/students/components/StudentRoster";
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
            <div className="lg:col-span-1 space-y-6">
              <CategoryList />
              <AssessmentList />
            </div>
            <div className="md:col-span-1 space-y-6">
              <StudentRoster />
            </div>
            <div className="h-64 rounded-xl bg-muted/50 border border-dashed flex items-center justify-center md:col-span-2 lg:col-span-1">
              <span className="text-muted-foreground">Feature 10 & 11: Gradebook</span>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
