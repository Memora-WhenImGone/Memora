import React from 'react'
import Header from "@/components/HomePage/Header";
import SideBar from '../../components/dashboard/SideBar';
import MainHero from '../../components/dashboard/MainHero';
const page = () => {

  return (
  <div className='flex flex-row'>
    <SideBar></SideBar>
    <MainHero></MainHero>
  </div>
  )
}

export default page;
