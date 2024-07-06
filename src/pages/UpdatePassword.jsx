import React from 'react'
import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useLocation,Link } from 'react-router-dom';
import { AiOutlineEyeInvisible,AiOutlineEye } from "react-icons/ai";
import { resetPassword } from '../services/operations/authAPI';


const UpdatePassword = () => {
    const dispatch=useDispatch();
    const location=useLocation();
    const [showPassword,setShowPassword]=useState(false);
    const [showConfirmPassword,setShowConfirmPassword]=useState(false);
    const {loading}=useSelector((state)=>state.auth);
    const [formData,setFormData]=useState({
        password:"",
        confirmPassword:""
    })
    
    const {password,confirmPassword}=formData;

    const handleOnChange=(e)=>{
        setFormData((prevData)=>(
            {
                ...prevData,
                [e.target.name]:e.target.value
            }
        ))
    }

    const handleOnSubmit=(e)=>{
        e.preventDefault();
        const token=location.pathname.split('/').at(-1);
        dispatch(resetPassword(password,confirmPassword,token));
    }

  return (
    <div>
        {
            loading?(
                <div>Loading...</div>
            ):(
                <div>
                    <h1>Choose New Password</h1>
                    <p>Almost done. Enter your new password and you are all set.</p>
                    <form onSubmit={handleOnSubmit}>
                        <label>
                            <p>New Password <sup>*</sup></p>
                            <input type={showPassword? "text":"password"} 
                                   name='password'
                                   required 
                                   value={password}
                                   onChange={handleOnChange}
                                   placeholder='new password'
                                   className='w-full p-6 bg-richblack-600 text-richblack-5'
                            />
                            <span onClick={() => setShowPassword((prev) => !prev)}>
                                {
                                    showPassword? (
                                            <AiOutlineEyeInvisible 
                                                fontSize={24} 
                                                fill="#AFB2BF" 
                                            />
                                       
                                    ):(
                                        
                                        <AiOutlineEye 
                                            fontSize={24} 
                                            fill="#AFB2BF"
                                        />
                                        
                                    )
                                    
                                }
                            </span>
                        </label>
                        <label>
                            <p>Confirm Password <sup>*</sup></p>
                            <input type={showConfirmPassword? "text":"password"} 
                                   name='confirmPassword'
                                   required 
                                   value={confirmPassword}
                                   onChange={handleOnChange}
                                   placeholder='confirm password'
                                   className='w-full p-6 bg-richblack-600 text-richblack-5'
                            />
                            <span onClick={() => setShowConfirmPassword((prev) => !prev)}>
                                {
                                    showConfirmPassword? (
                                            <AiOutlineEyeInvisible 
                                                fontSize={24} 
                                                fill="#AFB2BF" 
                                            />
                                       
                                    ):(
                                        
                                        <AiOutlineEye 
                                            fontSize={24} 
                                            fill="#AFB2BF"
                                        />
                                        
                                    )
                                    
                                }
                            </span>
                        </label>
                        <button type='submit'>
                            Reset Password
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

export default UpdatePassword