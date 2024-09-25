import React, { useEffect, useState } from 'react'
import axios from 'axios';

import { Checkbox, Label } from "flowbite-react";
import { ErrorToast, Spinner, SuccessToast, cookie } from '../../hooks/links';
import { useMutation, useQueries, useQuery } from '@tanstack/react-query';
import { ToastContainer } from 'react-toastify';

function ActiveTerm() {
    const {token,getCookie} = cookie();

    const [activeTerm, setActiveTerm] = useState({
        collegeRegularTerm:'',
        collegeAseanTerm:'',
        shsTerm:'',
    });

    const env = import.meta.env;
    const serverURL = env.VITE_REACT_SERVER_URL;

    const query = useQuery({
        queryKey:['checkActiveTerm'],
        queryFn: async()=>{
            const {data} = await axios.get(`${serverURL}/osc/api/get/checkActiveTerm`,{
                headers:{
                    Authorization:token
                }
            })

            return data;
        }
    })
    
    const mutation = useMutation({
        mutationFn:(postData) => postData !== '' ? handleSaveNewTerm(postData):handleEndTermFetrcher()
    })

    const handleSaveNewTerm = async(activeTermData)=>{

        const {data} = await axios.post(`${serverURL}/osc/api/uploadActiveTerm`,activeTermData,{
            headers:{
                Authorization:token
            }
        })

        setActiveTerm(prev =>({...prev,collegeRegularTerm:''}));
        setActiveTerm(prev =>({...prev,collegeAseanTerm:''}));
        setActiveTerm(prev =>({...prev,shsTerm:''}));

        query.refetch()

        return data;
    }

    const handleEndTermFetrcher = async()=>{
        const {data} = await axios.put(`${serverURL}/osc/api/delete/handleEndTerm`,{},{
            headers:{
                Authorization:token
            }
        })

        query.refetch()

        return data;
    }
    
    const handleEndTermCaller = () =>{
        mutation.mutate('')
    }

    const handleUploadTerm = async()=>{
        if(query.data.isActive === true){
            return ErrorToast('Already have an active term. Please End the term before you add another.');
        }
        if(!activeTerm.collegeAseanTerm || !activeTerm.collegeRegularTerm || !activeTerm.shsTerm){
            return ErrorToast('Please complete all the required field');
        }

        mutation.mutate(
            {
                term:{
                    collegeAsean:activeTerm.collegeAseanTerm,
                    collegeRegular:activeTerm.collegeRegularTerm,
                    shsTerm:activeTerm.shsTerm
                },
                isActive:true,
            }
        )
    }

    useEffect(()=>{
        const handleGetCookie = async()=>{
            await getCookie();
        }

        handleGetCookie();
    },[])

    useEffect(()=>{
        if(mutation.isError){
            ErrorToast(`${mutation.error}`)
        }else if(mutation.isSuccess){
            console.log(mutation.data)
            SuccessToast(`${mutation.data.message}`)
        }
    },[mutation.isError,mutation.isSuccess])

  return (
    <div>
        <ToastContainer/>
        <div className='mb-5'>
            <h1 className='text-gray-700 font-medium text-xl'>
                Term<span className='text-red-600'>*</span>
            </h1>
        </div>
        <div className='grid grid-cols-2 gap-2'>
            <div className="col-span-2 md:col-span-1">
                <div className="mb-2 block">
                    <label 
                        htmlFor="collegeRegular"
                        className="text-sm text-gray-600 font-medium"
                    >
                        College Regular
                    </label>
                </div>
                <input 
                    type='number'
                    className='focus:ring-transparent focus:outline-none border-x-0 border-t-0 border-gray-400 focus:border-gray-500 w-full bg-gray-100 rounded-sm'
                    placeholder='Term'
                    id='collegeRegular'
                    value={activeTerm.collegeRegularTerm}
                    onChange={(e)=>{setActiveTerm(prev => ({...prev,collegeRegularTerm:e.target.value}))}}
                    required
                />
            </div>
            <div className="col-span-2 md:col-span-1">
                <div className="mb-2 block">
                    <label 
                        htmlFor="collegeAsean"
                        className="text-sm text-gray-600 font-medium"
                    >
                        College ASEAN
                    </label>
                </div>
                <input 
                    type='number'
                    className='focus:ring-transparent focus:outline-none border-x-0 border-t-0 border-gray-400 focus:border-gray-500 w-full bg-gray-100 rounded-sm'
                    placeholder='Term'
                    id='collegeAsean'
                    value={activeTerm.collegeAseanTerm}
                    onChange={(e)=>{setActiveTerm(prev => ({...prev,collegeAseanTerm:e.target.value}))}}
                    required
                />
            </div>
            <div className="col-span-2">
                <div className="mb-2 block">
                    <label 
                        htmlFor="shs"
                        className="text-sm text-gray-600 font-medium"
                    >
                        SHS
                    </label>
                </div>
                <input 
                    type='number'
                    className='focus:ring-transparent focus:outline-none border-x-0 border-t-0 border-gray-400 focus:border-gray-500 w-full bg-gray-100 rounded-sm'
                    placeholder='Term'
                    id='shs'
                    value={activeTerm.shsTerm}
                    onChange={(e)=>{setActiveTerm(prev => ({...prev,shsTerm:e.target.value}))}}
                    required
                />
            </div>
        </div>

        <div className='mt-5 flex items-center justify-end px-3 gap-5'>
            {
                !query.isLoading ?
                (
                    query.data?.isActive === true ?
                    (
                        <button
                            className='text-maroon font-medium bg-red-200 px-5 py-1 rounded-sm'
                            onClick={handleEndTermCaller}
                        >
                            {
                                mutation.isPending ?
                                (
                                    <Spinner/>
                                ):(
                                    'End term'
                                )
                            }
                        </button>
                    ):(
                        <button 
                            className='text-maroon font-medium bg-gray-100 px-5 py-1 rounded-sm'
                            onClick={handleUploadTerm}
                        >
                            {
                                mutation.isPending ?
                                (
                                    <Spinner/>
                                ):(
                                    'Save'
                                )
                            }
                        </button>
                    )
                ):(null)
            }
        </div>
    </div>
  )
}

export default ActiveTerm