import React from "react";
import type { Course } from "@/schemas/course.schemas";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface CourseCardProps {
  course: Course;
  isSelected: boolean;
  onSelect: (courseId: string) => void;
}

export default function CourseCard({ course, isSelected, onSelect }: CourseCardProps): React.JSX.Element {
  return (
    <Card className={`transition-all ${isSelected ? "ring-2 ring-primary" : "hover:bg-muted/50"}`}>
      <CardHeader>
        <CardTitle className="text-xl">{course.code}</CardTitle>
        <CardDescription>{course.title}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          <p className="text-sm text-muted-foreground">Term: {course.term}</p>
          <Button variant={isSelected ? "secondary" : "default"} onClick={() => onSelect(course.id)} className="w-full">
            {isSelected ? "Selected" : "Select Course"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
