import React, { useEffect, useState } from 'react'
import { TextInput,Checkbox,Label } from "flowbite-react";
import { FaLock } from '../../hooks/icons'
import { ErrorToast, Spinner, SuccessToast, cookie } from '../../hooks/links';
import { ToastContainer } from 'react-toastify';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';

function ChangePassword() {
    const {departmentID,token,getCookie} = cookie();

    const [isChecked, setIsChecked] = useState(false);
    const [password, setPassword] = useState('');
    const [confirmPass, setConfirmPass] = useState('');

    const env = import.meta.env;
    const serverURL = env.VITE_REACT_SERVER_URL;

    const mutation = useMutation({
        mutationFn: async (credentials) => {
            const { data } = await axios.put(`${serverURL}/osc/api/updatepassword`, credentials, {
                headers: {
                    Authorization: token,
                },
            });

            setIsChecked(false)
            setPassword('')
            setConfirmPass('')
            return data;
        },
    })

    const handleUpdatepassword = async()=>{
        if(!isChecked || password.length <= 0 || confirmPass.length <= 0){
            return;
        }

        if(password !== confirmPass){
            return ErrorToast('Password not match!');
        }

        // Proceed with mutation if email is valid
        mutation.mutate({ password, userID: departmentID });
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
            SuccessToast(`${mutation.data.message}`)
        }
    },[mutation.isError,mutation.isSuccess])

    return (
        <div className="w-full mt-5">
            <ToastContainer/>
            <div>
                <div className={`flex items-center w-full border-x-0 border-t-0 border-b-[1px] border-gray-400 bg-gray-100 rounded-sm ${!isChecked ? 'opacity-50':'opacity-100'}`}>
                    <span className='text-xl ps-2 text-gray-600'>
                        <FaLock/>
                    </span>
                    <input
                        id="password" 
                        className='focus:ring-0 focus:outline-none w-full border-none bg-transparent disabled:cursor-not-allowed'
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e)=>{setPassword(e.target.value)}}
                        disabled={!isChecked}
                        required 
                    />
                </div>

                <div className={`mt-5 flex items-center w-full border-x-0 border-t-0 border-b-[1px] border-gray-400 bg-gray-100 rounded-sm ${!isChecked ? 'opacity-50':'opacity-100'}`}>
                    <span className='text-xl ps-2 text-gray-600'>
                        <FaLock/>
                    </span>
                    <input
                        id="confirmPass" 
                        className='focus:ring-0 focus:outline-none w-full border-none bg-transparent disabled:cursor-not-allowed'
                        type="password"
                        placeholder="Confirm password"
                        value={confirmPass}
                        onChange={(e)=>{setConfirmPass(e.target.value)}}
                        disabled={!isChecked}
                        required 
                    />
                </div>
            </div>
            <div className='mt-5 flex flex-row items-center justify-between'>
            <div className='flex items-center gap-1'>
                    <Checkbox id="agree" className='checked:bg-maroon'checked={isChecked} onChange={(e) => { setIsChecked(e.target.checked)}}/>
                    <Label htmlFor="agree" className="flex">
                        Change password
                    </Label>
                </div>
                <div className='flex items-center gap-1'>
                    <button 
                        className="bg-gray-100 px-4 py-1 text-maroon font-medium rounded-sm disabled:opacity-50"
                        onClick={handleUpdatepassword}
                        disabled={!isChecked}
                    >
                        {
                            mutation.isPending ?
                            (
                                <Spinner/>
                            ):('Update')
                        }
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ChangePassword