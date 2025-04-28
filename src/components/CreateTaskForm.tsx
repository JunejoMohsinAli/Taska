import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { Task } from './Home'
import { BookOpen, Menu, ChevronDown } from 'lucide-react'
import taskaLogo from '../assets/taska.svg'
import { supabase } from '../utils/supabaseClient'


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
  const { register, handleSubmit } = useForm<FormValues>({
    defaultValues: {
      name: '',
      due: '',
      assignee: '',
      assigned:'',
      priority: 'Low',
      status: 'Pending',
      description: '',
    }
  })

  const submit = (data: FormValues) => {
    const newTask: Task = {
      id: Date.now(),
      ...data
    }
    onSubmit(newTask)
    navigate('/')
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/login')
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
        <BookOpen className="h-5 w-5" />
            <span className="ml-2">Task</span>
          </button>
        </nav>
      </aside>

      {/* Main */}
      <main className="flex-1 p-8 overflow-auto w-full">
        <div className="flex justify-between items-center mb-6">
        <h1 className="flex items-center text-2xl font-semibold">
          <Menu className="h-5 w-5 mr-2" />
          Create New Task
        </h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
          >
            Log Out
          </button>
        </div>

        <form
          onSubmit={handleSubmit(submit)}
          className="bg-white shadow-md rounded-lg p-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            {/* Title */}
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-1">
                Title
              </label>
              <input
                type="text"
                placeholder="Enter title"
                {...register('name')}
                className="shadow border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-300"
              />
            </div>

            {/* Due Date */}
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-1">
                Due Date
              </label>
              <input
                type="date"
                {...register('due')}
                className="shadow border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-300"
              />
            </div>

            {/* Priority */}
            <div className='relative'>
              <label className="block text-gray-700 text-sm font-medium mb-1">
                Priority
              </label>
              <select
                {...register('priority')}
                defaultValue=""
                className="appearance-none shadow border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-300"
              >
                <option value="" disabled>
                  Select
                </option>
                <option>Low</option>
                <option>Normal</option>
                <option>High</option>
              </select>
              <div className="absolute top-6 bottom-0 right-0 flex items-center px-3 pointer-events-none">
              <ChevronDown className="h-5 w-5 text-black" />
              </div>
            </div>

            {/* Status */}
            <div className='relative'>
              <label className="block text-gray-700 text-sm font-medium mb-1">
                Status
              </label>
              <select
                {...register('status')}
                defaultValue=""
                className="appearance-none shadow border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-300"
              >
                <option value="" disabled>
                  Select
                </option>
                <option>Pending</option>
                <option>Active</option>
                <option>Closed</option>
              </select>
              <div className="absolute top-6 bottom-0 right-0 flex items-center px-3 pointer-events-none">
              <ChevronDown className="h-5 w-5 text-black" />
              </div>
            </div>

            {/* Assignee */}
            <div className='relative'>
              <label className="block text-gray-700 text-sm font-medium mb-1">
                Assignee
              </label>
              <select
                {...register('assignee')}
                defaultValue=""
                className="appearance-none shadow border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-300"
              >
                <option value="" disabled>
                  Select
                </option>
                <option>Syed Muqarab</option>
                <option>Saud Haris</option>
                <option>Saeed</option>
              </select>
              <div className="absolute top-6 bottom-0 right-0 flex items-center px-3 pointer-events-none">
              <ChevronDown className="h-5 w-5 text-black" />
              </div>
            </div>

            {/* Assigned */}
              <div className='relative'>
              <label className="block text-gray-700 text-sm font-medium mb-1">
                Assigned by
              </label>
              <select
                {...register('assigned')}
                defaultValue=""
                className="appearance-none shadow border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-300"
              >
                <option value="" disabled>
                  Select
                </option>
                <option>Majid</option>
                <option>Kaif</option>
                <option>Ahmer</option>
              </select>
              <div className="absolute top-6 bottom-0 right-0 flex items-center px-3 pointer-events-none">
              <ChevronDown className="h-5 w-5 text-black" />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-1">
                Description
              </label>
              <input
                type="text"
                placeholder="Enter description"
                {...register('description')}
                className="shadow border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-300"
              />
            </div>
          </div>

          {/* Submit */}
          <div className="flex justify-end mt-6">
            <button
              type="submit"
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
            >
              Create Task
            </button>
          </div>
        </form>
      </main>
    </div>
  )
}
