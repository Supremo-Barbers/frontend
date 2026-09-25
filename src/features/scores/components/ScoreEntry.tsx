import React, { useEffect, useMemo } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useScores } from "../hooks/useScores";
import { useEnrollments } from "@/features/enrollments/hooks/useEnrollments";
import { useStudents } from "@/features/students/hooks/useStudents";
import type { RecordScoresRequest } from "@/schemas/score.schemas";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { XIcon } from "lucide-react";

export default function ScoreEntry(): React.JSX.Element {
  const {
    activeAssessment,
    setActiveAssessment,
    isLoading: isSubmittingScores,
    submitScores,
    error: submitError,
  } = useScores();
  const { enrollments } = useEnrollments();
  const { students } = useStudents();

  const enrolledStudents = useMemo(() => {
    return enrollments
      .map((e) => students.find((s) => s.id === e.studentId))
      .filter((s): s is NonNullable<typeof s> => s !== undefined)
      .sort((a, b) => a.lastName.localeCompare(b.lastName));
  }, [enrollments, students]);

  const maxScore = activeAssessment?.maxScore || 100;

  const ScoreFormSchema = useMemo(
    () =>
      z.object({
        scores: z.array(
          z.object({
            studentId: z.string(),
            scoreObtained: z
              .number()
              .min(0, "Score cannot be negative")
              .max(maxScore, `Score cannot exceed ${maxScore}`),
          }),
        ),
      }),
    [maxScore],
  );

  type ScoreFormValues = z.infer<typeof ScoreFormSchema>;

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ScoreFormValues>({
    resolver: zodResolver(ScoreFormSchema),
    defaultValues: {
      scores: [],
    },
  });

  const { fields } = useFieldArray({
    control,
    name: "scores",
  });

  useEffect(() => {
    if (activeAssessment) {
      reset({
        scores: enrolledStudents.map((s) => ({
          studentId: s.id,
          scoreObtained: undefined as unknown as number,
        })),
      });
    }
  }, [activeAssessment, enrolledStudents, reset]);

  if (!activeAssessment) {
    return <></>;
  }

  const handleFormSubmit = async (data: ScoreFormValues): Promise<void> => {
    try {
      await submitScores(data as RecordScoresRequest);
      setActiveAssessment(null);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Card className="shadow-lg border-primary/20">
      <CardHeader className="flex flex-row items-start justify-between bg-muted/20 pb-4">
        <div>
          <CardTitle className="text-xl flex items-center gap-2">Record Scores: {activeAssessment.title}</CardTitle>
          <CardDescription className="mt-1">Max Score: {activeAssessment.maxScore} pts</CardDescription>
        </div>
        <Button variant="ghost" size="icon" onClick={() => setActiveAssessment(null)}>
          <XIcon className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="pt-6">
        {submitError && (
          <div className="mb-4 p-3 rounded-md bg-destructive/15 text-destructive text-sm font-medium">
            {submitError}
          </div>
        )}

        {enrolledStudents.length === 0 ? (
          <div className="py-8 text-center text-muted-foreground border border-dashed rounded-md">
            No students are enrolled in this course to grade.
          </div>
        ) : (
          <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
            <div className="space-y-4">
              {fields.map((field, index) => {
                const student = enrolledStudents.find((s) => s.id === field.studentId);
                const errorMessage = errors.scores?.[index]?.scoreObtained?.message;
                return (
                  <div
                    key={field.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-3 border rounded-md"
                  >
                    <div className="flex-1">
                      <Label className="text-base font-medium">
                        {student?.lastName}, {student?.firstName}
                      </Label>
                      <div className="text-sm font-mono text-muted-foreground">{student?.studentNumber}</div>
                    </div>
                    <div className="w-full sm:w-32 flex flex-col gap-1">
                      <Input
                        type="number"
                        step="any"
                        placeholder={`/ ${activeAssessment.maxScore}`}
                        {...register(`scores.${index}.scoreObtained`, { valueAsNumber: true })}
                        className={errorMessage ? "border-destructive" : ""}
                      />
                      {errorMessage && <span className="text-xs text-destructive">{errorMessage}</span>}
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button type="button" variant="outline" onClick={() => setActiveAssessment(null)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmittingScores}>
                {isSubmittingScores ? "Saving..." : "Save Scores"}
              </Button>
            </div>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
