import React from 'react'
import { LuUserCircle2 } from '../../hooks/icons'

function ActiveRequestInfo() {
  return (
    <div className='w-full border-2 rounded-md'>
        <div className='bg-maroon p-3 rounded-t-md text-white'>
           <h1 className='font-medium'>Request Information</h1> 
        </div>
        <div className='flex p-2'>
            <div className='flex-1'>
                <div className='text-2xl'>
                    <LuUserCircle2/>
                </div>
            </div>
            <div className='flex-1'>
                Deficiency
            </div>
        </div>
    </div>
  )
}

export default ActiveRequestInfo