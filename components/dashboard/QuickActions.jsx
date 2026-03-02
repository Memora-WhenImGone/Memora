import { ArrowRight, Clock3, FolderLock, Shield, Users } from 'lucide-react'
import React from 'react'

const actions = [
  { icon: <FolderLock size={16} />, label: 'Upload Document' },
  { icon: <Users size={16} />, label: 'Add Trusted Contact' },
  { icon: <Clock3 size={16} />, label: 'Configure Trigger' },
  { icon: <Shield size={16} />, label: 'Security Settings' },
]

const QuickActions = () => {
  return (
    <div className='w-80 bg-white border border-gray-200 rounded-xl shadow-sm flex-shrink-0'>
      <div className="flex flex-row items-center gap-2 px-5 py-4 border-b border-gray-100">
        <ArrowRight size={16} className='text-gray-500' />
        <span className='font-semibold text-gray-800 text-sm'>Quick Actions</span>
      </div>
      <div className='flex flex-col gap-3 p-4'>
        {actions.map((action, i) => (
          <button key={i} className='flex flex-row items-center gap-3 border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-700 bg-white hover:bg-gray-50 cursor-pointer transition-colors w-full text-left'>
            <span className='text-gray-500'>{action.icon}</span>
            <span>{action.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

export default QuickActions