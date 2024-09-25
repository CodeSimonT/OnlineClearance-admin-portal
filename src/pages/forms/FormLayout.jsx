import React from 'react'
import { Outlet } from 'react-router-dom'
import { SuccessToast } from '../../hooks/links'
import { ToastContainer } from 'react-toastify'

function FormLayout() {
  return (
    <div className='w-full h-screen flex flex-row max-[900px]:flex-col items-center justify-center p-5'>
        <ToastContainer/>
        <div className='w-full flex flex-col items-center'>
            <img src='/logo.png'/>
            <div className='mt-5 flex flex-col items-center'>
                <h1 className='text-2xl font-bold text-maroon'>AMACC-Naga OSC</h1>
                <h2 className='text-sm text-maroon'>Online Student Clearance</h2>
            </div>
        </div>
        <div className='w-full'>
            <Outlet/>
        </div>
    </div>
  )
}

export default FormLayout