import React from "react";
import { useGrades } from "../hooks/useGrades";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RefreshCwIcon } from "lucide-react";
import { useBackendEngineStore } from "@/stores/backend-engine.store";

export default function Gradebook(): React.JSX.Element {
  const { gradeSummary, isLoading, error, refetchGrades } = useGrades();
  const currentEngine = useBackendEngineStore((state) => state.engine);

  return (
    <Card className="shadow-sm overflow-hidden">
      <CardHeader className="flex flex-col sm:flex-row sm:items-start justify-between space-y-4 sm:space-y-0 pb-4 bg-muted/10">
        <div>
          <CardTitle className="text-xl">Course Gradebook</CardTitle>
          <CardDescription className="mt-1">Dynamically computed grades from the backend engine.</CardDescription>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="text-xs">
            Engine: {currentEngine}
          </Badge>
          <Button variant="outline" size="sm" onClick={() => refetchGrades()} disabled={isLoading}>
            <RefreshCwIcon className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        {error ? (
          <div className="m-6 p-4 rounded-md bg-destructive/15 text-destructive font-medium text-center">
            <p>{error}</p>
            <p className="text-sm mt-2 opacity-80">The backend might not be running or the engine is unreachable.</p>
          </div>
        ) : isLoading && !gradeSummary ? (
          <div className="m-6 space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-12 bg-muted animate-pulse rounded-md" />
            ))}
          </div>
        ) : !gradeSummary || gradeSummary.students.length === 0 ? (
          <div className="m-6 py-12 text-center text-muted-foreground border border-dashed rounded-md">
            No grades available yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs uppercase bg-muted/50 border-b">
                <tr>
                  <th className="px-4 py-3 font-medium">Student</th>
                  {gradeSummary.students[0]?.categoryBreakdown.map((cat) => (
                    <th key={cat.categoryId} className="px-4 py-3 font-medium whitespace-nowrap">
                      {cat.categoryName} ({Math.round(cat.weight * 100)}%)
                    </th>
                  ))}
                  <th className="px-4 py-3 font-medium text-right">Final Raw %</th>
                  <th className="px-4 py-3 font-medium text-center">Grade Point</th>
                  <th className="px-4 py-3 font-medium">Remark</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {gradeSummary.students.map((student) => (
                  <tr key={student.studentId} className="hover:bg-muted/10">
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="font-medium">{student.fullName}</div>
                      <div className="text-xs text-muted-foreground font-mono mt-0.5">{student.studentNumber}</div>
                    </td>
                    {student.categoryBreakdown.map((cat) => (
                      <td key={cat.categoryId} className="px-4 py-3 whitespace-nowrap">
                        <div className="font-medium">{cat.categoryPercentage.toFixed(1)}%</div>
                        <div className="text-xs text-muted-foreground mt-0.5">
                          {cat.pointsEarned.toFixed(1)} / {cat.totalPossible.toFixed(1)} pts
                        </div>
                        <div className="text-xs text-muted-foreground">({cat.weightedScore.toFixed(1)}% weighted)</div>
                      </td>
                    ))}
                    <td className="px-4 py-3 text-right font-medium text-base">
                      {student.finalRawPercentage.toFixed(2)}%
                    </td>
                    <td className="px-4 py-3 text-center">
                      <Badge
                        variant={
                          student.gradePoint === "R"
                            ? "destructive"
                            : student.gradePoint === "4.0"
                              ? "default"
                              : "secondary"
                        }
                        className="text-sm font-mono px-2 py-0.5"
                      >
                        {student.gradePoint}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`font-medium ${student.academicRemark.toLowerCase() === "failed" || student.academicRemark === "R" ? "text-destructive" : "text-primary"}`}
                      >
                        {student.academicRemark}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="bg-muted/30 p-4 border-t flex items-center justify-between text-xs text-muted-foreground">
              <span>System: {gradeSummary.gradingSystem}</span>
              <span>Course Code: {gradeSummary.courseCode}</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
