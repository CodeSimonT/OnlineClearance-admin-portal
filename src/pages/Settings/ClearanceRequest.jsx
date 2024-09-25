import React, { useState } from 'react'

function ClearanceRequest() {
    const env = import.meta.env;
    const serverURL = env.VITE_REACT_SERVER_URL;

    const [clearanceID, setClearanceID] = useState('');
    
    const handleSendRequest = ()=>{
        window.open(`${serverURL}/clearance/preview?clearanceID=${clearanceID}`,'_blank', 'rel=noopener noreferrer')
    }
  return (
    <div className='w-full flex flex-col'>
        <div className="mb-2 block">
            <label 
                htmlFor="clearanceID"
                className="text-sm text-gray-600 font-medium"
            >
                Clearance ID
            </label>
        </div>
        <input 
            type='text'
            className='focus:ring-transparent focus:outline-none border-x-0 border-t-0 border-gray-400 focus:border-gray-500 w-full bg-gray-100 rounded-sm'
            placeholder='ID'
            id='clearanceID'
            value={clearanceID}
            onChange={(e)=>{setClearanceID(e.target.value)}}
            required
        />
        <div className='mt-10 flex items-center justify-end px-3'>
            <button onClick={handleSendRequest} className='text-maroon font-medium bg-gray-100 px-5 py-1 rounded-sm'>
                Request
            </button>
        </div>
    </div>
  )
}

export default ClearanceRequest