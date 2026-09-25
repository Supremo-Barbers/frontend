import axios from 'axios';
import { useBackendEngineStore } from '../stores/backend-engine.store';

const JAVA_BASE_URL = 'http://localhost:8080/api';
const PYTHON_BASE_URL = 'http://localhost:8000/api';

const getBaseUrl = () => {
  const engine = useBackendEngineStore.getState().engine;
  return engine === 'JAVA' ? JAVA_BASE_URL : PYTHON_BASE_URL;
};

export const apiClient = axios.create();

// Interceptor to dynamically set the base URL before each request
apiClient.interceptors.request.use((config) => {
  config.baseURL = getBaseUrl();
  return config;
});
