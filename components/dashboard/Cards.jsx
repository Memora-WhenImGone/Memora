import React from 'react'
import { ArrowRight } from 'lucide-react'

const Cards = ({ title, body, subtext, icon, isStatus }) => {
  return (
    <div className='flex-1 bg-white border border-gray-200 rounded-xl p-5 flex flex-col gap-3 shadow-sm'>
      <div className='flex flex-row items-center justify-between'>
        <div className='flex flex-row items-center gap-2 text-sm text-gray-500'>
          <span className='text-gray-400'>{icon}</span>
          <span>{title}</span>
        </div>
        <ArrowRight size={16} className='text-gray-300' />
      </div>

      {isStatus ? (
        <div>
          <span className='text-xs font-semibold text-green-600 bg-green-100 px-2 py-0.5 rounded-full'>Active</span>
        </div>
      ) : (
        <div>
          <span className='text-3xl font-bold text-gray-900'>{body}</span>
          {subtext && <p className='text-xs text-gray-400 mt-0.5'>{subtext}</p>}
        </div>
      )}
    </div>
  )
}

export default Cards