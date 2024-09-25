import React, { useEffect, useState } from 'react'
import { cookie, deficiencyModalStore, ErrorToast, Spinner, SuccessToast } from '../../hooks/links'
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';

function DeficiencyModal() {
    const {token,getCookie,departmentID} = cookie();
    const {isShowDeficiencyModal, clearanceID ,setDeficiencyModal,requestSetter} = deficiencyModalStore();
    const [deficiencies, setDeficiencies] = useState({
        itemsOfDeficiency:"",
        information:""
    });

    const env = import.meta.env;
    const serverURL = env.VITE_REACT_SERVER_URL;

    const mutation = useMutation({
        mutationFn: async(deficiency)=>{
            const {data} = await axios.post(`${serverURL}/osc/api/post/addDeficiency`,deficiency,{
                headers:{
                    Authorization:token
                }
            })

            handleClose();
            await requestSetter(true);
            return data;
        }
    })

    const handleClose =()=>{
        setDeficiencyModal(false,null)

        setDeficiencies(prev => ({...prev,itemsOfDeficiency:''}))
        setDeficiencies(prev => ({...prev,information:''}))
    }

    const handleSendDeficiency = (e)=>{
        e.preventDefault();

        if(!deficiencies.itemsOfDeficiency && !deficiencies.information){
            return;
        }

        mutation.mutate({
            departmentID,
            clearanceID,
            itemsOfDeficiency:deficiencies.itemsOfDeficiency,
            information:deficiencies.information
        })
    }

    useEffect(()=>{
        const handleGetToken = async()=>{
            await getCookie();
        }

        handleGetToken();
    },[])

    useEffect(()=>{
        if(mutation.isError){
            return ErrorToast(`${mutation.error.response.data.message}`)
        }else if(mutation.isSuccess){
            return SuccessToast(`Success`);
        }
    },[mutation.isError,mutation.isSuccess])

    if(!isShowDeficiencyModal || !clearanceID){
        return null;
    }
    return (
        <div className="fixed top-0 bottom-0 left-0 right-0 bg-black bg-opacity-20 z-20 flex items-center justify-center">
                <div className="relative p-4 w-full max-w-md max-h-full">
                    <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                        <div className="flex items-center justify-between p-4 md:p-5 rounded-t bg-maroon">
                            <h3 className="text-xl font-semibold text-white uppercase">
                                Edit Deficiency
                            </h3>
                        </div>

                        <div className="p-4 md:p-5">
                            <form className='flex flex-col'>
                                <label 
                                    htmlFor='deficiency'
                                    className='text-sm text-gray-700'
                                >
                                    Item of Deficiency<span className='text-red-600'>*</span>
                                </label>
                                <input 
                                    type='text'
                                    className='rounded-sm border-none focus:outline-none focus:ring-transparent bg-gray-100'
                                    value={deficiencies.itemsOfDeficiency}
                                    onChange={(e)=>{setDeficiencies(prev => ({...prev,itemsOfDeficiency:e.target.value}))}}
                                    autoFocus
                                    required
                                />
                                <label 
                                    htmlFor='deficiency'
                                    className='mt-5 text-sm text-gray-700'
                                >
                                    Additional Information
                                </label>
                                <textarea 
                                    type='text'
                                    className='rounded-sm border-none focus:outline-none focus:ring-transparent bg-gray-100 min-h-20 max-h-28 text-sm'
                                    value={deficiencies.information}
                                    onChange={(e)=>{setDeficiencies(prev => ({...prev,information:e.target.value}))}}a
                                ></textarea>
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
                                        className='uppercase text-sm font-medium' 
                                        onClick={(e)=>{handleSendDeficiency(e)}}
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

export default DeficiencyModal