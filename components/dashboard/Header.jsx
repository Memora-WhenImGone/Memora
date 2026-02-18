import React from 'react'
import { FileText, FolderLock } from 'lucide-react';

const Header = () => {
  return (
    <div className='flex flex-row gap-170'>
     <div className="leftSide flex flex-col">
        <span>User</span>
        <span>Blah blah</span>
     </div>
     <div className=" flex flex-row gap-8">
     <button className='flex flex-row shadow-md rounded-md p-0.5 gap-2 hover:bg-red-200 text-sm cursor-pointer transition-colors'>
        <FileText /> <span>Digital Will</span>
     </button>
      <button className='flex flex-row rounded-md bg-black text-amber-50 p-1  hover:bg-amber-800 text-sm cursor-pointer transition-colors'>
        <FolderLock/> <span>Open Vault</span>
     </button>
     </div>
     
    </div>
  )
}

export default Header
