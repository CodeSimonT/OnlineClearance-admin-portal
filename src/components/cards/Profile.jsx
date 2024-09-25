import React, { useEffect } from 'react'
import { useQuery } from '@tanstack/react-query';
import cookie from '../../hooks/cookie';

function Profile() {
  const {clearCookie} = cookie();

  const { data,isLoading,isError } = useQuery({
    queryKey:['department'],
  })

  useEffect(()=>{
    if(isError){
      clearCookie()
      location.reload();
      return;
    }
  },[isError])

  return (
    <div className='bg-maroon h-24 text-white p-3 flex flex-col items-start justify-end overflow-auto text-wrap break-all'>
        {
          isLoading ?
          (
            <div role="status" className="max-w-sm animate-pulse">
                <div className="h-4 bg-gray-200 rounded-full dark:bg-gray-700 w-48 mb-2 opacity-50"></div>
            </div>
          ):(
            <h1 className='text-lg font-medium'>
              {
                `${data?.firstName} ${data?.lastName}`
              }
            </h1>
          )
        }
        <div className='flex items-center gap-1'>
            {
              isLoading ?
              (
                <div role="status" className="max-w-sm animate-pulse">
                    <div className="h-4 bg-gray-200 rounded-full dark:bg-gray-700 w-24 opacity-50"></div>
                </div>
              ):(
                <h1 className='text-sm'>
                  {
                    data?.department
                  }
                </h1>
              )
            }
        </div>
    </div>
  )
}

export default Profile