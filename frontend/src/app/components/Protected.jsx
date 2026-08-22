import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router';

const Protected = ({children}) => {

    const user = useSelector(state => state.authReducer.user)
    const loading = useSelector(state => state.authReducer.loading);
    

    if(loading){
        return <div>Loading.....</div>
    }

    if(!user){
  
        return <Navigate to='/login' replace />
        
    }


  return (
     children
  )
}

export default Protected