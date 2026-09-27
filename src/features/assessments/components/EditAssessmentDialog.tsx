import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Assessment, CreateAssessmentRequest } from "@/schemas/assessment.schemas";
import { CreateAssessmentRequestSchema } from "@/schemas/assessment.schemas";
import type { Category } from "@/schemas/category.schemas";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select";
import { toast } from "sonner";

interface EditAssessmentDialogProps {
  assessment: Assessment;
  categories: Category[];
  onSubmit: (id: string, data: CreateAssessmentRequest) => Promise<Assessment>;
}

export default function EditAssessmentDialog({
  assessment,
  categories,
  onSubmit,
}: EditAssessmentDialogProps): React.JSX.Element {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>(assessment.categoryId);
  const [categoryError, setCategoryError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateAssessmentRequest>({
    resolver: zodResolver(CreateAssessmentRequestSchema),
    defaultValues: {
      title: assessment.title,
      maxScore: assessment.maxScore,
    },
  });

  useEffect(() => {
    if (isOpen) {
      reset({
        title: assessment.title,
        maxScore: assessment.maxScore,
      });
      setSelectedCategoryId(assessment.categoryId);
      setCategoryError(null);
    }
  }, [isOpen, assessment, reset]);

  const handleFormSubmit = async (data: CreateAssessmentRequest): Promise<void> => {
    if (!selectedCategoryId) {
      setCategoryError("Category is required");
      return;
    }

    try {
      await onSubmit(assessment.id, { ...data, categoryId: selectedCategoryId } as any);
      toast.success("Assessment updated successfully");
      setIsOpen(false);
    } catch (error) {
      toast.error("Failed to update assessment");
      console.error(error);
    }
  };

  const handleOpenChange = (open: boolean): void => {
    setIsOpen(open);
    if (!open) {
      reset();
    }
  };

  const handleCategoryChange = (value: string | null): void => {
    if (value) {
      setSelectedCategoryId(value);
      setCategoryError(null);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger className="relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground w-full text-left">
        Edit
      </DialogTrigger>
      <DialogContent className="sm:max-w-106.25">
        <DialogHeader>
          <DialogTitle>Edit Assessment</DialogTitle>
          <DialogDescription>Update the details of this assessment.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" placeholder="e.g. Midterm Exam" {...register("title")} />
            {errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select value={selectedCategoryId} onValueChange={handleCategoryChange}>
              <SelectTrigger id="category" className="w-full z-[100]">
                <span className={`flex flex-1 text-left ${!selectedCategoryId ? "text-muted-foreground" : ""}`}>
                  {selectedCategoryId
                    ? `${categories.find((c) => c.id === selectedCategoryId)?.name} (${Math.round((categories.find((c) => c.id === selectedCategoryId)?.weight || 0) * 100)}%)`
                    : "Select a category"}
                </span>
              </SelectTrigger>
              <SelectContent className="z-[100]">
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name} ({Math.round(category.weight * 100)}%)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {categoryError && <p className="text-sm text-destructive">{categoryError}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="maxScore">Max Score</Label>
            <Input
              id="maxScore"
              type="number"
              placeholder="e.g. 100"
              {...register("maxScore", { valueAsNumber: true })}
            />
            {errors.maxScore && <p className="text-sm text-destructive">{errors.maxScore.message}</p>}
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || categories.length === 0}>
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
