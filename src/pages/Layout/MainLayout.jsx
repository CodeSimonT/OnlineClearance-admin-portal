import React from 'react'
import { Outlet } from 'react-router-dom'
import { SideNav,Navbar, DeficiencyModal, AddDepartmentModal, EditDepartmentModal, fetchDepartment } from '../../hooks/links'
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query';
import { ToastContainer } from 'react-toastify';

function MainLayout() {
  const [isShowSideNav, setIsShowSideNav] = useState(false);

  useQuery({
    queryKey:['department'],
    queryFn: fetchDepartment
  })

  return (
    <main className='w-full h-screen flex flex-row relative'>
      <ToastContainer/>
        {/* modal */}
            <DeficiencyModal/>
            <AddDepartmentModal/>
            <EditDepartmentModal/>
        {/* ========== */}
        <SideNav 
          isShowSideNav={isShowSideNav}
          setIsShowSideNav={setIsShowSideNav}
        />
        <section className='flex-1 overflow-auto'>
            <Navbar
              isShowSideNav={isShowSideNav}
              setIsShowSideNav={setIsShowSideNav}
            />
            <div className='p-5 mt-20'>
              <Outlet/>
            </div>
        </section>
    </main>
  )
}

export default MainLayout