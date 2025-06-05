import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { Menu, X, ChevronDown, Flag } from 'lucide-react'
import taskaLogo from '../assets/taska.svg'
import taskaBook from '../assets/book.png'

import { supabase } from '../utils/supabaseClient'
import { useState, useRef, useEffect } from 'react'

type Task = {
  id: number
  name: string
  due: string
  assignee: string
  assigned: string
  priority: 'Low' | 'Normal' | 'High'
  status: 'Pending' | 'Active' | 'Closed'
  description: string
}

type Props = {
  onSubmit(task: Task): void
}

type FormValues = {
  name: string
  due: string
  assignee: string
  assigned: string
  priority: 'Low' | 'Normal' | 'High'
  status: 'Pending' | 'Active' | 'Closed'
  description: string
}

export default function CreateTaskForm({ onSubmit }: Props) {
  const navigate = useNavigate()
  const { register, handleSubmit, watch, setValue } = useForm<FormValues>({
    defaultValues: {
      name: '',
      due: '',
      assignee: '',
      assigned: '',
      priority: 'Low',
      status: 'Pending',
      description: '',
    }
  })

  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isStatusOpen, setIsStatusOpen] = useState(false)
  const [isPriorityOpen, setIsPriorityOpen] = useState(false)

  const statusDropdownRef = useRef<HTMLDivElement>(null)
  const priorityDropdownRef = useRef<HTMLDivElement>(null)

  // Auth guard
  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user }, error }) => {
      if (error || !user) navigate('/login')
    })
  }, [navigate])

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (statusDropdownRef.current && !statusDropdownRef.current.contains(e.target as Node)) {
        setIsStatusOpen(false)
      }
      if (priorityDropdownRef.current && !priorityDropdownRef.current.contains(e.target as Node)) {
        setIsPriorityOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const submit = (data: FormValues) => {
    const newTask: Task = { id: Date.now(), ...data }
    onSubmit(newTask)
    navigate('/')
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/login')
  }

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
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
            `}
          >
            <img src={taskaBook} alt="Taska" className="h-5 w-5" />
            {!isCollapsed && <span className="ml-2">Task</span>}
          </button>
        </nav>
        <button
          onClick={() => setIsCollapsed(v => !v)}
          className="mt-auto text-gray-500 hover:text-gray-700 transition"
        >
          {isCollapsed ? '→' : '←'}
        </button>
      </aside>

      {/* Mobile Drawer */}
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

      {/* Main */}
      <main className="flex-1 flex flex-col overflow-auto">
        {/* Header */}
        <header className="flex items-center justify-between p-4 md:p-8 bg-white">
          <div className="flex items-center">
              <Menu className="h-6 w-6 mt-1 relative"/>
            <h1 className="text-2xl ml-1 font-semibold">Create New Task</h1>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
          >
            Log Out
          </button>
        </header>

        {/* Form */}
        <div className="p-4 md:p-8">
          <form onSubmit={handleSubmit(submit)} className="bg-white shadow-md rounded-lg p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
              {/* Title */}
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-1">Title</label>
                <input
                  type="text"
                  placeholder="Enter title"
                  required
                  {...register('name')}
                  className="border border-gray-400 shadow rounded-lg w-full py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                />
              </div>

              {/* Due Date */}
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-1">Due Date</label>
                <input
                  type="date"
                  required
                  {...register('due')}
                  className="border border-gray-400 shadow rounded-lg w-full py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                />
              </div>

              {/* Priority */}
              <div className="relative" ref={priorityDropdownRef}>
                <label className="block text-gray-700 text-sm font-medium mb-1">Priority</label>
                <button
                  type="button"
                  onClick={() => setIsPriorityOpen(o => !o)}
                  className="border border-gray-400 shadow rounded-lg w-full py-2 px-3 flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-indigo-300"
                >
                  <span>{watch('priority')}</span>
                  <ChevronDown className="h-5 w-5" />
                </button>
                {isPriorityOpen && (
                  <div className="absolute z-10 mt-1 bg-white rounded-lg shadow-md w-full">
                    <div className="mx-4 border-b border-gray-300 px-4 py-2 font-medium">Priority</div>
                    <ul className="py-1">
                      {(['Low','Normal','High'] as const).map((lvl,) => (
                        <li
                          key={lvl}
                          className=" border-b border-gray-300 flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer"
                          onClick={() => {
                            setValue('priority', lvl)
                            setIsPriorityOpen(false)
                          }}
                        >
                          <Flag
                            className="h-4 w-4 mr-2 fill-current"
                            style={{
                              color:
                                lvl === 'Low' ? '#FBBF24'
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
              </div>

              {/* Status */}
              <div className="relative" ref={statusDropdownRef}>
                <label className="block text-gray-700 text-sm font-medium mb-1">Status</label>
                <button
                  type="button"
                  onClick={() => setIsStatusOpen(o => !o)}
                  className="border border-gray-400 shadow rounded-lg w-full py-2 px-3 flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-indigo-300"
                >
                  <span>{watch('status')}</span>
                  <ChevronDown className="h-5 w-5" />
                </button>
                {isStatusOpen && (
                  <div className="absolute z-10 mt-1 bg-white rounded-lg shadow-md w-full">
                    <div className="mx-4 border-b border-gray-300 px-4 py-2 font-medium">Status</div>
                    <ul className="py-1">
                      {(['Pending','Active','Closed'] as const).map((st) => (
                        <li
                          key={st}
                          className="mx-4 border-b border-gray-300 flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer"
                          onClick={() => {
                            setValue('status', st)
                            setIsStatusOpen(false)
                          }}
                        >
                          <span
                            className="w-4 h-4 rounded-full mr-2 block"
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
              </div>

              {/* Assignee */}
              <div className="relative">
                <label className="block text-gray-700 text-sm font-medium mb-1">Assignee</label>
                <select
                  {...register('assignee')}
                  required
                  className="border border-gray-400 appearance-none shadow rounded-lg w-full py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                >
                  <option value="" disabled>Select</option>
                  <option>Syed Muqarab</option>
                  <option>Saud Haris</option>
                  <option>Saeed</option>
                </select>
                <ChevronDown className="absolute top-9 right-3 h-5 w-5 pointer-events-none" />
              </div>

              {/* Assigned by */}
              <div className="relative">
                <label className="block text-gray-700 text-sm font-medium mb-1">Assigned by</label>
                <select
                  {...register('assigned')}
                  required
                  className="border border-gray-400 appearance-none shadow rounded-lg w-full py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                >
                  <option value="" disabled>Select</option>
                  <option>Majid</option>
                  <option>Kaif</option>
                  <option>Ahmer</option>
                </select>
                <ChevronDown className="absolute top-9 right-3 h-5 w-5 pointer-events-none" />
              </div>

              {/* Description */}
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-1">Description</label>
                <input
                  type="text"
                  placeholder="Enter description"
                  {...register('description')}
                  className="border border-gray-400 shadow rounded-lg w-full py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                />
              </div>
            </div>

            {/* Submit button */}
            <div className="flex justify-end mt-6">
              <button
                type="submit"
                className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
              >
                Create Task
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}
