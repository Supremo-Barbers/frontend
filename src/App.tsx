import { useState } from 'react';
import { Button } from './components/ui/button';
import { useBackendEngineStore } from './stores/backend-engine.store';
import { apiClient } from './api/client';
import { ErrorResponseSchema } from './schemas/error.schemas';

function App() {
  const { engine, setEngine } = useBackendEngineStore();
  const [status, setStatus] = useState<string>('Not tested');

  const testSchema = () => {
    try {
      const data = ErrorResponseSchema.parse({
        error: "Not Found",
        message: "Course not found",
        path: "/api/courses/1",
        status: 404,
        timestamp: new Date().toISOString(),
      });
      setStatus(`Schema test passed: ${data.status}`);
    } catch (e) {
      setStatus(`Schema test failed: ${e}`);
    }
  };

  const testClient = async () => {
    try {
      // Just a dummy request to show apiClient is configured
      await apiClient.get('/nonexistent');
    } catch (e: any) {
      setStatus(`API Error (expected): ${e.message} - URL: ${e.config?.baseURL}`);
    }
  }

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8 text-left">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">NU Grading System</h1>
        <p className="text-muted-foreground mt-2">Frontend Bootstrap Verification</p>
      </div>
      
      <div className="space-y-4 border p-6 rounded-lg">
        <h2 className="text-xl font-semibold">Zustand Store (Backend Engine)</h2>
        <div className="flex items-center space-x-4">
          <p>Current Engine: <span className="font-mono font-bold text-primary">{engine}</span></p>
          <Button 
            variant="outline" 
            onClick={() => setEngine(engine === 'JAVA' ? 'PYTHON' : 'JAVA')}
          >
            Toggle Engine
          </Button>
        </div>
      </div>

      <div className="space-y-4 border p-6 rounded-lg">
        <h2 className="text-xl font-semibold">Zod Schema</h2>
        <Button onClick={testSchema}>Test ErrorResponseSchema</Button>
      </div>

      <div className="space-y-4 border p-6 rounded-lg">
        <h2 className="text-xl font-semibold">Axios Client</h2>
        <Button onClick={testClient}>Test API Request</Button>
      </div>

      <div className="mt-8 p-4 bg-muted rounded-md font-mono text-sm">
        Status: {status}
      </div>
    </div>
  );
}

export default App;
