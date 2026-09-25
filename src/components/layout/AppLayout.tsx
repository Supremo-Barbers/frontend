import React from "react";
import BackendEngineSelector from "../BackendEngineSelector";
import { Toaster } from "@/components/ui/sonner";

type AppLayoutProps = {
  children: React.ReactNode;
};

export default function AppLayout({ children }: AppLayoutProps): React.JSX.Element {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-8">
          <div className="flex items-center gap-4">
            <span className="font-bold text-xl tracking-tight text-primary">NU Grading System</span>
          </div>

          <div className="flex items-center gap-4">
            <BackendEngineSelector />
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 sm:px-8 py-8 flex flex-col gap-8">{children}</main>

      <footer className="border-t py-6 mt-auto">
        <div className="container mx-auto px-4 sm:px-8 flex flex-col md:flex-row items-center justify-between text-sm text-muted-foreground gap-4">
          <p>© {new Date().getFullYear()} NU Grading System</p>
          <p>Professor Workflow Portal</p>
        </div>
      </footer>
      <Toaster />
    </div>
  );
}
