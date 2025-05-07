import { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../utils/supabaseClient'
import { List, Trash2, Menu, X, ChevronDown, Flag } from 'lucide-react'
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
  Closed:  'bg-red-500 text-white',
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
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [openPriorityId, setOpenPriorityId] = useState<number | null>(null)
  const [openStatusId, setOpenStatusId] = useState<number | null>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()

  // Auth guard
  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user }, error }) => {
      if (error || !user) navigate('/login')
    })
  }, [navigate])

  // Close dropdowns on outside click
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

  const toggleDesktopCollapse = () => {
    setIsCollapsed(v => !v)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/login')
  }
  const handleCreateNew = () => navigate('/create')

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* ==== SIDEBAR ==== */}
      {/* Desktop Sidebar */}
      <aside
        className={`
          hidden md:flex flex-col bg-white border-r p-6
          transition-all duration-300
          ${isCollapsed ? 'w-20' : 'w-64'}
        `}
      >
        <div className={`flex items-center mb-10 ${isCollapsed && 'justify-center'}`}>
          <img src={taskaLogo} alt="Taska" className="h-8 w-8" />
          {!isCollapsed && <span className="ml-2 font-bold text-xl">Taska</span>}
        </div>
        <nav className="flex-1">
          <button
            className={`
              flex items-center w-full p-2 rounded-lg mb-2 transition-colors
              ${isCollapsed ? 'justify-center' : 'bg-indigo-50 text-indigo-600'}
            `}
          >
            <List className="h-5 w-5" />
            {!isCollapsed && <span className="ml-2">Tasks</span>}
          </button>
        </nav>
        <button
          onClick={toggleDesktopCollapse}
          className="mt-auto text-gray-500 hover:text-gray-700 transition"
        >
          {isCollapsed ? '→' : '←'}
        </button>
      </aside>

      {/* Mobile Sidebar (Drawer) */}
      {isSidebarOpen && (
        <aside className="fixed inset-0 z-50 flex md:hidden">
          <div className="w-64 bg-white p-6 border-r shadow-xl">
            <div className="flex justify-between items-center mb-10">
              <img src={taskaLogo} alt="Taska" className="h-8 w-8" />
              <button onClick={() => setIsSidebarOpen(false)}>
                <X className="h-6 w-6" />
              </button>
            </div>
            <nav>
              <button
                className="flex items-center w-full p-2 rounded-lg mb-2 bg-indigo-50 text-indigo-600"
              >
                <List className="h-5 w-5" />
                <span className="ml-2">Tasks</span>
              </button>
            </nav>
          </div>
          <div
            className="flex-1 bg-black opacity-40"
            onClick={() => setIsSidebarOpen(false)}
          />
        </aside>
      )}

      {/* ==== MAIN CONTENT ==== */}
      <main
        ref={wrapperRef}
        className="flex-1 flex flex-col overflow-auto"
      >
        {/* Top bar */}
        <header className="flex items-center justify-between p-4 md:p-8 bg-white border-b">
          <div className="flex items-center">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="md:hidden mr-4 focus:outline-none"
            >
              <Menu className="h-6 w-6" />
            </button>
            <h1 className="text-2xl font-semibold">Tasks</h1>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
          >
            Log Out
          </button>
        </header>

        {/* Action bar */}
        <div className="p-4 md:p-8">
          <button
            onClick={handleCreateNew}
            className="px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 transition"
          >
            Create New
          </button>
        </div>

        {/* Table */}
        <div className="flex-1 p-4 md:p-8 overflow-x-auto">
          <div className="bg-white rounded-lg shadow overflow-visible">
            <table className="min-w-full">
              <thead className="bg-gray-100">
                <tr>
                  {['Name','Due Date','Assignee','Priority','Status','Actions'].map(h => (
                    <th
                      key={h}
                      className="px-6 py-3 text-left text-sm font-medium text-gray-600 uppercase"
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
                    className="border-b last:border-none hover:bg-gray-50 cursor-pointer"
                    onClick={() => setSelectedTask(task)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">{task.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{task.due}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{task.assignee}</td>

                    {/* Priority */}
                    <td
                      className="px-6 py-4 whitespace-nowrap relative"
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
                          <div className="mx-4 border-b border-gray-300 px-4 py-2 font-medium text-gray-700">Priority</div>
                          <ul className="divide-y">
                            {(['Low','Normal','High'] as const).map(lvl => (
                              <li
                                key={lvl}
                                className="mx-4 border-b border-gray-300 flex items-center px-4 py-2 hover:bg-gray-50 cursor-pointer"
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
                      className="px-6 py-4 whitespace-nowrap relative"
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
                          <div className="mx-4 border-b border-gray-300 px-4 py-2 font-medium text-gray-700">Status</div>
                          <ul className="divide-y">
                            {(['Pending','Active','Closed'] as const).map(st => (
                              <li
                                key={st}
                                className="mx-4 border-b border-gray-300 flex items-center px-4 py-2 hover:bg-gray-50 cursor-pointer"
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
        </div>

        {selectedTask && (
          <TaskDetailsModal
            task={selectedTask}
            onClose={() => setSelectedTask(null)}
            onDelete={id => {
              onDelete(id)
              setSelectedTask(null)
            }}
          />
        )}
      </main>
    </div>
  )
}
