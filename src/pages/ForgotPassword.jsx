import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { getPasswordResetToken } from '../services/operations/authAPI';


const ForgotPassword = () => {
    const [email,setEmail]=useState("");
    const [emailSent,setEmailSent]=useState(false);
    const dispatch=useDispatch();

    const handleOnSubmit=(e)=>{
        e.preventDefault();
        dispatch(getPasswordResetToken(email,setEmailSent));
        
    }
   
    const {loading}=useSelector((state)=>state.auth);


  return (
    <div className='text-white flex justify-center items-center '>
        {
            loading? (
                <div>Loading...</div>
            ) : (
                <div>
                    <h1 className='text-3xl text-bold'>
                        {
                            !emailSent? "Reset your Password" : "Check your Email"
                        }
                    </h1>
                    <p>
                        {
                            !emailSent? "Have no fear, we will email you instructions to reset your password. if you"+
                                        "don't have access to your email we can try account recovery." 
                                        : `We have sent the reset email to ${email}`
                        }
                    </p>
                    <form onSubmit={handleOnSubmit}>
                        {
                            !emailSent && (
                                <label>
                                    <p>Email Address <sup>*</sup></p>
                                    <input 
                                        type='email' 
                                        name='email' 
                                        value={email} 
                                        required 
                                        onChange={(e)=>setEmail(e.target.value)}
                                        placeholder='Enter your email address'
                                        className='w-full p-6 bg-richblack-600 text-richblack-5'
                                    />
                                </label>
                            )
                        }
                        <button type='submit'>
                            {
                                !emailSent ? "Reset Password" : "Resend Email"
                            }
                        </button>
                    </form>
                    <div>
                        <Link to={'/login'}>
                            <p>Back to Login</p>
                        </Link>
                    </div>
                </div>
            ) 
        }
    </div>
 
  )
}

export default ForgotPassword