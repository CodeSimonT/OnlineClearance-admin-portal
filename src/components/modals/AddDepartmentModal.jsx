import React, { useEffect, useState } from 'react'
import { ErrorToast, Spinner, SuccessToast, cookie, newDepartmentModalStore } from '../../hooks/links'
import { skipToken, useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { ToastContainer } from 'react-toastify';

function AddDepartmentModal() {
    const { isShowDepartmentModal,setDepartmentModal } = newDepartmentModalStore();
    const {token,getCookie} = cookie();

    const env = import.meta.env;
    const serverURL = env.VITE_REACT_SERVER_URL;

    const [credentials, setCredentials] = useState({
        department:'',
        firstName:'',
        lastName:'',
        email:''
    });

    const handleClose = ()=>{
        setDepartmentModal(false)
        setCredentials(prev => ({...prev,department:''}))
        setCredentials(prev => ({...prev,firstName:''}))
        setCredentials(prev => ({...prev,lastName:''}))
        setCredentials(prev => ({...prev,email:''}))
    }

    const mutation = useMutation({
        mutationFn: async(newDepartment)=>{
            const {data} = await axios.post(`${serverURL}/osc/api/registerDepartment`,newDepartment,{
                headers:{
                    Authorization:token
                }
            })
            handleClose();
            return data;
        }
    })

    const handleAddNewDepartment = async(e)=>{
        e.preventDefault();

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if(credentials.department.length <= 0 || credentials.firstName.length <= 0 || credentials.lastName.length <= 0 || credentials.email.length <= 0){
            return ErrorToast('Please complete the informations');
        }

        if (!emailRegex.test(credentials.email)) {
            ErrorToast('Invalid email address');
            return;
        }

        mutation.mutate(credentials)
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

    if(!isShowDepartmentModal){
        return null;
    }

  return (
    <div className="fixed top-0 bottom-0 left-0 right-0 bg-black bg-opacity-20 z-20 flex items-center justify-center">
        <ToastContainer/>
        <div className="relative p-4 w-full max-w-md max-h-full">
            <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                <div className="flex items-center justify-between p-4 md:p-5 rounded-t bg-maroon">
                    <h3 className="text-xl font-semibold text-white uppercase">
                        New Department
                    </h3>
                </div>

                <div className="p-4 md:p-5">
                    <form className='flex flex-col'>
                        <label 
                            htmlFor='deficiency'
                            className='text-sm text-gray-700'
                        >
                            Department<span className='text-red-600'>*</span>
                        </label>
                        <input 
                            type='text'
                            className='rounded-sm border-none focus:outline-none focus:ring-transparent bg-gray-100'
                            autoFocus
                            value={credentials.department}
                            onChange={(e)=>{setCredentials(prev =>({...prev, department:e.target.value}))}}
                            required
                        />
                        <label 
                            htmlFor='deficiency'
                            className='mt-5 text-sm text-gray-700'
                        >
                            First name<span className='text-red-600'>*</span>
                        </label>
                        <input 
                            type='text'
                            className='rounded-sm border-none focus:outline-none focus:ring-transparent bg-gray-100'
                            value={credentials.firstName}
                            onChange={(e)=>{setCredentials(prev =>({...prev, firstName:e.target.value}))}}
                            required
                        />
                        <label 
                            htmlFor='deficiency'
                            className='mt-5 text-sm text-gray-700'
                        >
                            Last name<span className='text-red-600'>*</span>
                        </label>
                        <input 
                            type='text'
                            className='rounded-sm border-none focus:outline-none focus:ring-transparent bg-gray-100'
                            value={credentials.lastName}
                            onChange={(e)=>{setCredentials(prev =>({...prev, lastName:e.target.value}))}}
                            required
                        />

                        <label 
                            htmlFor='deficiency'
                            className='mt-5 text-sm text-gray-700'
                        >
                            Email<span className='text-red-600'>*</span>
                        </label>
                        <input 
                            type='email'
                            className='rounded-sm border-none focus:outline-none focus:ring-transparent bg-gray-100'
                            value={credentials.email}
                            onChange={(e)=>{setCredentials(prev =>({...prev, email:e.target.value}))}}
                            required
                        />

                        <div className='my-5'>
                            <p className='text-sm text-gray-500'><span className='text-red-600'>*</span>indicates required field</p>
                        </div>

                        <div className='w-full flex flex-row items-center justify-end gap-5 text-maroon'>
                            <button 
                                onClick={handleClose} 
                                className='uppercase text-sm font-medium'
                            >
                                Close
                            </button>
                            <button 
                                onClick={(e)=>{handleAddNewDepartment(e)}} 
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

export default AddDepartmentModal