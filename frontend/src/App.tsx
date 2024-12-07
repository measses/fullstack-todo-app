import { useState, useEffect } from 'react'
import axios from 'axios'
import './App.css'

interface Todo {
  id: number
  text: string
  completed: boolean
  createdAt: string
}

interface HealthStatus {
  status: string
  timestamp: string
  uptime: number
  message: string
}

const API_URL = 'http://localhost:5001'

function App() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [newTodo, setNewTodo] = useState('')
  const [backendHealth, setBackendHealth] = useState<HealthStatus | null>(null)
  const [backendError, setBackendError] = useState('')

  const checkBackendHealth = async () => {
    try {
      const response = await axios.get(`${API_URL}/health`)
      setBackendHealth(response.data)
      setBackendError('')
    } catch (error) {
      setBackendHealth(null)
      setBackendError('Backend bağlantısı kurulamadı')
      console.error('Error checking backend health:', error)
    }
  }

  const fetchTodos = async () => {
    try {
      const response = await axios.get(`${API_URL}/todos`)
      setTodos(response.data)
    } catch (error) {
      console.error('Error fetching todos:', error)
    }
  }

  const addTodo = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!newTodo.trim()) return

    try {
      const response = await axios.post(`${API_URL}/todos`, { text: newTodo })
      setTodos(response.data)
      setNewTodo('')
    } catch (error) {
      console.error('Error adding todo:', error)
    }
  }

  const deleteTodo = async (id: number) => {
    try {
      const response = await axios.delete(`${API_URL}/todos/${id}`)
      setTodos(response.data)
    } catch (error) {
      console.error('Error deleting todo:', error)
    }
  }

  useEffect(() => {
    checkBackendHealth()
    fetchTodos()

    const healthCheckInterval = setInterval(checkBackendHealth, 30000)
    return () => clearInterval(healthCheckInterval)
  }, [])

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="bg-white rounded-lg shadow-lg p-6">
        {/* Backend Status */}
        <div className="mb-6">
          {backendHealth ? (
            <div className="text-sm text-green-600">
              Backend Status: {backendHealth.status} ({backendHealth.message})
            </div>
          ) : backendError ? (
            <div className="text-sm text-red-600">
              {backendError}
            </div>
          ) : null}
        </div>

        <h1 className="text-3xl font-bold text-center mb-8">Todo Uygulaması</h1>

        {/* Add Todo Form */}
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
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none"
            >
              Ekle
            </button>
          </div>
        </form>

        {/* Todo List */}
        <div className="space-y-4">
          {todos.map((todo) => (
            <div
              key={todo.id}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
            >
              <span>{todo.text}</span>
              <button
                onClick={() => deleteTodo(todo.id)}
                className="px-3 py-1 text-sm text-red-600 hover:text-red-800 focus:outline-none"
              >
                Sil
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default App
