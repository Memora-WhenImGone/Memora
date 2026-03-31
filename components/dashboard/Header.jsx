"use client";
import React from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { FileText, FolderLock, LogOut } from 'lucide-react';

const Header = ({ lastActivity = '' }) => {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const res = await fetch('/api/sign-out', { method: 'POST' });
      if (res.ok) {
        toast.success('Logged out');
        router.push('/sign-in');
        router.refresh();
      } else {
        toast.error('Logout failed');
      }
    } catch (e) {
      toast.error('Logout failed');
    }
  };

  return (
    <div className='flex flex-row items-start justify-between mb-6'>
      <div className="flex flex-col">
        <h1 className='text-2xl font-bold text-black'>Dashboard</h1>
        <p className='text-sm text-indigo-900 mt-0.5'>Monitor your vault status and recent activity</p>
        <p className='text-sm text-indigo-700 mt-1'>Last activity: {lastActivity}</p>
      </div>
      <div className="flex flex-row gap-3 items-center">
        <button
          type='button'
          onClick={() => router.push('/dashboard/digital-will')}
          className='flex flex-row items-center gap-2 border 
          border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-700
           bg-white hover:bg-gray-50 cursor-pointer transition-colors shadow-sm'
        >
          <FileText size={16} /> <span>Digital Will</span>
        </button>
        <button
          type='button'
          onClick={() => router.push('/dashboard/vault')}
          className='flex flex-row items-center gap-2 rounded-lg bg-gray-900 
          text-white px-4 py-2 hover:bg-gray-700 text-sm cursor-pointer transition-colors shadow-sm'
        >
          <FolderLock size={16} /> <span>Open Vault</span>
        </button>
        <button
          onClick={handleLogout}
          className='flex flex-row items-center gap-2 
          rounded-full px-4 py-2 text-sm font-medium 
          text-white shadow-sm cursor-pointer transition-colors 
          bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600'
          aria-label='Log out'
        >
          <LogOut size={16} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Header;

