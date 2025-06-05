import { useEffect, useState, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../utils/supabaseClient'
import { Trash2, Menu, X, ChevronDown, Flag } from 'lucide-react'
import taskaLogo from '../assets/taska.svg'
import taskaBook from '../assets/book.png'
import TaskDetailsModal from './TaskDetailsModal'
import { toast } from 'react-toastify';

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

// Home.tsx (or wherever this table lives)

function formatToDDMonYYYY(isoDate: string): string {
  // e.g. isoDate = "2024-01-20" or "2024-01-20T00:00:00.000Z"
  const d = new Date(isoDate);
  // We want: "dd Mon yyyy", e.g. "20 Jan 2024"
  // toLocaleDateString with en-GB and short‐month does that:
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

const statusClasses: Record<Task['status'], string> = {
  Pending: 'bg-[#FFB72A] text-white',
  Active:  'bg-[#74D453] text-white',
  Closed:  'bg-[#F25353] text-white',
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
  const location = useLocation();

  // Auth guard
  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user }, error }) => {
      if (error || !user) navigate('/login')
    })
  }, [navigate])

  // Show login-success toast if coming from login
useEffect(() => {
  if (location.state?.fromLogin) {
    toast.success('Login successful!');

    navigate('/', { state: { fromLogin: true } });
    // clear the flag so it doesn’t fire again on refresh
    window.history.replaceState({}, '');
  }
}, [location.state]);


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
              ${isCollapsed ? 'justify-center' : 'bg-indigo-50'}
            `}>
            <img src={taskaBook} alt="Taska" className="h-5 w-5" />
            {!isCollapsed && <span className="ml-2">Task</span>}
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
                className="flex items-center w-full p-2 rounded-lg mb-2 bg-indigo-50"
              >
                <img src={taskaBook} alt="Taska" className="h-5 w-5" />
                <span className="ml-2">Task</span>
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
        <header className="flex items-center justify-between p-4 md:p-8 bg-white">
          <div className="flex items-center">
              <Menu className="h-6 w-6 mt-1 relative"/>
            <h1 className="text-2xl ml-1 font-semibold">Tasks</h1>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 transition"
          >
            Log Out
          </button>
        </header>

        {/* Action bar */}
        <div className="p-4 md:p-8 flex justify-end">
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
              <thead className="justify-between items-center p-4 border-b border-gray-200 mx-6">
                <tr>
                  {['Name','Due Date','Assignee','Priority','Status','Actions'].map(h => (
                    <th
                      key={h}
                      className="px-6 py-3 text-left text-sm font-medium text-gray-600"
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
                    className="justify-between items-center p-4 border-b border-gray-200 mx-6 hover:bg-gray-50 cursor-pointer"
                    onClick={() => setSelectedTask(task)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
  <div className="flex justify-between items-center">
    {/* Left: Task name */}
    <span className="text-indigo-600 font-semibold">
      {task.name}
    </span>
</div>
</td>
                    <td className="px-6 py-4 whitespace-nowrap">
  <div className="flex justify-between items-center">
    {/* Right: Formatted due date */}
    <span className="text-sm font-semibold whitespace-nowrap">
      {formatToDDMonYYYY(task.due)}
    </span>
  </div>
</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold">{task.assignee}</td>

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
                              task.priority === 'Low'    ? '#FFB72A'
                            : task.priority === 'Normal' ? '#75D653'
                                                          : '#F25353'
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
                                      lvl === 'Low'    ? '#FFB72A'
                                    : lvl === 'Normal' ? '#75D653'
                                                        : '#F25353'
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
                                      st === 'Pending' ? '#FFB72A'
                                    : st === 'Active'  ? '#74D453'
                                                        : '#F25353'
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
