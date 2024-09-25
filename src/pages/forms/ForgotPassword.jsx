import React, { useState } from 'react'
import { ErrorToast } from '../../hooks/links';
import { FaArrowLeftLong } from '../../hooks/icons'
import { useNavigate } from 'react-router-dom';

function ForgotPassword() {
    const [department,setDepartment] = useState(null);
    
    const navigate = useNavigate();

    const env = import.meta.env;
    const serverURL = env.VITE_REACT_SERVER_URL;

    const handleResetPassword = ()=>{
        if(!department){
            return;
        }
        window.open(`${serverURL}/osc/form/resetdepartmentpassword?department=${department}`,'_blank', 'rel=noopener noreferrer')
    }

    return (
        <div className='flex flex-col mt-5'>
            <div className='mb-5'>
                <button onClick={()=>{navigate('/')}} className='text-gray-600 bg-gray-100 p-2 rounded-full'>
                    <FaArrowLeftLong/>
                </button>
            </div>
            <input 
                type='text'
                className='bg-gray-100 max-[900px]:w-full w-96 rounded-sm border-gray-400 border-b-[1px] border-t-0 border-x-0 focus:outline-none focus:ring-0 focus:ring-transparent focus:border-gray-500'
                placeholder='Department'
                value={department}
                onChange={(e)=>{setDepartment(e.target.value)}}
            />
            <button 
                className='bg-maroon max-[900px]:w-full w-96 mt-5 py-2 rounded-sm text-white'
                onClick={handleResetPassword}
                disabled={!department}
            >
                Reset password
            </button>
        </div>
    )
}

export default ForgotPassword