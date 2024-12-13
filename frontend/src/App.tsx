import { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

interface Todo {
  id: number;
  text: string;
  completed: boolean;
  createdAt: string;
}

interface HealthStatus {
  status: string;
  message: string;
  timestamp: string;
  uptime: number;
}

const API_URL = import.meta.env.VITE_API_URL;
function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState<string>("");
  const [backendHealth, setBackendHealth] = useState<HealthStatus | null>(null);
  const [backendError, setBackendError] = useState<string>("");

  const checkBackendHealth = async () => {
    try {
      const response = await axios.get(`${API_URL}/health`);
      setBackendHealth(response.data);
      setBackendError("");
    } catch (error) {
      console.error("Error checking backend health:", error);
      setBackendHealth(null);
      setBackendError("Backend bağlantısı kurulamadı");
    }
  };

  const fetchTodos = async () => {
    try {
      const response = await axios.get(`${API_URL}/todos`);
      if (Array.isArray(response.data)) {
        setTodos(response.data);
      } else {
        console.error("Unexpected response:", response.data);
        setTodos([]);
      }
    } catch (error) {
      console.error("Error fetching todos:", error);
      setTodos([]);
    }
  };

  const addTodo = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!newTodo.trim()) return;

    try {
      const response = await axios.post(`${API_URL}/todos`, { text: newTodo });
      setTodos((prevTodos) => [...prevTodos, response.data]);
      setNewTodo("");
    } catch (error) {
      console.error("Error adding todo:", error);
    }
  };

  const deleteTodo = async (id: number) => {
    try {
      await axios.delete(`${API_URL}/todos/${id}`);
      setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  };

  useEffect(() => {
    checkBackendHealth();
    fetchTodos();

    const healthCheckInterval = setInterval(checkBackendHealth, 30000);
    return () => clearInterval(healthCheckInterval);
  }, []);

  return (
    <div className="container max-w-2xl px-4 py-8 mx-auto">
      <div className="p-6 bg-white rounded-lg shadow-lg">
        <div className="mb-6">
          {backendHealth ? (
            <div className="text-sm text-green-600">
              Backend Status: {backendHealth.status} ({backendHealth.message})
            </div>
          ) : backendError ? (
            <div className="text-sm text-red-600">{backendError}</div>
          ) : null}
        </div>

        <h1 className="mb-8 text-3xl font-bold text-center">Todo Uygulaması</h1>

        <form onSubmit={addTodo} className="mb-8">
          <div className="flex gap-2">
            <input
              type="text"
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              placeholder="Yeni todo ekle..."
              className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
            />
            <button
              type="submit"
              className="px-6 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none"
            >
              Ekle
            </button>
          </div>
        </form>

        <div className="space-y-4">
          {todos.length > 0 ? (
            todos.map((todo) => (
              <div
                key={todo.id}
                className="flex items-center justify-between p-4 rounded-lg bg-gray-50"
              >
                <span>{todo.text}</span>
                <button
                  onClick={() => deleteTodo(todo.id)}
                  className="px-3 py-1 text-sm text-red-600 hover:text-red-800 focus:outline-none"
                >
                  Sil
                </button>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-500">Henüz bir todo yok</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
