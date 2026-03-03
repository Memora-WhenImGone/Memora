import React from 'react'
import { FileText, FolderLock } from 'lucide-react';

const Header = () => {
  return (
    <div className='flex flex-row items-start justify-between mb-6'>
      <div className="flex flex-col">
        <h1 className='text-2xl font-bold text-gray-900'>Dashboard</h1>
        <p className='text-sm text-gray-500 mt-0.5'>Monitor your vault status and recent activity</p>
      </div>
      <div className="flex flex-row gap-3 items-center">
        <button className='flex flex-row items-center gap-2 border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-700 
        bg-white hover:bg-gray-50 cursor-pointer transition-colors shadow-sm'>
          <FileText size={16} /> <span>Digital Will</span>
        </button>
        <button className='flex flex-row items-center gap-2 rounded-lg 
        bg-gray-900 text-white px-4 py-2 hover:bg-gray-700 text-sm cursor-pointer transition-colors shadow-sm'>
          <FolderLock size={16} /> <span>Open Vault</span>
        </button>
      </div>
    </div>
  )
}

export default Header