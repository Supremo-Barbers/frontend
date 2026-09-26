import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCourseStore } from "../stores/course.store";
import CategoryList from "../features/categories/components/CategoryList";
import AssessmentList from "../features/assessments/components/AssessmentList";
import StudentRoster from "../features/students/components/StudentRoster";
import CourseRoster from "../features/enrollments/components/CourseRoster";
import ScoreEntry from "../features/scores/components/ScoreEntry";
import Gradebook from "../features/grades/components/Gradebook";
import { Button } from "@/components/ui/button";
import { ArrowLeftIcon } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function CourseWorkspacePage(): React.JSX.Element {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();

  const courses = useCourseStore((state) => state.courses);
  const selectedCourse = useCourseStore((state) => state.selectedCourse);
  const setSelectedCourse = useCourseStore((state) => state.setSelectedCourse);
  const listCourses = useCourseStore((state) => state.listCourses);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initWorkspace = async () => {
      setIsLoading(true);
      let currentCourses = courses;
      if (currentCourses.length === 0) {
        currentCourses = await listCourses();
      }
      const found = currentCourses.find((c) => c.id === courseId);
      if (found) {
        setSelectedCourse(found);
      } else {
        setSelectedCourse(null);
      }
      setIsLoading(false);
    };

    void initWorkspace();
  }, [courseId, courses.length, listCourses, setSelectedCourse]);

  if (isLoading) {
    return <div className="p-8 text-center text-muted-foreground animate-pulse">Loading workspace...</div>;
  }

  if (!selectedCourse) {
    return (
      <div className="p-12 text-center">
        <h2 className="text-2xl font-bold text-destructive">Course Not Found</h2>
        <p className="text-muted-foreground mt-2 mb-6">The course you are looking for does not exist.</p>
        <Button onClick={() => navigate("/courses")}>Back to Courses</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col gap-4">
        <Button
          variant="ghost"
          size="sm"
          className="w-fit -ml-2 text-muted-foreground"
          onClick={() => navigate("/courses")}
        >
          <ArrowLeftIcon className="h-4 w-4 mr-1" />
          Back to Courses
        </Button>
        <div>
          <h2 className="text-3xl font-bold tracking-tight">{selectedCourse.code} Workspace</h2>
          <p className="text-lg text-muted-foreground mt-1">
            {selectedCourse.title} <span className="mx-2 opacity-50">•</span> Term: {selectedCourse.term}
          </p>
        </div>
      </div>

      <Tabs defaultValue="gradebook" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="gradebook">Gradebook</TabsTrigger>
          <TabsTrigger value="rubrics">Rubrics</TabsTrigger>
          <TabsTrigger value="assessments">Assessments</TabsTrigger>
          <TabsTrigger value="roster">Course Roster</TabsTrigger>
          <TabsTrigger value="students">Global Students</TabsTrigger>
        </TabsList>

        <TabsContent value="gradebook" className="space-y-6 outline-none">
          <ScoreEntry />
          <Gradebook />
        </TabsContent>

        <TabsContent value="rubrics" className="outline-none">
          <CategoryList />
        </TabsContent>

        <TabsContent value="assessments" className="space-y-6 outline-none">
          <ScoreEntry />
          <AssessmentList />
        </TabsContent>

        <TabsContent value="roster" className="outline-none">
          <CourseRoster />
        </TabsContent>

        <TabsContent value="students" className="outline-none">
          <StudentRoster />
        </TabsContent>
      </Tabs>
    </div>
  );
}
