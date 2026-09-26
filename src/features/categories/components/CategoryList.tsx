import React, { useState } from "react";
import { useCategories } from "../hooks/useCategories";
import CreateCategoryDialog from "./CreateCategoryDialog";
import EditCategoryDialog from "./EditCategoryDialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

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

export default function CategoryList(): React.JSX.Element {
  const { categories, isLoading, error, addCategory, updateCategory, deleteCategory } = useCategories();
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);

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
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Category Name</TableHead>
                  <TableHead className="text-right">Weight</TableHead>
                  <TableHead className="w-25 text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.map((category) => (
                  <TableRow key={category.id}>
                    <TableCell className="font-medium">{category.name}</TableCell>
                    <TableCell className="text-right">
                      <Badge variant="secondary" className="text-sm">
                        {Math.round(category.weight * 100)}%
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium hover:bg-accent hover:text-accent-foreground h-8 w-8 focus-visible:outline-none">
                          <MoreHorizontalIcon className="h-4 w-4" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <EditCategoryDialog category={category} onSubmit={updateCategory} />
                          <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            onClick={(e) => {
                              e.preventDefault();
                              setCategoryToDelete(category.id);
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

      <AlertDialog open={!!categoryToDelete} onOpenChange={(open) => !open && setCategoryToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the category and all assessments and scores
              associated with it.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={async () => {
                if (categoryToDelete) {
                  try {
                    await deleteCategory(categoryToDelete);
                    toast.success("Category deleted successfully");
                  } catch (error: unknown) {
                    toast.error(error instanceof Error ? error.message : "Failed to delete category");
                  }
                  setCategoryToDelete(null);
                }
              }}
            >
              Yes, delete category
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}
