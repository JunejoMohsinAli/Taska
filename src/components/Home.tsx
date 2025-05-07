import { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../utils/supabaseClient'
import { List, Trash2, Menu, ChevronDown, Flag } from 'lucide-react'
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
  Pending: 'bg-amber-400 text-white',
  Active:  'bg-lime-400 text-white',
  Closed:  'bg-red-500   text-white',
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
  const [] = useState<string | null>(null)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [openPriorityId, setOpenPriorityId] = useState<number | null>(null)
  const [openStatusId, setOpenStatusId] = useState<number | null>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()

  // Auth check
  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user }, error }) => {
      if (error || !user) navigate('/login')
      // else setUserEmail(user.email)
    })
  }, [navigate])

  // Close dropdown on outside click
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (!wrapperRef.current?.contains(e.target as Node)) {
        setOpenPriorityId(null)
        setOpenStatusId(null)
      }
    }
    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/login')
  }
  const handleCreateNew = () => navigate('/create')
  const toggleSidebar = () => setIsCollapsed(v => !v)

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className={`bg-white border-r p-6 flex flex-col transition-all duration-300 ${isCollapsed ? 'w-25' : 'w-64'}`}>
        <div className={`flex items-center mb-10 ${isCollapsed ? 'justify-center' : ''}`}>
          <img src={taskaLogo} alt="Taska" className="h-8 w-8" />
          {!isCollapsed && <span className="ml-2 font-bold text-xl">Taska</span>}
        </div>
        <nav>
          <button className={`flex items-center w-full p-2 rounded-lg mb-2 transition-colors ${isCollapsed ? 'justify-center' : 'bg-indigo-50 text-indigo-600'}`}>
            <List className="h-5 w-5" />
            {!isCollapsed && <span className="ml-2">Task</span>}
          </button>
        </nav>
      </aside>

      {/* Main */}
      <main ref={wrapperRef} className="flex-1 p-8 overflow-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="flex items-center text-2xl font-semibold">
            <button onClick={toggleSidebar} className="flex items-center mr-4 focus:outline-none">
              <Menu className="h-5 w-5 mr-2" />
            </button>
            Task
          </h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
          >
            Log Out
          </button>
        </div>

        <div className="pb-3">
          <button
            onClick={handleCreateNew}
            className="px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 transition"
          >
            Create New
          </button>
        </div>

        {/* Change overflow-hidden → overflow-visible */}
        <div className="bg-white rounded-lg shadow overflow-visible">
          <table className="min-w-full">
            <thead className="bg-gray-100">
              <tr>
                {['Name','Due Date','Assignee','Priority','Status','Actions'].map(h => (
                  <th key={h} className="px-6 py-3 text-left text-sm font-medium text-gray-600 uppercase">
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
                  <td className="px-6 py-4 whitespace-nowrap">{task.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{task.due}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{task.assignee}</td>

                  {/* Priority */}
                  <td
                    className="px-6 py-4 whitespace-nowrap relative dropdown"
                    onClick={e => e.stopPropagation()}
                  >
                    <button
                      onClick={e => {
                        e.stopPropagation()
                        setOpenPriorityId(openPriorityId === task.id ? null : task.id)
                      }}
                      className="flex items-center px-2 py-1 rounded focus:outline-none"
                    >
                      <Flag
                        className="h-4 w-4 mr-2 fill-current"
                        style={{
                          color:
                            task.priority === 'Low'    ? '#FBBF24'
                          : task.priority === 'Normal' ? '#10B981'
                                                         : '#EF4444'
                        }}
                      />
                      <span className="mr-1">{task.priority}</span>
                      <ChevronDown className="h-4 w-4" />
                    </button>
                    {openPriorityId === task.id && (
                      <div className="absolute z-50 mt-1 w-40 bg-white rounded-lg shadow-lg">
                        <div className="border-b border-gray-300 px-4 mx-4 font-medium text-gray-700">Priority</div>
                        <ul className="divide-y">
                          {(['Low','Normal','High'] as const).map(lvl => (
                            <li
                              key={lvl}
                              className="border-b border-gray-300 mx-4 flex items-center px-4 py-2 hover:bg-gray-50 cursor-pointer"
                              onClick={() => {
                                onUpdate({ ...task, priority: lvl })
                                setOpenPriorityId(null)
                              }}
                            >
                              <Flag
                                className="h-4 w-4 mr-2 fill-current"
                                style={{
                                  color:
                                    lvl === 'Low'    ? '#FBBF24'
                                  : lvl === 'Normal' ? '#10B981'
                                                      : '#EF4444'
                                }}
                              />
                              {lvl}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </td>

                  {/* Status */}
                  <td
                    className="px-6 py-4 whitespace-nowrap relative dropdown"
                    onClick={e => e.stopPropagation()}
                  >
                    <button
                      onClick={e => {
                        e.stopPropagation()
                        setOpenStatusId(openStatusId === task.id ? null : task.id)
                      }}
                      className={`flex items-center px-2 py-1 rounded focus:outline-none ${statusClasses[task.status]}`}
                    >
                      <span className="mr-1">{task.status}</span>
                    </button>
                    {openStatusId === task.id && (
                      <div className="absolute z-50 mt-1 w-40 bg-white rounded-lg shadow-lg">
                        <div className="border-b border-gray-300 px-4 mx-4 font-medium text-gray-700">Status</div>
                        <ul className="divide-y">
                          {(['Pending','Active','Closed'] as const).map(st => (
                            <li
                              key={st}
                              className="border-b border-gray-300 mx-4 flex items-center px-4 py-2 hover:bg-gray-50 cursor-pointer"
                              onClick={() => {
                                onUpdate({ ...task, status: st })
                                setOpenStatusId(null)
                              }}
                            >
                              <span
                                className="w-3 h-3 rounded-full mr-2 block"
                                style={{
                                  backgroundColor:
                                    st === 'Pending' ? '#FBBF24'
                                  : st === 'Active'  ? '#10B981'
                                                      : '#EF4444'
                                }}
                              />
                              {st}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4 whitespace-nowrap" onClick={e => e.stopPropagation()}>
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
