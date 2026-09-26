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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Trash2Icon, ArrowLeftIcon } from "lucide-react";
import EditCourseDialog from "../features/courses/components/EditCourseDialog";
import { useCourses } from "../features/courses/hooks/useCourses";
import { toast } from "sonner";

export default function CourseWorkspacePage(): React.JSX.Element {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();

  const courses = useCourseStore((state) => state.courses);
  const selectedCourse = useCourseStore((state) => state.selectedCourse);
  const setSelectedCourse = useCourseStore((state) => state.setSelectedCourse);
  const listCourses = useCourseStore((state) => state.listCourses);

  const [isLoading, setIsLoading] = useState(true);

  const { updateCourse, deleteCourse } = useCourses();

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

  const handleDeleteCourse = async (id: string) => {
    try {
      await deleteCourse(id);
      toast.success("Course deleted successfully");
      navigate("/courses");
    } catch (error) {
      toast.error("Failed to delete course");
      console.error(error);
    }
  };

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
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <Button
            variant="ghost"
            size="sm"
            className="w-fit -ml-2 mb-2 text-muted-foreground"
            onClick={() => navigate("/courses")}
          >
            <ArrowLeftIcon className="h-4 w-4 mr-1" />
            Back to Courses
          </Button>
          <h2 className="text-3xl font-bold tracking-tight">{selectedCourse.code} Workspace</h2>
          <p className="text-lg text-muted-foreground mt-1">
            {selectedCourse.title} <span className="mx-2 opacity-50">•</span> Term: {selectedCourse.term}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <EditCourseDialog course={selectedCourse} onSubmit={updateCourse} />
          <AlertDialog>
            <AlertDialogTrigger className="inline-flex items-center justify-center whitespace-nowrap rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90 h-8 px-3 text-xs">
              <Trash2Icon className="w-4 h-4 mr-2" />
              Delete Course
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete
                  <strong> {selectedCourse.code}</strong> and cascade delete all associated categories, assessments,
                  enrollments, and scores.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  onClick={() => handleDeleteCourse(selectedCourse.id)}
                >
                  Yes, delete course
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
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
