import React, { useEffect, useState } from 'react';
import { Table, Pagination } from "flowbite-react";
import { useNavigate } from 'react-router-dom';
import { TiInputChecked, LiaEditSolid, IoSearchSharp } from '../../hooks/icons';
import { Spinner, cookie, editDepartmentModalStore, newDepartmentModalStore } from '../../hooks/links';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

function DepartmentListTable() {
    const { token, getCookie } = cookie();
    const { setDepartmentModal } = newDepartmentModalStore();
    const { setEditModal } = editDepartmentModalStore();

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1); // Added state for total 
    const [search, setSearch] = useState('');

    const onPageChange = (number) => setCurrentPage(number);

    const env = import.meta.env;
    const serverURL = env.VITE_REACT_SERVER_URL;

    const { data:currentUser,isLoading,isError } = useQuery({
        queryKey:['department'],
      })

    const query = useQuery({
        queryKey: ['departmentList', currentPage], // Added currentPage as a dependency
        queryFn: async () => {
            const { data } = await axios.get(`${serverURL}/osc/api/get/all/department`, {
                headers: {
                    Authorization: token
                },
                params: {
                    page: currentPage,
                    limit: 10 // Adjust the limit as needed
                }
            });

            setTotalPages(data.totalPages); // Assuming the API response contains totalPages
            return data.departments; // Adjust this based on the actual structure of your API response
        }
    });

    useEffect(() => {
        const handleGetCookie = async () => {
            await getCookie();
        };
        handleGetCookie();
    }, []);

    return (
        <div>
            <div className="w-full bg-maroon flex flex-col rounded-t-md p-3">
                <div className='flex items-center justify-between'>
                    <h1 className='text-white font-medium text-2xl'>Department List</h1>
                    {/* <button onClick={() => { setDepartmentModal(true) }} className='bg-green-500 px-3 py-2 rounded-sm mt-3 text-white'>New Department</button> */}
                </div>
                <div className='flex items-center w-full bg-white my-3 rounded-sm'>
                    <input 
                        type='text'
                        className='w-full bg-transparent border-none focus:outline-none focus:ring-transparent'
                        placeholder='Search'
                    />
                    <span className='text-xl px-2 text-maroon'>
                        <IoSearchSharp />
                    </span>
                </div>
            </div>
            <div className="overflow-x-auto border-2 rounded-b-md">
                <Table>
                    <Table.Head>
                        <Table.HeadCell>ID</Table.HeadCell>
                        <Table.HeadCell>Department</Table.HeadCell>
                        <Table.HeadCell>Staff</Table.HeadCell>
                        <Table.HeadCell>Action</Table.HeadCell>
                    </Table.Head>
                    <Table.Body className="divide-y">
                        {
                            query.isLoading ?
                            (
                                <div className='pt-5'>
                                    {/* <Spinner /> */}
                                </div>
                            ) : (
                                query.data.map((data, index) => (
                                    <Table.Row 
                                        className="bg-white dark:border-gray-700 dark:bg-gray-800"
                                        key={index}
                                    >
                                        <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white uppercase">
                                            {data._id.slice(-4)}
                                        </Table.Cell>
                                        <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                            {data.department}
                                        </Table.Cell>
                                        <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                            {`${data.firstName} ${data.lastName}`}
                                        </Table.Cell>
                                        <Table.Cell>
                                           {
                                             currentUser?.department === "Academic" ? (
                                                <div className='flex flex-col gap-1'>
                                                    <button 
                                                        className='bg-redish text-white px-3 py-1 text-sm rounded-full drop-shadow-md flex items-center justify-center w-24'
                                                        onClick={() => { setEditModal(true, data) }}
                                                    >
                                                        <span className='gap-1'>
                                                            <LiaEditSolid />
                                                        </span>
                                                        Edit
                                                    </button>
                                                </div>
                                            ) : (
                                                <span className="whitespace-nowrap text-gray-500 text-sm font-medium">
                                                    No permission
                                                </span>
                                            )
                                           }
                                        </Table.Cell>
                                    </Table.Row>
                                ))
                            )
                        }
                    </Table.Body>
                </Table>
            </div>
            <div className="flex overflow-x-auto sm:justify-center">
                <Pagination 
                    currentPage={currentPage} 
                    totalPages={totalPages} 
                    onPageChange={onPageChange} 
                />
            </div>
        </div>
    );
}

export default DepartmentListTable;