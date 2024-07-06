import React from 'react'
import { useSelector } from 'react-redux'
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/core/Dashboard/Sidebar';

const Dashboard = () => {
  const {loading:authLoading}= useSelector((state)=>state.auth);
  const {loading:profileLoading}= useSelector((state)=>state.profile);

  if(authLoading||profileLoading){
    return <div>Loading...</div>
  }

  return (
    <div className='relative flex min-h-[calc(100vh-3.5rem)]'>
      <Sidebar/>
      <div className='min-h-[calc(100vh-3.5rem)]'>
        <div className='mx-auto w-11/12 min-w-[1000px] py-5 pl-12 '>
          <Outlet/>
        </div>
      </div>
    
    </div>
  )
}

export default Dashboard