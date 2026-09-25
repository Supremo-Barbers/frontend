import React from "react";
import AppLayout from "./components/layout/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./components/ui/card";

export default function App(): React.JSX.Element {
  return (
    <AppLayout>
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center max-w-2xl mx-auto space-y-6">
        <Card className="w-full shadow-sm border-dashed">
          <CardHeader>
            <CardTitle className="text-2xl">Welcome to NU Grading System</CardTitle>
            <CardDescription>A unified professor portal for dynamic grading</CardDescription>
          </CardHeader>
          <CardContent className="text-muted-foreground">
            <p>
              Please select or create a course to begin configuring your rubric, enrolling students, and recording
              assessment scores.
            </p>
            <div className="mt-8 h-10 w-48 bg-muted rounded-md animate-pulse mx-auto" />
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
