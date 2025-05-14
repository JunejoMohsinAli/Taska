import './App.css'
import Login from './components/Login'
import Signup from './components/Signup'
import Home, { Task } from './components/Home'
import CreateTaskForm from './components/CreateTaskForm' 
import { Routes, Route } from 'react-router-dom'
import PrivateRoute from './routes/PrivateRoute'
import { useState } from 'react'
import NotFound from './components/404';
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Confirm from './components/Confirm'

function App() {
  const [tasks, setTasks] = useState<Task[]>([])

  const updateTask = (updated: Task) =>
    setTasks(ts => ts.map(t => t.id === updated.id ? updated : t))

  const deleteTask = (id: number) =>
    setTasks(ts => ts.filter(t => t.id !== id))

  const addTask = (newTask: Task) =>
    setTasks(ts => [...ts, newTask])

  return (
    <>

<ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <Routes>
        <Route path="/login"  element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route
          path="/"
          element={
            <PrivateRoute>
              <Home
                tasks={tasks}
                onUpdate={updateTask}
                onDelete={deleteTask}
              />
            </PrivateRoute>
          }
        />

        <Route
          path="/create"
          element={
            <PrivateRoute>
              <CreateTaskForm onSubmit={addTask} />
            </PrivateRoute>
          }
        />

        <Route path="*" element={<NotFound />} />
        <Route path="/confirm" element={<Confirm />} />
      </Routes>
    </>
  )
}

export default App
