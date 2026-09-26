import React, { useState } from "react";
import type { Enrollment, EnrollStudentRequest } from "@/schemas/enrollment.schemas";
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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
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
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleEnroll = async (): Promise<void> => {
    if (selectedStudentIds.length === 0) return;

    setIsSubmitting(true);
    try {
      await Promise.all(selectedStudentIds.map((id) => onSubmit({ studentId: id })));
      toast.success(`Successfully enrolled ${selectedStudentIds.length} student(s)`);
      setIsOpen(false);
      setSelectedStudentIds([]);
    } catch (error) {
      toast.error("Failed to enroll students");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenChange = (open: boolean): void => {
    setIsOpen(open);
    if (!open) {
      setSelectedStudentIds([]);
    }
  };

  const toggleStudent = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedStudentIds([...selectedStudentIds, id]);
    } else {
      setSelectedStudentIds(selectedStudentIds.filter((sId) => sId !== id));
    }
  };

  const toggleAll = (checked: boolean) => {
    if (checked) {
      setSelectedStudentIds(availableStudents.map((s) => s.id));
    } else {
      setSelectedStudentIds([]);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger className={buttonVariants({ variant: "default" })}>Enroll Students</DialogTrigger>
      <DialogContent className="sm:max-w-2xl max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Enroll Students</DialogTitle>
          <DialogDescription>Select globally registered students to enroll in this course.</DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto pr-2 py-4">
          {availableStudents.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground border border-dashed rounded-md">
              No available students to enroll. Please register more students globally.
            </div>
          ) : (
            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12 px-4">
                      <Checkbox
                        checked={selectedStudentIds.length === availableStudents.length && availableStudents.length > 0}
                        onCheckedChange={(c) => toggleAll(c as boolean)}
                      />
                    </TableHead>
                    <TableHead>Student Name</TableHead>
                    <TableHead>Student No.</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {availableStudents.map((student) => (
                    <TableRow key={student.id}>
                      <TableCell className="px-4">
                        <Checkbox
                          checked={selectedStudentIds.includes(student.id)}
                          onCheckedChange={(c) => toggleStudent(student.id, c as boolean)}
                        />
                      </TableCell>
                      <TableCell className="font-medium">
                        {student.lastName}, {student.firstName}
                      </TableCell>
                      <TableCell className="font-mono">{student.studentNumber}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t mt-auto">
          <Button variant="outline" onClick={() => handleOpenChange(false)} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button onClick={handleEnroll} disabled={isSubmitting || selectedStudentIds.length === 0}>
            {isSubmitting ? "Enrolling..." : `Enroll Selected (${selectedStudentIds.length})`}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
