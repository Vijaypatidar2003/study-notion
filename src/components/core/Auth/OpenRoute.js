import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom';


//this will prevent authenticated users from accessing this routes
const OpenRoute = ({children}) => {
  const {token}=useSelector((state)=>state.auth);

  if(token===null){
    return children;
  }else{
    <Navigate to="/dashboard/my-profile" />
  }
}

export default OpenRoute