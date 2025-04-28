// src/components/TaskDetailsModal.tsx
import React from 'react'
import { Task } from './Home'
import { X, Trash2 } from 'lucide-react'

interface Props {
  task: Task
  onClose: () => void
  onDelete: (id: number) => void
}

export default function TaskDetailsModal({ task, onClose, onDelete }: Props) {
  // Read-only details modal
  const handleDelete = () => {
    onDelete(task.id)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/25 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl relative">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold">Task Details</h2>
          <button onClick={onClose} aria-label="Close modal">
            <X className="h-5 w-5 text-gray-600 hover:text-gray-800" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4 text-gray-800">
          <div>
            {/* <h3 className="text-sm font-medium text-gray-600">Title</h3> */}
            <h1 className="text-2xl font-medium text-blue-600">{task.name}</h1>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-gray-600">Due Date</h3>
              <p className="mt-1">{task.due}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-600">Assignee</h3>
              <p className="mt-1">{task.assignee}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-gray-600">Priority</h3>
              <p className="mt-1">{task.priority}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-600">Status</h3>
              <p className="mt-1">{task.status}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-600">Assigned by</h3>
              <p className="mt-1">{task.assigned}</p>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-600">Description</h3>
            <p className="mt-1 whitespace-pre-wrap">{task.description || '—'}</p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end items-center space-x-3 p-4 border-t">
          <button
            onClick={handleDelete}
            className="flex items-center px-4 py-2 bg-red-100 text-red-600 rounded hover:bg-red-200 transition"
          >
            <Trash2 className="h-4 w-4 mr-1" /> Delete
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
