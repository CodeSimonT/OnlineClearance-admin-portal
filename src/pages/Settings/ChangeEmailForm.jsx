import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { TextInput,Checkbox,Label } from "flowbite-react";
import { MdEmail } from '../../hooks/icons'
import { ErrorToast, Spinner, SuccessToast, cookie } from '../../hooks/links';
import { useMutation } from '@tanstack/react-query';
import { ToastContainer } from 'react-toastify';


function ChangeEmailForm() {
    const {departmentID,token,getCookie} = cookie();

    const [isChecked, setIsChecked] = useState(false);
    const [email, setEmail] = useState('');

    const env = import.meta.env;
    const serverURL = env.VITE_REACT_SERVER_URL;

    const mutation = useMutation({
        mutationFn: async (credentials) => {
            const { data } = await axios.post(`${serverURL}/osc/api/changeEmail`, credentials, {
                headers: {
                    Authorization: token,
                },
            });

            setIsChecked(false)
            setEmail('')
            return data;
        },
    });

    const isValidEmail = (email) => {
        // Regular expression to validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };
    
    const handleUpdateEmail = async () => {
        if (!isChecked || email.length === 0) {
            return;
        }
    
        if (!isValidEmail(email)) {
            ErrorToast('Please enter a valid email address.');
            return;
        }
    
        // Proceed with mutation if email is valid
        mutation.mutate({ email, userID: departmentID });
    };

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
            <div className={`flex items-center w-full border-x-0 border-t-0 border-b-[1px] border-gray-400 bg-gray-100 rounded-sm ${!isChecked ? 'opacity-50':'opacity-100'}`}>
                <span className='text-xl ps-2 text-gray-600'>
                    <MdEmail/>
                </span>
                <input
                    id="email4" 
                    className='focus:ring-0 focus:outline-none w-full border-none bg-transparent disabled:cursor-not-allowed'
                    type="email"
                    placeholder="name@gmail.com"
                    value={email}
                    onChange={(e)=>{setEmail(e.target.value)}}
                    disabled={!isChecked}
                    required 
                />
            </div>
            <div className='mt-5 flex flex-row items-center justify-between'>
                <div className='flex items-center gap-1'>
                    <Checkbox id="agree" className='checked:bg-maroon'checked={isChecked} onChange={(e) => { setIsChecked(e.target.checked)}}/>
                    <Label htmlFor="agree" className="flex">
                        Change email
                    </Label>
                </div>
                <div className='flex items-center gap-1'>
                    <button 
                        className="bg-gray-100 px-4 py-1 text-maroon font-medium rounded-sm disabled:opacity-50"
                        onClick={handleUpdateEmail}
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

export default ChangeEmailForm