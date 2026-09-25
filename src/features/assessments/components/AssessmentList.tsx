import React from "react";
import { useCategories } from "@/features/categories/hooks/useCategories";
import { useAssessments } from "../hooks/useAssessments";
import CreateAssessmentDialog from "./CreateAssessmentDialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AssessmentList(): React.JSX.Element {
  const { categories } = useCategories();
  const { assessments, isLoading, error, addAssessment } = useAssessments(categories);

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
                  <ul className="space-y-2">
                    {group.assessments.map((assessment) => (
                      <li
                        key={assessment.id}
                        className="flex items-center justify-between p-3 border rounded-md bg-muted/20"
                      >
                        <span className="font-medium text-sm">{assessment.title}</span>
                        <span className="text-sm text-muted-foreground">Max: {assessment.maxScore} pts</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
