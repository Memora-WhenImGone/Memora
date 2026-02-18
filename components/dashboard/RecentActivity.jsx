import { Check, LineChart } from 'lucide-react'
import React from 'react'

const RecentActivity = () => {
  return (
    <div className=' bg-gray-50 border-2 rounded-md'>
        <div className="header flex flex-row bg-gray-300 border-b-2 rounded-md">
            Recent Activity
        </div>
        <div className='flex flex-col'>
       <div className='flex flex-row'>
       <LineChart/>  <span>Update Notifications preference</span>
        </div> 
      <div  className='flex flex-row'>
       <LineChart/>  <span>Viewd Vault Items</span>
        </div> 
         <div  className='flex flex-row'>
       <Check/>  <span>chrome/Macos</span>
        </div> 
      <div  className='flex flex-row'>
       <LineChart/>  <span>Update Notification Preferences</span>
        </div> 
        </div>

      <span>Notfication Pre</span>
    </div>
  )
}

export default RecentActivity
