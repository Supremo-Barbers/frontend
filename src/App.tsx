import React from "react";
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import AppLayout from "./components/layout/AppLayout";
import CoursesPage from "./pages/CoursesPage";
import CourseWorkspacePage from "./pages/CourseWorkspacePage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      { index: true, element: <Navigate to="/courses" replace /> },
      { path: "courses", element: <CoursesPage /> },
      { path: "courses/:courseId", element: <CourseWorkspacePage /> },
    ],
  },
]);

export default function App(): React.JSX.Element {
  return <RouterProvider router={router} />;
}
