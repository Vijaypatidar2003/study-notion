import React from "react";
import { useState } from "react";
import { AiOutlineEyeInvisible,AiOutlineEye } from "react-icons/ai";
import { Link, useNavigate } from "react-router-dom";
import {toast} from 'react-hot-toast'
import { useDispatch } from "react-redux";
import {login} from "../../../services/operations/authAPI"

const LoginForm = () => {

  const navigate=useNavigate();
  const dispatch=useDispatch();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword,setShowPassword]=useState(false);
  const {email,password}=formData;



  function changeHandler(event) {
    setFormData((prevData) => ({
      ...prevData,
      [event.target.name]: event.target.value,
    }));
  }

  function submitHandler(event){
     event.preventDefault();
     dispatch(login(email,password,navigate));   
     
  }
  return (
    <form className="flex flex-col w-full gap-y-4 mt-3" onSubmit={submitHandler}>
      <label className="w-full">
        <p className="text-[0.875rem] text-richblack-5 mb-1 leading-[1.375rem]">
          email Address <sup className="text-pink-200">*</sup>
        </p>
        <input
          type="email"
          required
          value={email}
          onChange={changeHandler}
          name="email"
          placeholder="enter email"
          className="bg-richblack-800 rounded-[0.5rem] text-richblack-5 w-full p-[8px]"
        />
      </label>

      <label className="w-full relative">
        <p className="text-[0.875rem] text-richblack-5 mb-1 leading-[1.375rem]">
          Password <sup className="text-pink-200">*</sup>
        </p>
        <input
          type={showPassword?"text":"password"}
          required
          value={password}
          onChange={changeHandler}
          name="password"
          placeholder="enter password"
          className="bg-richblack-800 rounded-[0.5rem] text-richblack-5 w-full p-[8px]"
        />
        <span onClick={()=>setShowPassword((prev)=>!prev)} className="absolute right-3 top-9">
        {
          showPassword?(<AiOutlineEyeInvisible fontSize={24} fill="#AFB2BF"/>):
          (<AiOutlineEye fontSize={24} fill="#AFB2BF"/>)
        }
      </span>
      <Link to='/forgot-password' className="absolute right-1 top-[65px] text-blue-100 text-xs">
        <p>Forgot Password</p>
      </Link>
      </label>

      <button className="bg-yellow-50 rounded-[8px] font-medium text-richblack-900 px-[12px] py-[8px] mt-3"
      >Sign in</button>
    </form>
  );
};

export default LoginForm;
