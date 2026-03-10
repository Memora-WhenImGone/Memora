'use client'
import SideBar from '../../components/dashboard/SideBar';
import MainHero from '../../components/dashboard/MainHero';

const page = () => {
  return (
    <div className='flex flex-row'>
      <SideBar />
      <MainHero />
    </div>
  )
}

export default page;