import React, { useEffect, useState } from 'react';
import { Table } from "flowbite-react";
import { TiInputChecked, LiaEditSolid } from '../../hooks/icons';
import { deficiencyModalStore, ErrorToast, Spinner, SuccessToast } from '../../hooks/links';
import axios from 'axios';
import { useMutation } from '@tanstack/react-query';

function ActiveRequestTable({ activeRequestQuery, token, serverURL, departmentQuery }) {
    const { isShowDeficiencyModal, setDeficiencyModal,sentRequest,requestSetter } = deficiencyModalStore();
    const [deficiencies, setDeficiencies] = useState({});

    const requestMutation = useMutation({
        mutationFn:async(ids)=>{
            const {data} = await axios.post(`${serverURL}/osc/api/post/approveRequest`,ids,{
                headers:{
                    Authorization:token
                }
            })
            requestSetter(true)
            return data;
        }
    })
    
    const getDeficiency = async (id) => {
        try {
            const { data } = await axios.get(`${serverURL}/osc/api/get/deficiency`, {
                headers: {
                    Authorization: token
                },
                params: {
                    id
                }
            });
            setDeficiencies(data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleApproveRequest =(clearanceID)=>{
        if(!clearanceID){
            return ErrorToast('Clearance id not found')
        }

        requestMutation.mutate({
            clearanceID,
            departmentID:departmentQuery.data._id
        })

    }

    useEffect(() => {
        activeRequestQuery.data.forEach((data) => {
            getDeficiency(data.clearanceID);
        });

        requestSetter(false)
    }, [activeRequestQuery.data,sentRequest]);

    useEffect(()=>{
        if(requestMutation.isError){
            return ErrorToast(`${requestMutation.error.response.data.message}`)
        }else if(requestMutation.isSuccess){
            activeRequestQuery.refetch()
            return SuccessToast('Success')
        }
        
    },[requestMutation.isSuccess,requestMutation.isError])
    return (
        <div className="overflow-x-auto border-2 rounded-b-md">
            <Table>
                <Table.Head>
                    <Table.HeadCell>#</Table.HeadCell>
                    <Table.HeadCell>USN</Table.HeadCell>
                    <Table.HeadCell>Student</Table.HeadCell>
                    <Table.HeadCell>Term</Table.HeadCell>
                    <Table.HeadCell>Status</Table.HeadCell>
                    <Table.HeadCell>Deficiency</Table.HeadCell>
                    <Table.HeadCell>Action</Table.HeadCell>
                </Table.Head>
                <Table.Body className="divide-y">
                    {activeRequestQuery.data.map((data) => (
                        <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800" key={data.clearanceID}>
                            <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                {data.clearanceID.slice(-4)}
                            </Table.Cell>
                            <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                {data.usn}
                            </Table.Cell>
                            <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                {data.requestorName}
                            </Table.Cell>
                            <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                {data.term}
                            </Table.Cell>
                            <Table.Cell>
                                <span className="inline-flex items-center bg-orange-300 text-orange-800 text-xs font-medium px-2.5 py-0.5 rounded-full w-22">
                                    <span className="w-2 h-2 me-1 bg-orange-500 rounded-full"></span>
                                    {data.status}
                                </span>
                            </Table.Cell>
                            <Table.Cell>
                                {Array.isArray(deficiencies) && departmentQuery.data ? (
                                    deficiencies.find(data => data.departmentName === departmentQuery.data.department).deficiency ? (
                                        <span className="inline-flex items-center bg-red-300 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full w-22">
                                            {deficiencies.find(data => data.departmentName === departmentQuery.data.department).deficiency}
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center bg-gray-300 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded-full w-22">
                                            <span className="w-2 h-2 me-1 bg-gray-500 rounded-full"></span>
                                            No deficiency
                                        </span>
                                    )
                                ) : (
                                    <span className="inline-flex items-center bg-gray-300 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded-full w-22">
                                        <span className="w-2 h-2 me-1 bg-gray-500 rounded-full"></span>
                                        Loading...
                                    </span>
                                )}
                            </Table.Cell>

                            <Table.Cell>
                                <div className='flex flex-col gap-1'>
                                    <button 
                                        className='bg-green-500 text-white w-32 py-1 text-sm rounded-full drop-shadow-md flex items-center justify-center'
                                        onClick={()=>{handleApproveRequest(data.clearanceID)}}
                                    >
                                        {
                                            requestMutation.isPending ?
                                            (
                                                <Spinner/>
                                            ):(
                                                <>
                                                    <span className='gap-1'>
                                                        <TiInputChecked />
                                                    </span>
                                                    Approve
                                                </>
                                            )
                                        }
                                    </button>
                                    <button
                                        className='bg-redish text-white w-32 py-1 text-sm rounded-full drop-shadow-md flex items-center justify-center'
                                        onClick={() => { setDeficiencyModal(true,data.clearanceID); }}
                                    >
                                        <span className='gap-1'>
                                            <LiaEditSolid />
                                        </span>
                                        Edit
                                    </button>
                                </div>
                            </Table.Cell>
                        </Table.Row>
                    ))}
                </Table.Body>
            </Table>
        </div>
    );
}

export default ActiveRequestTable;