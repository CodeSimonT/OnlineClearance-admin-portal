import React, { useEffect, useState } from 'react'
import { ErrorToast, Spinner, SuccessToast, cookie, editDepartmentModalStore } from '../../hooks/links'
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';

function EditDepartmentModal() {
    const {isShowEditModal,setEditModal,departmentData} = editDepartmentModalStore()
    const {token,getCookie} = cookie();
    const [credentials, setCredentials] = useState({
        department:'',
        firstName:'',
        lastName:''
    });

    const env = import.meta.env;
    const serverURL = env.VITE_REACT_SERVER_URL;
    
    const mutation = useMutation({
        mutationFn: async(updatedInfo)=>{
            const {data} = await axios.put(`${serverURL}/osc/api/handleUpdateInformation/${departmentData._id}`,updatedInfo,{
                headers:{
                    Authorization:token
                }
            })
            handleClose();
            return data;
        }
    })

    const handleClose = ()=>{
        setEditModal(false, null)
        setCredentials(prev => ({...prev,department:''}))
        setCredentials(prev => ({...prev,firstName:''}))
        setCredentials(prev => ({...prev,lastName:''}))
    }

    const handleUpdate = async(e)=>{
        e.preventDefault();

        if(credentials.department.length <= 0 && credentials.firstName.length <= 0 && credentials.lastName.length <=0){
            return;
        }

        mutation.mutate({
            firstName:credentials.firstName,
            lastName:credentials.lastName,
            department:credentials.department
        })
    }

    useEffect(()=>{
        const handleGetCookie = async()=>{
            await getCookie();
        }
        handleGetCookie()
    },[])

    useEffect(()=>{
        if(mutation.isError){
            ErrorToast(`${mutation.error}`)
        }else if(mutation.isSuccess){
            SuccessToast(`${mutation.data.message}`)
        }
    },[mutation.isError,mutation.isSuccess])

    if(!isShowEditModal || !departmentData){
        return null;
    }

  return (
    <div className="fixed top-0 bottom-0 left-0 right-0 bg-black bg-opacity-20 z-20 flex items-center justify-center">
        <div className="relative p-4 w-full max-w-md max-h-full">
            <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                <div className="flex items-center justify-between p-4 md:p-5 rounded-t bg-maroon">
                    <h3 className="text-xl font-semibold text-white uppercase">
                        Edit Department
                    </h3>
                </div>

                <div className="p-4 md:p-5">
                    <form className='flex flex-col'>
                        {/* <label 
                            htmlFor='deficiency'
                            className='text-sm text-gray-700'
                        >
                            Department
                        </label>
                        <input 
                            type='text'
                            className='rounded-sm border-none focus:outline-none focus:ring-transparent bg-gray-100'
                            autoFocus
                            value={credentials.department}
                            onChange={(e)=>{setCredentials(prev =>({...prev, department:e.target.value}))}}
                            placeholder={`${departmentData.department}`}
                        /> */}
                        <label 
                            htmlFor='deficiency'
                            className='mt-5 text-sm text-gray-700'
                        >
                            First name
                        </label>
                        <input 
                            type='text'
                            className='rounded-sm border-none focus:outline-none focus:ring-transparent bg-gray-100'
                            value={credentials.firstName}
                            onChange={(e)=>{setCredentials(prev =>({...prev, firstName:e.target.value}))}}
                            placeholder={`${departmentData.firstName}`}
                        />
                        <label 
                            htmlFor='deficiency'
                            className='mt-5 text-sm text-gray-700'
                        >
                            Last name
                        </label>
                        <input 
                            type='text'
                            className='rounded-sm border-none focus:outline-none focus:ring-transparent bg-gray-100'
                            value={credentials.lastName}
                            onChange={(e)=>{setCredentials(prev =>({...prev, lastName:e.target.value}))}}
                            placeholder={`${departmentData.lastName}`}
                        />

                        <div className='w-full mt-5 flex flex-row items-center justify-end gap-5 text-maroon'>
                            <button 
                                onClick={handleClose} 
                                className='uppercase text-sm font-medium'
                            >
                                Close
                            </button>
                            <button 
                                onClick={(e)=>{handleUpdate(e)}} 
                                className='uppercase text-sm font-medium'
                            >
                                {
                                    mutation.isPending ?
                                        (
                                            <Spinner/>
                                        ):('Save')
                                }
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div> 
  )
}

export default EditDepartmentModal