import React, { useState } from "react";
import { useCategories } from "@/features/categories/hooks/useCategories";
import { useAssessments } from "../hooks/useAssessments";
import CreateAssessmentDialog from "./CreateAssessmentDialog";
import EditAssessmentDialog from "./EditAssessmentDialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useGradingSessionStore } from "@/stores/grading-session.store";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { MoreHorizontalIcon } from "lucide-react";
import { toast } from "sonner";

export default function AssessmentList(): React.JSX.Element {
  const { categories } = useCategories();
  const { assessments, isLoading, error, addAssessment, updateAssessment, deleteAssessment } =
    useAssessments(categories);
  const setActiveAssessment = useGradingSessionStore((state) => state.setActiveAssessment);
  const [assessmentToDelete, setAssessmentToDelete] = useState<string | null>(null);

  const groupedAssessments = categories.map((category) => {
    return {
      category,
      assessments: assessments.filter((a) => a.categoryId === category.id),
    };
  });

  return (
    <Card className="shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div>
          <CardTitle className="text-xl">Assessments</CardTitle>
          <p className="text-sm text-muted-foreground mt-1">Gradable activities grouped by rubric category.</p>
        </div>
        <CreateAssessmentDialog categories={categories} onSubmit={addAssessment} />
      </CardHeader>
      <CardContent>
        {error && (
          <div className="mb-4 p-3 rounded-md bg-destructive/15 text-destructive text-sm font-medium">{error}</div>
        )}

        <div className="flex flex-col gap-6">
          {isLoading && assessments.length === 0 ? (
            <div className="space-y-3">
              {[1, 2].map((i) => (
                <div key={i} className="h-20 bg-muted animate-pulse rounded-md" />
              ))}
            </div>
          ) : categories.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground border border-dashed rounded-md">
              You must create assessment categories first.
            </div>
          ) : groupedAssessments.every((g) => g.assessments.length === 0) ? (
            <div className="py-8 text-center text-muted-foreground border border-dashed rounded-md">
              No assessments have been created yet.
            </div>
          ) : (
            groupedAssessments.map((group) => (
              <div key={group.category.id} className="space-y-3">
                <div className="flex items-center justify-between border-b pb-2">
                  <h4 className="font-semibold">{group.category.name}</h4>
                  <span className="text-sm text-muted-foreground">{Math.round(group.category.weight * 100)}%</span>
                </div>
                {group.assessments.length === 0 ? (
                  <p className="text-sm text-muted-foreground italic pl-2">No activities yet.</p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[60%]">Title</TableHead>
                        <TableHead className="w-[20%]">Max Score</TableHead>
                        <TableHead className="w-[20%] text-right">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {group.assessments.map((assessment) => (
                        <TableRow key={assessment.id}>
                          <TableCell className="font-medium">{assessment.title}</TableCell>
                          <TableCell>{assessment.maxScore} pts</TableCell>
                          <TableCell className="text-right flex items-center justify-end gap-2">
                            <Button variant="outline" size="sm" onClick={() => setActiveAssessment(assessment)}>
                              Enter Scores
                            </Button>
                            <DropdownMenu>
                              <DropdownMenuTrigger className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium hover:bg-accent hover:text-accent-foreground h-8 w-8 focus-visible:outline-none">
                                <MoreHorizontalIcon className="h-4 w-4" />
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <EditAssessmentDialog
                                  assessment={assessment}
                                  categories={categories}
                                  onSubmit={updateAssessment}
                                />
                                <DropdownMenuItem
                                  className="text-destructive focus:text-destructive"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    setAssessmentToDelete(assessment.id);
                                  }}
                                >
                                  Delete
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
            ))
          )}
        </div>
      </CardContent>

      <AlertDialog open={!!assessmentToDelete} onOpenChange={(open) => !open && setAssessmentToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the assessment and all scores associated with
              it.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={async () => {
                if (assessmentToDelete) {
                  await deleteAssessment(assessmentToDelete);
                  toast.success("Assessment deleted successfully");
                  setAssessmentToDelete(null);
                }
              }}
            >
              Yes, delete assessment
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}
