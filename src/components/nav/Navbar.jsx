import React from 'react'
import { RxHamburgerMenu } from '../../hooks/icons'

function Navbar({isShowSideNav, setIsShowSideNav}) {

  return (
    <nav className='w-full flex p-2 items-center border-b fixed z-10 bg-white h-20 max-xl:left-0 left-56 right-0'>
        <div className='flex items-center gap-5'>
            <button 
              className='font-medium text-xl max-xl:block hidden'
              onClick={()=>{setIsShowSideNav(isShowSideNav ? false:true)}}
            >
                <RxHamburgerMenu/>
            </button>
            <div className='flex items-center gap-2 uppercase text-sm font-medium text-gray-500'>
              <img 
                  src='/logo.png'
                  className='w-20'
              />
              <div className='w-[1px] border-[1px] h-[35px]'></div>
              <h1>AMACC-Naga OSC</h1>
            </div>
        </div>
    </nav>
  )
}

export default Navbar