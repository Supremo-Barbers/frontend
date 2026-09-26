import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Course, CreateCourseRequest } from "@/schemas/course.schemas";
import { CreateCourseRequestSchema } from "@/schemas/course.schemas";
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
import { EditIcon } from "lucide-react";

interface EditCourseDialogProps {
  course: Course;
  onSubmit: (id: string, data: CreateCourseRequest) => Promise<Course>;
}

export default function EditCourseDialog({ course, onSubmit }: EditCourseDialogProps): React.JSX.Element {
  const [isOpen, setIsOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateCourseRequest>({
    resolver: zodResolver(CreateCourseRequestSchema),
    defaultValues: {
      code: course.code,
      title: course.title,
      term: course.term,
    },
  });

  useEffect(() => {
    if (isOpen) {
      reset({
        code: course.code,
        title: course.title,
        term: course.term,
      });
    }
  }, [isOpen, course, reset]);

  const handleFormSubmit = async (data: CreateCourseRequest): Promise<void> => {
    try {
      await onSubmit(course.id, data);
      toast.success("Course updated successfully");
      setIsOpen(false);
    } catch (error) {
      toast.error("Failed to update course");
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
      <DialogTrigger className="inline-flex items-center justify-center whitespace-nowrap rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground h-8 px-3 text-xs">
        <EditIcon className="w-4 h-4 mr-2" />
        Edit Course
      </DialogTrigger>
      <DialogContent className="sm:max-w-106.25">
        <DialogHeader>
          <DialogTitle>Edit Course</DialogTitle>
          <DialogDescription>Update the details of the course.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="code">Course Code</Label>
            <Input id="code" placeholder="e.g. CS101" {...register("code")} />
            {errors.code && <p className="text-sm text-destructive">{errors.code.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="title">Course Title</Label>
            <Input id="title" placeholder="e.g. Introduction to Programming" {...register("title")} />
            {errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="term">Term</Label>
            <Input id="term" placeholder="e.g. Fall 2024" {...register("term")} />
            {errors.term && <p className="text-sm text-destructive">{errors.term.message}</p>}
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
