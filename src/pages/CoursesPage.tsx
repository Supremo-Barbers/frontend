import React from "react";
import CourseList from "../features/courses/components/CourseList";

export default function CoursesPage(): React.JSX.Element {
  return (
    <div className="py-2">
      <CourseList />
    </div>
  );
}
