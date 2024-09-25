import React, { useEffect, useState } from 'react'
import { IoSearchSharp } from '../../hooks/icons'
import { ActiveRequestTable, cookie, Spinner } from '../../hooks/links'
import { Pagination } from "flowbite-react";
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

function ActiveRequestList() {
    const {token,getCookie} = cookie();

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const onPageChange = (number) => setCurrentPage(number);

    const env = import.meta.env;
    const serverURL = env.VITE_REACT_SERVER_URL;

    const departmentQuery = useQuery({
        queryKey:['department'],
    })

    const activeRequestQuery = useQuery({
        queryKey:['activeDepartment',currentPage],
        queryFn: async()=>{

            const {data} = await axios.get(`${serverURL}/osc/api/get/single/activeRequest`,{
                headers:{
                    Authorization:token
                },
                params: {
                    id:departmentQuery.data.activeRequest,
                    page: currentPage,
                    limit: 10 // Adjust the limit as needed
                }
            })

            setTotalPages(data.totalPages); 

            return data.requests;
        }
    });

    useEffect(()=>{
        const handleGetCookie =async()=>{
            await getCookie();
        }
        handleGetCookie();
    },[])

    return (
        <div>
            <div className="w-full bg-maroon flex flex-col rounded-t-md p-3">
                <div>
                    <h1 className='text-white font-medium text-2xl'>Active Request List</h1>
                </div>
                <div className='flex items-center w-full bg-white my-3 rounded-sm'>
                    <input 
                        type='text'
                        className='w-full bg-transparent border-none focus:outline-none focus:ring-transparent'
                        placeholder='Search'
                    />
                    <span className='text-xl px-2 text-maroon'>
                        <IoSearchSharp/>
                    </span>
                </div>
            </div>
            <div>
                {
                    activeRequestQuery.isLoading ?
                    (
                        <div className='border-2 rounded-b-md h-32 flex items-center justify-center'>
                            <Spinner/>
                        </div>
                    ):(
                        activeRequestQuery.data?.length > 0 ?
                        (
                            <ActiveRequestTable
                                activeRequestQuery = {activeRequestQuery}
                                token = {token}
                                serverURL = {serverURL}
                                departmentQuery = {departmentQuery}
                            />
                        ):(
                            <div className='border-2 rounded-b-md h-32 flex items-center justify-center'>
                                <p className='font-medium text-sm text-gray-600'>No request</p>
                            </div>
                        )
                    )
                }
                <div className="flex overflow-x-auto sm:justify-center">
                    <Pagination 
                        currentPage={currentPage} 
                        totalPages={totalPages} 
                        onPageChange={onPageChange} 
                    />
                </div>
            </div>
        </div>
    )
}

export default ActiveRequestList