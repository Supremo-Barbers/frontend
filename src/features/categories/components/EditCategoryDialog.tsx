import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Category, CreateCategoryRequest } from "@/schemas/category.schemas";
import { CreateCategoryRequestSchema } from "@/schemas/category.schemas";
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
import { toast } from "sonner";

interface EditCategoryDialogProps {
  category: Category;
  onSubmit: (id: string, data: CreateCategoryRequest) => Promise<Category>;
}

export default function EditCategoryDialog({ category, onSubmit }: EditCategoryDialogProps): React.JSX.Element {
  const [isOpen, setIsOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateCategoryRequest>({
    resolver: zodResolver(CreateCategoryRequestSchema),
    defaultValues: {
      name: category.name,
      weight: category.weight,
    },
  });

  useEffect(() => {
    if (isOpen) {
      reset({
        name: category.name,
        weight: category.weight,
      });
    }
  }, [isOpen, category, reset]);

  const handleFormSubmit = async (data: CreateCategoryRequest): Promise<void> => {
    try {
      await onSubmit(category.id, data);
      toast.success("Category updated successfully");
      setIsOpen(false);
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Failed to update category");
      }
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
      <DialogTrigger className="relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground w-full text-left">
        Edit
      </DialogTrigger>
      <DialogContent className="sm:max-w-106.25">
        <DialogHeader>
          <DialogTitle>Edit Category</DialogTitle>
          <DialogDescription>Update the details of this rubric category.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="name">Category Name</Label>
            <Input id="name" placeholder="e.g. Assignments" {...register("name")} />
            {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="weight">Weight (Decimal from 0 to 1)</Label>
            <Input
              id="weight"
              type="number"
              step="0.01"
              placeholder="e.g. 0.3 for 30%"
              {...register("weight", { valueAsNumber: true })}
            />
            {errors.weight && <p className="text-sm text-destructive">{errors.weight.message}</p>}
            <p className="text-xs text-muted-foreground mt-1">Enter a value between 0 and 1. Example: 0.25 = 25%.</p>
          </div>

          <div className="pt-4 flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
