import React, { useState } from 'react'
import ProfileNavigation from './ProfileNavigation'
import { Route, Routes } from 'react-router-dom';
import UserProfile from './UserProfile';
import { Orders } from "./Orders";
import { Address } from "./Address";
import Favorites from "./Favorites";
import {Events} from "./Events";
import DashboardStaff  from '../../ManagerComponent/Dashboard/DashboardStaff';
import Buyback from '../../ManagerComponent/Buyback/Buyback';
const Profile = () => {
  const [openSideBar,setOpenSideBar] = useState(false);
  return (
    <div className="lg:flex justify-between">
      <div className="sticky h-[200vh] lg:w-[20%]">
        <ProfileNavigation open={openSideBar} />
      </div>
      <div className="lg:w-[80%]">
        <Routes>
          <Route path="/" element={<UserProfile />} />
          <Route path="/dashboard" element={<DashboardStaff/>} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/buyback" element={<Buyback/>} />
          <Route path="/event" element={<Events />}></Route>
        </Routes>
      </div>
      </div>
    
  );
};
export default Profile;

