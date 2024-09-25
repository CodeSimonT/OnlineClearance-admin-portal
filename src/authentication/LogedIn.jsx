import React from 'react'
import { Navigate } from 'react-router-dom'

const LogedIn = ({ authenticate, children }) => {
    if (!authenticate()) {
        return children
    }
  
    return <Navigate to="/" replace />
}

export default LogedIn