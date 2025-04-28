import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../utils/supabaseClient'
import { List, Trash2, Menu } from 'lucide-react'
import taskaLogo from '../assets/taska.svg'
import TaskDetailsModal from './TaskDetailsModal'

export type Task = {
  id: number
  name: string
  due: string
  assignee: string
  assigned: string
  priority: 'Low' | 'Normal' | 'High'
  status: 'Pending' | 'Active' | 'Closed'
  description?: string
}

const statusClasses: Record<Task['status'], string> = {
  Pending: 'bg-yellow-100 text-yellow-800',
  Active:  'bg-green-100  text-green-800',
  Closed:  'bg-red-100    text-red-800',
}

interface HomeProps {
  tasks: Task[]
  onUpdate(task: Task): void
  onDelete(id: number): void
}

export default function Home({
  tasks,
  onUpdate,
  onDelete,
}: HomeProps) {
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const navigate = useNavigate()

  // Redirect if unauthenticated
  useEffect(() => {
    async function check() {
      const { data: { user }, error } = await supabase.auth.getUser()
      if (error || !user) return navigate('/login')
      setUserEmail(user.email ?? null)
    }
    check()
  }, [navigate])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/login')
  }

  const handleCreateNew = () => {
    navigate('/create')
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r p-6 flex flex-col">
        <div className="flex items-center mb-10">
          <img src={taskaLogo} alt="Taska" className="h-8 w-8" />
          <span className="ml-2 font-bold text-xl">Taska</span>
        </div>
        <nav>
          <button className="flex items-center w-full p-2 rounded-lg bg-indigo-50 text-indigo-600 mb-2">
            <List className="h-5 w-5" />
            <span className="ml-2">Task</span>
          </button>
        </nav>
      </aside>

      {/* Main */}
      <main className="flex-1 p-8 overflow-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="flex items-center text-2xl font-semibold">
            <Menu className="h-5 w-5 mr-2" />
            Task
            </h1>
          <div className="flex items-center space-x-4">
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
            >
              Log Out
            </button>
            <button
              onClick={handleCreateNew}
              className="px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 transition"
            >
              Create New
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full">
            <thead className="bg-gray-100">
              <tr>
                {['Name', 'Due Date', 'Assignee', 'Priority', 'Status', 'Actions'].map(h => (
                  <th
                    key={h}
                    className="px-6 py-3 text-left text-sm font-medium text-gray-600 uppercase tracking-wider"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tasks.map(task => (
                <tr
                  key={task.id}
                  className="border-b last:border-none cursor-pointer"
                  onClick={() => setSelectedTask(task)}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    {task.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{task.due}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{task.assignee}</td>
                  <td
                    className="px-6 py-4 whitespace-nowrap"
                    onClick={e => e.stopPropagation()}
                  >
                    <select
                      className="px-2 py-1 border rounded"
                      value={task.priority}
                      onChange={e =>
                        onUpdate({ ...task, priority: e.target.value as Task['priority'] })
                      }
                    >
                      <option value="Low">Low</option>
                      <option value="Normal">Normal</option>
                      <option value="High">High</option>
                    </select>
                  </td>
                  <td
                    className="px-6 py-4 whitespace-nowrap"
                    onClick={e => e.stopPropagation()}
                  >
                    <select
                      className={`${statusClasses[task.status]} px-2 py-1 rounded`}
                      value={task.status}
                      onChange={e =>
                        onUpdate({ ...task, status: e.target.value as Task['status'] })
                      }
                    >
                      <option value="Pending">Pending</option>
                      <option value="Active">Active</option>
                      <option value="Closed">Closed</option>
                    </select>
                  </td>
                  <td
                    className="px-6 py-4 whitespace-nowrap"
                    onClick={e => e.stopPropagation()}
                  >
                    <Trash2
                      className="h-5 w-5 text-red-500 cursor-pointer"
                      onClick={() => onDelete(task.id)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {selectedTask && (
          <TaskDetailsModal
            task={selectedTask}
            onClose={() => setSelectedTask(null)}
            onDelete={id => { onDelete(id); setSelectedTask(null) }}
          />
        )}
      </main>
    </div>
  )
}
