import React from "react";
import { useStudents } from "../hooks/useStudents";
import RegisterStudentDialog from "./RegisterStudentDialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function StudentRoster(): React.JSX.Element {
  const { students, isLoading, error, registerStudent } = useStudents();

  return (
    <Card className="shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div>
          <CardTitle className="text-xl">Global Student Registry</CardTitle>
          <p className="text-sm text-muted-foreground mt-1">Students registered in the system.</p>
        </div>
        <RegisterStudentDialog onSubmit={registerStudent} />
      </CardHeader>
      <CardContent>
        {error && (
          <div className="mb-4 p-3 rounded-md bg-destructive/15 text-destructive text-sm font-medium">{error}</div>
        )}

        <div className="flex flex-col gap-3">
          {isLoading && students.length === 0 ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-14 bg-muted animate-pulse rounded-md" />
              ))}
            </div>
          ) : students.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground border border-dashed rounded-md">
              No students are registered in the system yet.
            </div>
          ) : (
            <ul className="space-y-2">
              {students.map((student) => (
                <li
                  key={student.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-3 border rounded-md"
                >
                  <div>
                    <div className="font-medium">
                      {student.lastName}, {student.firstName}
                    </div>
                    <div className="text-sm text-muted-foreground">{student.email}</div>
                  </div>
                  <div className="mt-2 sm:mt-0 text-sm font-mono bg-muted/50 px-2 py-1 rounded">
                    {student.studentNumber}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
