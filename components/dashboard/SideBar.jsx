import { Clock3, FileText, FolderLock, LayoutDashboard, Settings, Shield, Users } from 'lucide-react';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const SideBar = () => {
  const pathname = usePathname();
  const SideBarOptions = [
    { id: 1, name: "Dashboard", icon: <LayoutDashboard size={20} />, href: "/dashboard" },
    { id: 2, name: "Vault", icon: <FolderLock size={20} />, href: "/dashboard/vault" },
    { id: 3, name: "Contacts", icon: <Users size={20} />, href: "/dashboard/contacts" },
    { id: 4, name: "Triggers", icon: <Clock3 size={20} />, href: "/dashboard/trigger" },
    { id: 5, name: "Digital Will", icon: <FileText size={20} />, href: "/dashboard/digital-will" },
    { id: 6, name: "Settings", icon: <Settings size={20} />, href: "/dashboard/settings" },
  ];

  return (
    <div className='flex flex-col bg-white h-screen w-64 font-normal'>
      <div className="top flex flex-row items-center justify-between px-6 py-6 border-b border-gray-200">
        <div className='flex flex-row items-center gap-3'>
          <div className='bg-slate-900 p-2 rounded-lg'>
            <Shield size={24} className='text-white' />
          </div>
          <h1 className='text-xl font-semibold text-slate-900'>Memora</h1>
        </div>
        <ChevronLeft size={20} className='text-gray-500 cursor-pointer' />
      </div>

      <div className="middle flex flex-col gap-1 px-4 py-6">
        {SideBarOptions.map((item, i) => {
          const isRoot = item.href === '/dashboard';
          const active = isRoot ? pathname === '/dashboard' : pathname.startsWith(item.href);
          return (
            <Link key={i} href={item.href} className={`element flex flex-row items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors ${active ? 'bg-gray-100' : ''}`}
              aria-current={active ? 'page' : undefined}>
              <div className='text-gray-600'>{item.icon}</div>
              <span className='text-gray-700 text-base'>{item.name}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export default SideBar;