import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { Category, CreateCategoryRequest } from "@/schemas/category.schemas";
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

// a UI-specific schema that accepts 1-100 percentage
const CategoryFormSchema = z.object({
  name: z.string().trim().min(1, "Category name is required"),
  weightPercentage: z.number().positive("Must be greater than 0").lte(100, "Cannot exceed 100"),
});

type CategoryFormValues = z.infer<typeof CategoryFormSchema>;

interface CreateCategoryDialogProps {
  onSubmit: (data: CreateCategoryRequest) => Promise<Category>;
}

export default function CreateCategoryDialog({ onSubmit }: CreateCategoryDialogProps): React.JSX.Element {
  const [isOpen, setIsOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CategoryFormValues>({
    resolver: zodResolver(CategoryFormSchema),
    defaultValues: {
      name: "",
      weightPercentage: undefined,
    },
  });

  const handleFormSubmit = async (data: CategoryFormValues): Promise<void> => {
    try {
      // convert UI percentage (e.g. 30) to API fraction (0.30)
      const fractionalWeight = data.weightPercentage / 100;
      await onSubmit({ name: data.name, weight: fractionalWeight });
      setIsOpen(false);
      reset();
    } catch (error) {
      console.error(error);
    }
  };

  const handleOpenChange = (open: boolean): void => {
    setIsOpen(open);
    if (!open) {
      reset();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger className={buttonVariants({ variant: "default" })}>Add Category</DialogTrigger>
      <DialogContent className="sm:max-w-106.25">
        <DialogHeader>
          <DialogTitle>Add Assessment Category</DialogTitle>
          <DialogDescription>Categories determine the grading rubric (e.g., Laboratory 30%).</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Category Name</Label>
            <Input id="name" placeholder="e.g. Written Examinations" {...register("name")} />
            {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="weightPercentage">Weight (%)</Label>
            <Input
              id="weightPercentage"
              type="number"
              step="0.01"
              placeholder="e.g. 30"
              {...register("weightPercentage", { valueAsNumber: true })}
            />
            {errors.weightPercentage && <p className="text-sm text-destructive">{errors.weightPercentage.message}</p>}
          </div>
          <div className="pt-4 flex justify-end">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Adding..." : "Add Category"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
