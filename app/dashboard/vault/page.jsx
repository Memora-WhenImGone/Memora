import { ChevronDown } from 'lucide-react'
import React from 'react'

const VaultHeader = () => {
  return (
    <div className='flex flex-col border rounded-b-md'>
        <div className='font-bold'>
            Vault Items
        </div>
        <div className='font-light text-gray-400 text-xs'>
            Search and filter your stored items.
        </div>
      
    </div>
  )
}
const SearchBar = () => {
  return (
    <div className='flex flex-row border rounded-b-md'>
       <input className='p-2 w-full border rounded-lg' placeholder='Search..'></input>
       <select className='flex flex-row p-2 border rounded-lg '>
        <option>All Types
            <span><ChevronDown /></span>
        </option>
       </select>
       <button className='flex flex-row p-2 border rounded-lg  hover:bg-gray-400 cursor-pointer transition-colors bg-black text-blue-50 '>Apply</button>
    </div>
  )
}

const ItemsBar = () => {
  return (
    <div className='flex flex-row border gap-4 rounded-b-md'>
       <select className='flex flex-row p-2 border rounded-lg '>
        <option>Document
            <span><ChevronDown /></span>
        </option>
       </select>
       <input className='p-2 w-full border rounded-lg' placeholder='Title'></input>
       <button className='flex flex-row p-2 border rounded-lg  hover:bg-gray-400 cursor-pointer transition-colors bg-black text-blue-50 '>Create</button>
    </div>
  )
}

const Files = () => {
  return (
    <div className='flex flex-col gap-4 rounded-b-md p-2 w-full border rounded-lg'>
       <div>
        Screenshot
       </div>
       <div>
        <span>Document</span>
        <span>Files: 1</span>
       </div>

       <div>
        Files
       </div>
       <div>
        <span>Document</span>
        <span>Files: 1</span>
       </div>

       <div>
        ABC
       </div>
       <div>
        <span>Credential</span>
        <span>Files: 0</span>
       </div>
       

    </div>
  )
}


const page = () => {
  return (
    <div className='flex flex-col gap-4'>
      <VaultHeader/>
      <SearchBar/>
      <ItemsBar/>
      <Files/>
    </div>
  )
}

export default page
