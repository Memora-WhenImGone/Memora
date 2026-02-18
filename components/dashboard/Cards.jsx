import React from 'react'

// Lesson Props in react 


const Cards = ({title,body,icon}) => {
  return (
    <div className='mt-10'>
      
   <div className="card1 flex flex-col w-full h-20 ring-2 rounded-md ring-gray-300">
    <div className='w-full h-8 p-2 border-b-2 border-solid border-gray-200'>
       <span>{title}</span> {icon}
    </div>
    <div className="body p-2">
        {body}
    </div>
   </div>
    </div>
  )
}

export default Cards
