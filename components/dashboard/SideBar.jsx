'use client';
import { useState } from 'react';
import { Clock3, FileText, FolderLock, 
  LayoutDashboard, Settings, Shield, Users, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const SideBar = () => {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const toggleSidebar = () => setCollapsed(prev => !prev);

  const SideBarOptions = [
    { id: 1, name: "Dashboard", icon: <LayoutDashboard size={20} />, href: "/dashboard" },
    { id: 2, name: "Vault", icon: <FolderLock size={20} />, href: "/dashboard/vault" },
    { id: 3, name: "Contacts", icon: <Users size={20} />, href: "/dashboard/contacts" },
    { id: 4, name: "Triggers", icon: <Clock3 size={20} />, href: "/dashboard/trigger" },
    { id: 5, name: "Digital Will", icon: <FileText size={20} />, href: "/dashboard/digital-will" },
    { id: 6, name: "Settings", icon: <Settings size={20} />, href: "/dashboard/settings" },
  ];

  return (
    <div className={`flex flex-col bg-white h-screen border-r 
    border-gray-200 font-normal transition-all duration-300 ${collapsed ? 'w-20' : 'w-64'}`}>
      <div className={`top flex flex-row items-center 
        justify-between ${collapsed ? 'px-3' : 'px-6'} py-6 border-b border-gray-200`}>
        <div className={`flex flex-row items-center ${collapsed ? 'justify-center flex-1' : 'gap-3'}`}>
          <div className='bg-slate-900 p-2 rounded-lg'>
            <Shield size={24} className='text-white' />
          </div>
          {!collapsed && <h1 className='text-xl font-semibold text-slate-900 ml-3'>Memora</h1>}
        </div>
        <button
          type='button'
          onClick={toggleSidebar}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className='p-1 rounded-md text-gray-500 hover:bg-gray-100 transition-colors'
        >
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      <div className={`middle flex flex-col gap-1 ${collapsed ? 'px-2' : 'px-4'} py-6`}>
        {SideBarOptions.map((item, i) => {
          const isRoot = item.href === '/dashboard';
          const active = isRoot ? pathname === '/dashboard' : pathname.startsWith(item.href);
          return (
            <Link
              key={i}
              href={item.href}
              className={`element flex flex-row items-center gap-3 rounded-lg 
                hover:bg-gray-100 transition-colors ${active ? 'bg-gray-100' : ''} 
              ${collapsed ? 'justify-center py-3' : 'px-4 py-3'}`}
              aria-current={active ? 'page' : undefined}
            >
              <div className='text-gray-600'>{item.icon}</div>
              {!collapsed && <span className='text-gray-700 text-base'>{item.name}</span>}
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export default SideBar;
