import React from 'react'
import Header from './Header'
import Cards from './Cards'
import { Clock3, FolderLock, Shield, Users } from 'lucide-react'
import RecentActivity from './RecentActivity'
import QuickActions from './QuickActions'

const MainHero = () => {
  return (
    <div className='flex flex-col p-6 bg-gray-50 min-h-screen w-screen'>
      <Header />

      
      <div className='flex flex-col md:flex-row gap-4 mb-6'>
        <Cards title="Vault Status" isStatus icon={<Shield size={15} />} />
        <Cards title="Vault Items" body={3} subtext="documents secured" icon={<FolderLock size={15} />} />
        <Cards title="Trusted Contacts" body={3} subtext="contacts added" icon={<Users size={15} />} />
        <Cards title="Active Triggers" body={1} subtext="configured" icon={<Clock3 size={15} />} />
      </div>

  
      <div className='flex flex-col lg:flex-row gap-4'>
        <RecentActivity />
        <QuickActions />
      </div>
    </div>
  )
}

export default MainHero