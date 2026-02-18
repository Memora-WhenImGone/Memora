import React, { useState } from 'react'
import { Clock3, FileText, FolderLock, LayoutDashboard, Settings, Shield, UserCog, Users } from 'lucide-react';
import { ChevronLeft } from 'lucide-react';

const SideBar = () => {

 



    const SideBarOptions = [
        {
            id: 1,
            name: "Dashboard",
            icon: <LayoutDashboard size={20} />
        },
        {
            id: 2,
            name: "Vault",
            icon: <FolderLock size={20} />
        },
        {
            id: 3,
            name: "Contacts",
            icon: <Users size={20} />
        },
        {
            id: 4,
            name: "Triggers",
            icon: <Clock3 size={20} />
        },
        {
            id: 5,
            name: "Digital Will",
            icon: <FileText size={20} />
        },
        {
            id: 6,
            name: "Settings",
            icon: <Settings size={20} />
        }
    ]

    
    return (
        <div className='flex flex-col bg-white h-screen w-64 font-normal'>
            <div className="top flex flex-row items-center 
            justify-between px-6 py-6 border-b border-gray-200">
                <div className='flex flex-row items-center gap-3'>
                    <div className='bg-slate-900 p-2 rounded-lg'>
                        <Shield size={24} className='text-white' />
                    </div>
                    <h1 className='text-xl font-semibold text-slate-900'>Memora</h1>
                </div>
                <ChevronLeft size={20} className='text-gray-500 cursor-pointer' />
            </div>

          
            <div className="middle flex flex-col gap-1 px-4 py-6">
                {
                    SideBarOptions.map((item, index) => (
                        <div 
                            key={index} 
                            className={`element flex flex-row items-center gap-3 
                            px-4 py-3 rounded-lg hover:bg-gray-100 
                            cursor-pointer transition-colors ${item.id === 1 ? 'bg-gray-100' : ''}`}
                        >
                            <div className='text-gray-600'>{item.icon}</div>
                            <span className='text-gray-700 text-base'>{item.name}</span>
                        </div>
                    ))
                }
            </div>

        
            <div className="admin flex flex-col px-4 pt-4 border-t 
            border-gray-200 mt-auto">
                <h2 className='text-xs font-semibold text-gray-400 
                uppercase tracking-wider px-4 mb-3'>ADMIN</h2>
                <div className="admin-item flex flex-row 
                items-center gap-3 px-4 py-3 rounded-lg 
                hover:bg-gray-100 cursor-pointer transition-colors">
                    <UserCog size={20} className='text-gray-600' />
                    <span className='text-gray-700 text-base'>Admin Console</span>
                </div>
            </div>

       
            <div className="user-profile flex flex-row items-center gap-3 px-6 
            py-4 border-t border-gray-200 mt-4">
                <div className='w-10 h-10 bg-gray-200 rounded-full 
                flex items-center justify-center'>
                    <span className='text-gray-700 font-medium'>U</span>
                </div>
                <div className='flex flex-col flex-1 overflow-hidden'>
                    <span className='text-sm font-medium text-gray-900'></span>
                    <span className='text-xs text-gray-500 truncate'></span>
                </div>
                <ChevronLeft size={16} className='text-gray-400 rotate-180' />
            </div>
        </div>
    )
}

export default SideBar