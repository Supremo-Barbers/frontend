import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Enrollment, EnrollStudentRequest } from "@/schemas/enrollment.schemas";
import { EnrollStudentRequestSchema } from "@/schemas/enrollment.schemas";
import type { Student } from "@/schemas/student.schemas";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button, buttonVariants } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

interface EnrollStudentDialogProps {
  availableStudents: Student[];
  onSubmit: (data: EnrollStudentRequest) => Promise<Enrollment>;
}

export default function EnrollStudentDialog({
  availableStudents,
  onSubmit,
}: EnrollStudentDialogProps): React.JSX.Element {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState<string>("");

  const {
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<EnrollStudentRequest>({
    resolver: zodResolver(EnrollStudentRequestSchema),
    defaultValues: {
      studentId: "",
    },
  });

  const handleFormSubmit = async (): Promise<void> => {
    if (!selectedStudentId) return;
    try {
      await onSubmit({ studentId: selectedStudentId });
      toast.success("Student enrolled successfully");
      setIsOpen(false);
      reset();
      setSelectedStudentId("");
    } catch (error) {
      toast.error("Failed to enroll student");
      console.error(error);
    }
  };

  const handleOpenChange = (open: boolean): void => {
    setIsOpen(open);
    if (!open) {
      reset();
      setSelectedStudentId("");
    }
  };

  const handleStudentChange = (value: string | null): void => {
    if (value) {
      setSelectedStudentId(value);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger className={buttonVariants({ variant: "default" })}>Enroll Student</DialogTrigger>
      <DialogContent className="sm:max-w-106.25">
        <DialogHeader>
          <DialogTitle>Enroll Student</DialogTitle>
          <DialogDescription>Select a globally registered student to enroll in this course.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="student">Student</Label>
            <Select value={selectedStudentId} onValueChange={handleStudentChange}>
              <SelectTrigger id="student">
                <SelectValue placeholder="Select a student" />
              </SelectTrigger>
              <SelectContent>
                {availableStudents.map((student) => (
                  <SelectItem key={student.id} value={student.id}>
                    {student.lastName}, {student.firstName} ({student.studentNumber})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {!selectedStudentId && isOpen && <p className="text-sm text-muted-foreground">Please select a student.</p>}
            {availableStudents.length === 0 && (
              <p className="text-sm text-destructive mt-1">No available students to enroll. Register students first.</p>
            )}
          </div>
          <div className="pt-4 flex justify-end">
            <Button type="submit" disabled={isSubmitting || !selectedStudentId || availableStudents.length === 0}>
              {isSubmitting ? "Enrolling..." : "Enroll"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
