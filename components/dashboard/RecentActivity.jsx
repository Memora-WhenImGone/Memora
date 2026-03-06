import { Activity, CheckCircle2 } from 'lucide-react'
import React from 'react'

const activities = [
  { icon: 'activity', text: 'Updated notification preferences', time: 'Just now' },
  { icon: 'activity', text: 'Updated notification preferences', time: 'Just now' },
  { icon: 'activity', text: 'Viewed vault items', time: 'Just now' },
  { icon: 'check', text: 'Chrome / macOS', time: 'Just now' },
  { icon: 'activity', text: 'Updated notification preferences', time: 'Just now' },
]

const RecentActivity = () => {
  return (
    <div className='flex-1 bg-white border border-gray-200 rounded-xl shadow-sm'>
      <div className="flex flex-row items-center gap-2 px-5 py-4 border-b border-gray-100">
        <Activity size={16} className='text-gray-500' />
        <span className='font-semibold text-gray-800 text-sm'>Recent Activity</span>
      </div>
      <div className='flex flex-col divide-y divide-gray-50'>
        {activities.map((item, i) => (
          <div key={i} className='flex flex-row items-center gap-3 px-5 py-3'>
            <div className={`flex items-center justify-center w-8 h-8 rounded-full ${item.icon === 'check' ? 'bg-green-100' : 'bg-blue-50'}`}>
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
      </div>
    </div>
  )
}

export default RecentActivity