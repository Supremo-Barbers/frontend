import React, { useState } from "react";
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
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

interface CreateAssessmentDialogProps {
  categories: Category[];
  onSubmit: (categoryId: string, data: CreateAssessmentRequest) => Promise<Assessment>;
}

export default function CreateAssessmentDialog({
  categories,
  onSubmit,
}: CreateAssessmentDialogProps): React.JSX.Element {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateAssessmentRequest>({
    resolver: zodResolver(CreateAssessmentRequestSchema),
    defaultValues: {
      title: "",
      maxScore: undefined,
    },
  });

  const handleFormSubmit = async (data: CreateAssessmentRequest): Promise<void> => {
    if (!selectedCategoryId) return;
    try {
      await onSubmit(selectedCategoryId, data);
      toast.success("Assessment created successfully");
      setIsOpen(false);
      reset();
      setSelectedCategoryId("");
    } catch (error) {
      toast.error("Failed to create assessment");
      console.error(error);
    }
  };

  const handleOpenChange = (open: boolean): void => {
    setIsOpen(open);
    if (!open) {
      reset();
      setSelectedCategoryId("");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger className={buttonVariants({ variant: "default" })}>Create Assessment</DialogTrigger>
      <DialogContent className="sm:max-w-106.25">
        <DialogHeader>
          <DialogTitle>Create Assessment</DialogTitle>
          <DialogDescription>Add a new gradable activity to an assessment category.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select
              value={selectedCategoryId}
              onValueChange={(val) => {
                if (val) setSelectedCategoryId(val);
              }}
            >
              <SelectTrigger id="category">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {!selectedCategoryId && isOpen && (
              <p className="text-sm text-muted-foreground">Please select a category first.</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="title">Assessment Title</Label>
            <Input id="title" placeholder="e.g. Midterm Exam" {...register("title")} />
            {errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="maxScore">Maximum Score</Label>
            <Input
              id="maxScore"
              type="number"
              step="any"
              placeholder="e.g. 100"
              {...register("maxScore", { valueAsNumber: true })}
            />
            {errors.maxScore && <p className="text-sm text-destructive">{errors.maxScore.message}</p>}
          </div>
          <div className="pt-4 flex justify-end">
            <Button type="submit" disabled={isSubmitting || !selectedCategoryId}>
              {isSubmitting ? "Creating..." : "Create"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
