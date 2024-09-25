import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { Label, TextInput } from "flowbite-react";
import { Link, useNavigate } from 'react-router-dom';
import { ErrorToast, SuccessToast,Spinner, cookie } from '../../hooks/links';
import { useMutation } from '@tanstack/react-query';

function Login() {
    const env = import.meta.env;
    const serverURL = env.VITE_REACT_SERVER_URL;

    const { setCookie } = cookie();

    const [credentials, setCredentials] = useState({
        departmentName:'',
        password:''
    })

    const navigate = useNavigate();

    
    const mutation = useMutation({
        mutationFn: async (userCredetials) => {
          const { data } = await axios.post(`${serverURL}/osc/api/loginDepartment`, userCredetials)
          return data;
        },
    }) 
    
    const handleLogin = (e) =>{
        e.preventDefault();

        if(!credentials.departmentName || !credentials.password){
            return ErrorToast('Please complete the inputs!');
        }

        mutation.mutate({departmentName:credentials.departmentName, password:credentials.password})
    }

    const handleSetCookie = async()=>{
        await setCookie(mutation.data.departmentID,mutation.data.token);
        setCredentials(prev=>({...prev,departmentName:''}))
        setCredentials(prev=>({...prev,password:''}))
        navigate('/')
    }

    useEffect(()=>{
        if(mutation.isError){
            ErrorToast(`${mutation.error.response.data.message}`)
        }

        if(mutation.isSuccess){
            handleSetCookie()
        }
    },[mutation.isError,mutation.isSuccess])
    
  return (
    <form className="flex flex-col gap-4 ">
        {/* <h1 className='font-bold text-2xl'>Login</h1> */}
        <div>
            <div className="mb-2 block">
                <Label
                    htmlFor="department" 
                    value="Department" 
                />
            </div>
            <TextInput 
                id="department" 
                type="text"  
                placeholder='Department name'
                value={credentials.departmentName}
                onChange={(e)=>(setCredentials(prev => ({...prev,departmentName:e.target.value})))}
                required 
            />
        </div>
        <div>
            <div className="mb-2 block">
                <Label htmlFor="password1" value="Password" />
            </div>
            <TextInput 
                id="password1" 
                type="password" 
                placeholder='*************'
                value={credentials.password}
                onChange={(e)=>(setCredentials(prev => ({...prev,password:e.target.value})))}
                required 
            />
        </div>
        <button 
            className='bg-maroon drop-shadow-md py-2 rounded-sm text-white' 
            type="submit"
            onClick={(e)=>{handleLogin(e)}}
        >
            {
                mutation.isPending ?
                (<Spinner/>):('Login')
            }
        </button>
        <Link
            to="/form/forgotpassword"
            className='text-lg text-maroon text-center'
        >
            Forgot your password?
        </Link>
    </form>
  )
}

export default Login