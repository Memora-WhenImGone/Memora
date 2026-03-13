"use client";

import SideBar from "../../components/dashboard/SideBar";
import MainHero from "../../components/dashboard/MainHero";

const Page = () => {
  return (
    <div className="flex flex-row">
      <SideBar />
      <MainHero />
    </div>
  );
};

export default Page;