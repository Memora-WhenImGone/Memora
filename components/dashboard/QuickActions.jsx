'use client';
import { ArrowRight, Clock3, FolderLock, Shield, Users } from 'lucide-react'
import React from 'react'
import { useRouter } from 'next/navigation'

const actions = [
  { icon: <FolderLock size={16} />, label: 'Upload Document', href: '/dashboard/vault' },
  { icon: <Users size={16} />, label: 'Add Trusted Contact', href: '/dashboard/contacts' },
  { icon: <Clock3 size={16} />, label: 'Configure Trigger', href: '/dashboard/trigger' },
  { icon: <Shield size={16} />, label: 'Security Settings', href: '/dashboard/settings' },
]

const QuickActions = () => {
  const router = useRouter()

  const handleAction = (href) => {
    if (!href) return
    router.push(href)
  }

  return (
    <div className='w-80 bg-blue-100 border border-gray-200 rounded-xl shadow-sm flex-shrink-0'>
      <div className="flex flex-row items-center gap-2 px-5 py-4 border-b border-gray-100">
        <ArrowRight size={16} className='text-gray-500' />
        <span className='font-semibold text-gray-800 text-sm'>Quick Actions</span>
      </div>
      <div className='flex flex-col gap-3 p-4 '>
        {actions.map((action, i) => (
          <button
            key={i}
            type='button'
            onClick={() => handleAction(action.href)}
            className='flex flex-row items-center gap-3 border 
            border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-700 
            bg-green-50 hover:bg-white cursor-pointer transition-colors w-full 
            text-left focus:outline-none focus:ring-2 focus:ring-emerald-300'
          >
            <span className='text-gray-500'>{action.icon}</span>
            <span>{action.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

export default QuickActions
