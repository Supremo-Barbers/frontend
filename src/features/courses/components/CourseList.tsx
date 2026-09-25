import React from "react";
import { useCourses } from "../hooks/useCourses";
import CourseCard from "./CourseCard";
import CreateCourseDialog from "./CreateCourseDialog";

export default function CourseList(): React.JSX.Element {
  const { courses, isLoading, error, selectedCourse, selectCourse, addCourse } = useCourses();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Courses</h2>
          <p className="text-muted-foreground">Manage your courses and access grading workspaces.</p>
        </div>
        <CreateCourseDialog onSubmit={addCourse} />
      </div>

      {error && <div className="p-4 rounded-md bg-destructive/15 text-destructive font-medium">{error}</div>}

      {isLoading && courses.length === 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-48 rounded-xl bg-muted animate-pulse" />
          ))}
        </div>
      ) : courses.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 text-center border rounded-xl border-dashed bg-muted/30">
          <h3 className="text-lg font-medium">No courses found</h3>
          <p className="text-sm text-muted-foreground mt-1 max-w-sm">
            You don't have any courses yet. Create one to get started with the grading workflow.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              isSelected={selectedCourse?.id === course.id}
              onSelect={selectCourse}
            />
          ))}
        </div>
      )}
    </div>
  );
}
