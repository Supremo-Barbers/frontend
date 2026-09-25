import React from "react";
import { useCategories } from "../hooks/useCategories";
import CreateCategoryDialog from "./CreateCategoryDialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function CategoryList(): React.JSX.Element {
  const { categories, isLoading, error, addCategory } = useCategories();

  const totalWeight = categories.reduce((sum, cat) => sum + cat.weight, 0);
  const totalPercentage = Math.round(totalWeight * 100);

  return (
    <Card className="shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div>
          <CardTitle className="text-xl">Rubric & Categories</CardTitle>
          <p className="text-sm text-muted-foreground mt-1">Manage the grading weights for this course.</p>
        </div>
        <CreateCategoryDialog onSubmit={addCategory} />
      </CardHeader>
      <CardContent>
        {error && (
          <div className="mb-4 p-3 rounded-md bg-destructive/15 text-destructive text-sm font-medium">{error}</div>
        )}

        <div className="flex flex-col gap-3">
          {isLoading && categories.length === 0 ? (
            <div className="space-y-3">
              {[1, 2].map((i) => (
                <div key={i} className="h-12 bg-muted animate-pulse rounded-md" />
              ))}
            </div>
          ) : categories.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground border border-dashed rounded-md">
              No categories have been created yet.
            </div>
          ) : (
            categories.map((category) => (
              <div key={category.id} className="flex items-center justify-between p-3 border rounded-md">
                <span className="font-medium">{category.name}</span>
                <Badge variant="secondary" className="text-sm">
                  {Math.round(category.weight * 100)}%
                </Badge>
              </div>
            ))
          )}

          {categories.length > 0 && (
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-md mt-2">
              <span className="font-semibold">Total Rubric Weight</span>
              <span className={`font-bold ${totalPercentage !== 100 ? "text-destructive" : "text-primary"}`}>
                {totalPercentage}%
              </span>
            </div>
          )}

          {categories.length > 0 && totalPercentage !== 100 && (
            <p className="text-xs text-destructive text-right">
              Total weight must equal 100% (currently {totalPercentage}%).
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
