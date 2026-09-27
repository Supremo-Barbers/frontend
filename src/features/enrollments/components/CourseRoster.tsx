import React, { useState } from "react";
import { useEnrollments } from "../hooks/useEnrollments";
import { useStudents } from "@/features/students/hooks/useStudents";
import EnrollStudentDialog from "./EnrollStudentDialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useCourseStore } from "@/stores/course.store";

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { MoreHorizontalIcon } from "lucide-react";
import { toast } from "sonner";

export default function CourseRoster(): React.JSX.Element {
  const { enrollments, isLoading, error, enrollStudent, unenrollStudent } = useEnrollments();
  const { students } = useStudents();
  const selectedCourse = useCourseStore((state) => state.selectedCourse);
  const [enrollmentToDelete, setEnrollmentToDelete] = useState<string | null>(null);

  if (!selectedCourse) {
    return <></>;
  }

  const enrolledStudentIds = new Set(enrollments.map((e) => e.studentId));
  const availableStudents = students.filter((s) => !enrolledStudentIds.has(s.id));

  const enrolledStudents = enrollments
    .map((e) => {
      const student = students.find((s) => s.id === e.studentId);
      return student ? { ...student, enrollmentId: e.id } : undefined;
    })
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
                  <TableHead className="w-[100px] text-right">Action</TableHead>
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
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium hover:bg-accent hover:text-accent-foreground h-8 w-8 focus-visible:outline-none">
                          <MoreHorizontalIcon className="h-4 w-4" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem 
                            className="text-destructive focus:text-destructive"
                            onClick={(e) => {
                              e.preventDefault();
                              if (student.enrollmentId) {
                                setEnrollmentToDelete(student.enrollmentId);
                              }
                            }}
                          >
                            Unenroll
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </CardContent>

      <AlertDialog open={!!enrollmentToDelete} onOpenChange={(open) => !open && setEnrollmentToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove the student from this course. Any scores associated with this student in this course will also be deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={async () => {
                if (enrollmentToDelete) {
                  try {
                    await unenrollStudent(enrollmentToDelete);
                    toast.success("Student unenrolled successfully");
                  } catch (error: unknown) {
                    toast.error(error instanceof Error ? error.message : "Failed to unenroll student");
                  }
                  setEnrollmentToDelete(null);
                }
              }}
            >
              Yes, unenroll
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}
