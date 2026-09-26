import React from "react";
import { useEnrollments } from "../hooks/useEnrollments";
import { useStudents } from "@/features/students/hooks/useStudents";
import EnrollStudentDialog from "./EnrollStudentDialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
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
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Student No.</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {enrolledStudents.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell className="font-medium">
                      {student.lastName}, {student.firstName}
                    </TableCell>
                    <TableCell>{student.email}</TableCell>
                    <TableCell className="font-mono">{student.studentNumber}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
