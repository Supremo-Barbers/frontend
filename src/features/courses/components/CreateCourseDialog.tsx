import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { CreateCourseRequest } from "@/schemas/course.schemas";
import { CreateCourseRequestSchema } from "@/schemas/course.schemas";
import type { Course } from "@/schemas/course.schemas";
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
import { toast } from "sonner";

interface CreateCourseDialogProps {
  onSubmit: (data: CreateCourseRequest) => Promise<Course>;
}

export default function CreateCourseDialog({ onSubmit }: CreateCourseDialogProps): React.JSX.Element {
  const [isOpen, setIsOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateCourseRequest>({
    resolver: zodResolver(CreateCourseRequestSchema),
    defaultValues: {
      code: "",
      title: "",
      term: "",
    },
  });

  const handleFormSubmit = async (data: CreateCourseRequest): Promise<void> => {
    try {
      await onSubmit(data);
      toast.success("Course created successfully");
      setIsOpen(false);
      reset();
    } catch (error) {
      toast.error("Failed to create course");
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
      <DialogTrigger className={buttonVariants({ variant: "default" })}>Create Course</DialogTrigger>
      <DialogContent className="sm:max-w-106.25">
        <DialogHeader>
          <DialogTitle>Create New Course</DialogTitle>
          <DialogDescription>Enter the details for the new course offering.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="code">Course Code</Label>
            <Input id="code" placeholder="e.g. CS311" {...register("code")} />
            {errors.code && <p className="text-sm text-destructive">{errors.code.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="title">Course Title</Label>
            <Input id="title" placeholder="e.g. Programming Languages" {...register("title")} />
            {errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="term">Academic Term</Label>
            <Input id="term" placeholder="e.g. 1st Term AY 2026-2027" {...register("term")} />
            {errors.term && <p className="text-sm text-destructive">{errors.term.message}</p>}
          </div>
          <div className="pt-4 flex justify-end">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create Course"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
