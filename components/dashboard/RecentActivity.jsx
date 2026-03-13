import { Activity, CheckCircle2 } from 'lucide-react'
import React from 'react'

const RecentActivity = ({ items = [] }) => {
  return (
    <div className='flex-1 bg-blue-100 border border-gray-200 rounded-xl shadow-sm '>
      <div className="flex flex-row items-center gap-2 px-5 py-4 border-b border-gray-100">
        <Activity size={16} className='text-gray-500' />
        <span className='font-semibold text-gray-800 text-sm'>Recent Activity</span>
      </div>
      <div className='flex flex-col divide-y divide-gray-50'>
        {items.map((item, i) => (
          <div key={i} className='flex flex-row items-center gap-3 px-5 py-3  hover:bg-white cursor-pointer transition-colors rounded-lg'>
            <div className={`flex items-center justify-center  w-8 h-8 rounded-full ${item.icon === 'check' ? 'bg-green-100' : 'bg-blue-50'}`}>
              {item.icon === 'check'
                ? <CheckCircle2 size={15} className='text-green-500' />
                : <Activity size={15} className='text-blue-400' />
              }
            </div>
            <div className='flex flex-col'>
              <span className='text-sm text-gray-800'>{item.text}</span>
              <span className='text-xs text-gray-400'>{item.time}</span>
            </div>
          </div>
        ))}
        {items.length === 0 && (
          <div className='px-5 py-4 text-sm text-gray-500'>No recent activity</div>
        )}
      </div>
    </div>
  )
}

export default RecentActivity