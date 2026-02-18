import { ArrowRight, Clock3, FolderLock, Shield, Users } from 'lucide-react'
import React from 'react'

const QuickActions = () => {
  return (
    <div className='bg-gray-50 border-2 rounded-md'>

        <div className="header flex flex-row bg-gray-300 border-b-2 rounded-md">
            <ArrowRight/> <span>Quick Actions</span>
        </div>

        <div className='flex flex-col gap-2 m-3 w-80'>

        <div className='bg-gray-50 border-2 rounded-md flex flex-row p-0.5'>
           <FolderLock/> <span>Upload Document</span>
        </div>
        <div className='bg-gray-50 border-2 rounded-md flex flex-row p-0.5'>
            <Users/> <span>Add Trusted Contacts</span>
        </div>

        <div className='bg-gray-50 border-2 rounded-md flex flex-row p-0.5'>
            <Clock3/> <span>Configure Trigger</span>
        </div>

        <div className='bg-gray-50 border-2 rounded-md flex flex-row p-0.5'>
            <Shield/> <span>Security Settings</span>
        </div>
        </div>
      
    </div>
  )
}

export default QuickActions
