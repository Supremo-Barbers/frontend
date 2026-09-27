import React from "react";
import type { Course } from "@/schemas/course.schemas";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useEnrollmentStore } from "@/stores/enrollment.store";
import { useCategoryStore } from "@/stores/category.store";
import { useAssessmentStore } from "@/stores/assessment.store";
import { UsersIcon, FileTextIcon } from "lucide-react";

interface CourseCardProps {
  course: Course;
  isSelected: boolean;
  onSelect: (courseId: string) => void;
}

export default function CourseCard({ course, isSelected, onSelect }: CourseCardProps): React.JSX.Element {
  const enrollmentCount = useEnrollmentStore((state) => 
    state.enrollments.filter((e) => e.courseId === course.id).length
  );
  
  const globalCategories = useCategoryStore((state) => state.categories);
  const categories = globalCategories.filter(c => c.courseId === course.id);
  const categoryIds = categories.map(c => c.id);
  
  const globalAssessments = useAssessmentStore((state) => state.assessments);
  const assessmentCount = globalAssessments.filter((a) => categoryIds.includes(a.categoryId)).length;

  return (
    <Card className={`transition-all ${isSelected ? "ring-2 ring-primary border-primary" : "hover:border-primary/50"}`}>
      <CardHeader>
        <CardTitle className="text-xl">{course.code}</CardTitle>
        <CardDescription className="line-clamp-1" title={course.title}>{course.title}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <p className="text-sm font-medium">Term: <span className="font-normal text-muted-foreground">{course.term}</span></p>
            
            <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
              <div className="flex items-center gap-1.5" title={`${enrollmentCount} student(s) enrolled`}>
                <UsersIcon className="w-4 h-4" />
                <span>{enrollmentCount}</span>
              </div>
              <div className="flex items-center gap-1.5" title={`${assessmentCount} assessment(s) created`}>
                <FileTextIcon className="w-4 h-4" />
                <span>{assessmentCount}</span>
              </div>
            </div>
          </div>
          
          <Button variant={isSelected ? "secondary" : "default"} onClick={() => onSelect(course.id)} className="w-full mt-2">
            {isSelected ? "Selected" : "Select Course"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
