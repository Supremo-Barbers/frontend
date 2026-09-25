import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Student, RegisterStudentRequest } from "@/schemas/student.schemas";
import { RegisterStudentRequestSchema } from "@/schemas/student.schemas";
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

interface RegisterStudentDialogProps {
  onSubmit: (data: RegisterStudentRequest) => Promise<Student>;
}

export default function RegisterStudentDialog({ onSubmit }: RegisterStudentDialogProps): React.JSX.Element {
  const [isOpen, setIsOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<RegisterStudentRequest>({
    resolver: zodResolver(RegisterStudentRequestSchema),
    defaultValues: {
      studentNumber: "",
      firstName: "",
      lastName: "",
      email: "",
    },
  });

  const handleFormSubmit = async (data: RegisterStudentRequest): Promise<void> => {
    try {
      await onSubmit(data);
      toast.success("Student registered successfully");
      setIsOpen(false);
      reset();
    } catch (error) {
      toast.error("Failed to register student");
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
      <DialogTrigger className={buttonVariants({ variant: "default" })}>Register Student</DialogTrigger>
      <DialogContent className="sm:max-w-106.25">
        <DialogHeader>
          <DialogTitle>Register New Student</DialogTitle>
          <DialogDescription>
            Add a student to the system. Once registered, they can be enrolled in courses.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="studentNumber">Student Number</Label>
            <Input id="studentNumber" placeholder="e.g. 2026-12345" {...register("studentNumber")} />
            {errors.studentNumber && <p className="text-sm text-destructive">{errors.studentNumber.message}</p>}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input id="firstName" placeholder="e.g. Jane" {...register("firstName")} />
              {errors.firstName && <p className="text-sm text-destructive">{errors.firstName.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input id="lastName" placeholder="e.g. Doe" {...register("lastName")} />
              {errors.lastName && <p className="text-sm text-destructive">{errors.lastName.message}</p>}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="e.g. jane.doe@university.edu" {...register("email")} />
            {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
          </div>
          <div className="pt-4 flex justify-end">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Registering..." : "Register"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
