import React from 'react'
import Header from './Header'
import Cards from './Cards'

import { Clock3, FolderLock, Shield, Users } from 'lucide-react'
import RecentActivity from './RecentActivity'
import QuickActions from './QuickActions'

const MainHero = () => {



  return (
    <div className='flex flex-col'>
      <Header></Header>
   <div className='flex flex-col md:flex-row'>
  <Cards title={"Vault Status"} body={3 } icon={<Shield/>}/>
    <Cards title={"Vault Items"} body={4 } icon={<FolderLock/>}/>
      <Cards title={"Trusted Contracts"} body={3 } icon={<Users/>}/>
        <Cards title={"Active Triggers"} body={3 } icon={<Clock3/>}/>

   </div>

  <div className='flex flex-row gap-50'>
    <RecentActivity/>
   <QuickActions/>
  </div>
    </div>
  )
}

export default MainHero
