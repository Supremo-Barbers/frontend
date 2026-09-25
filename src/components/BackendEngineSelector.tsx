import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useBackendEngineStore, type BackendEngine } from "@/stores/backend-engine.store";
import { toast } from "sonner";

export default function BackendEngineSelector(): React.JSX.Element {
  const { engine, setEngine } = useBackendEngineStore();

  const handleEngineChange = (value: string | null): void => {
    if (value) {
      setEngine(value as BackendEngine);
      toast.info(`Switched grading engine to ${value}`);
    }
  };

  return (
    <Select value={engine} onValueChange={handleEngineChange}>
      <SelectTrigger className="w-45 bg-background">
        <SelectValue placeholder="Select Engine" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="JAVA">Java / OOP</SelectItem>
        <SelectItem value="PYTHON">Python / FP</SelectItem>
      </SelectContent>
    </Select>
  );
}
