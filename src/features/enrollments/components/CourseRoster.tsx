import React from "react";
import { useEnrollments } from "../hooks/useEnrollments";
import { useStudents } from "@/features/students/hooks/useStudents";
import EnrollStudentDialog from "./EnrollStudentDialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCourseStore } from "@/stores/course.store";

export default function CourseRoster(): React.JSX.Element {
  const { enrollments, isLoading, error, enrollStudent } = useEnrollments();
  const { students } = useStudents();
  const selectedCourse = useCourseStore((state) => state.selectedCourse);

  if (!selectedCourse) {
    return <></>;
  }

  const enrolledStudentIds = new Set(enrollments.map((e) => e.studentId));
  const availableStudents = students.filter((s) => !enrolledStudentIds.has(s.id));

  const enrolledStudents = enrollments
    .map((e) => students.find((s) => s.id === e.studentId))
    .filter((s): s is NonNullable<typeof s> => s !== undefined);

  return (
    <Card className="shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div>
          <CardTitle className="text-xl">Course Roster</CardTitle>
          <p className="text-sm text-muted-foreground mt-1">Students enrolled in {selectedCourse.code}.</p>
        </div>
        <EnrollStudentDialog availableStudents={availableStudents} onSubmit={enrollStudent} />
      </CardHeader>
      <CardContent>
        {error && (
          <div className="mb-4 p-3 rounded-md bg-destructive/15 text-destructive text-sm font-medium">{error}</div>
        )}

        <div className="flex flex-col gap-3">
          {isLoading && enrollments.length === 0 ? (
            <div className="space-y-3">
              {[1, 2].map((i) => (
                <div key={i} className="h-12 bg-muted animate-pulse rounded-md" />
              ))}
            </div>
          ) : enrolledStudents.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground border border-dashed rounded-md">
              No students are enrolled in this course yet.
            </div>
          ) : (
            <ul className="space-y-2">
              {enrolledStudents.map((student) => (
                <li key={student.id} className="flex items-center justify-between p-3 border rounded-md bg-muted/20">
                  <div>
                    <span className="font-medium">
                      {student.lastName}, {student.firstName}
                    </span>
                  </div>
                  <span className="text-sm font-mono text-muted-foreground">{student.studentNumber}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
