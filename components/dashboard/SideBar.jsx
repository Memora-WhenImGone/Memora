import React from 'react'
import {  Clock3, FileText, FolderLock, LayoutDashboard, Settings, Shield, UserCog, Users } from 'lucide-react';
import { ChevronLeft } from 'lucide-react';

const SideBar = () => {

    const SideBarOptions = [
        {
            id: 1,
            name: "Dashboard",
            icon:     <LayoutDashboard />
        },
          {
            id: 2,
            name: "Vault",
            icon: <FolderLock />
        },
          {
            id: 3,
            name: "Contacts",
            icon: <Users />
        },
          {
            id: 4,
            name: "Triggers",
            icon: <Clock3/>
        },
        {
            id: 5,
            name: "Digital",
            icon: <FileText />
        },
        {
            id: 6,
            name: "Settings",
            icon: <Settings />
        }


        
    ]
  return (
    <div className='flex flex-col bg-white font-normal'>
     <div className="top flex flex-row p-8">
        <div className='flex flex-col'>
        <div className='iconAndName flex flex-row'>
           <Shield  /> <h1>Memora</h1>
        </div>
        <div className='w-max h-1 bg-black '>
        </div>
        </div>
           <ChevronLeft />
     </div>

     <div className="middle flex flex-col gap-2 p-8">

        {
            SideBarOptions.map((item, index)=>(

                <div key={index} className="element flex flex-row gap-2 hover:bg-gray-300 cursor-pointer">
                   <div>{item.icon}</div> <span>{item.name}</span>
                </div>
            ))
        }
     </div>
     <div className="admin flex flex-col gap-4">
        <h1>ADMIN</h1>
        <div className="admin flex flex-row p-4 gap-2">
              <div>
                <UserCog/> </div> <span>Admin</span>

        </div>
     </div>
    </div>
  )
}

export default SideBar
