import React from "react";
import { AiOutlineEyeInvisible, AiOutlineEye } from "react-icons/ai";
import { useState } from "react";
import {toast} from 'react-hot-toast';
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {  setsignUpData} from "../../../slices/authSlice";
import { sendOtp } from "../../../services/operations/authAPI";
import {ACCOUNT_TYPE}  from '../../../utils/constants'
import Tab from "../../common/Tab";

const SignupForm = () => {

  const navigate = useNavigate();
  const dispatch=useDispatch();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [accountType, setAccountType]=useState(ACCOUNT_TYPE.STUDENT)

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);


  let {firstName,lastName,email,password,confirmPassword} = formData;

  // data  to pass to the tab component 
  const tabData=[
      { id:1,
        tabName:"Student",
        type:ACCOUNT_TYPE.STUDENT
      },
      {
        id:2,
        tabName:"Instructor",
        type:ACCOUNT_TYPE.INSTRUCTOR
      },
  ]

  

  function changeHandler(event){
    setFormData((prevData)=>(
      {
        ...prevData,
        [event.target.name]:event.target.value
      }
    ))
  }

  //submit handler
  function submitHandler(e){
    //stop default behaviour of form submission
    e.preventDefault();

    if(formData.password!==formData.confirmPassword){
      toast.error("password do not match");
      return ;
    }

    let signupData={
      ...formData,
      accountType
    }

    //setting signup data to state to be used after otp verification
    dispatch(setsignUpData(signupData));


    //send otp to the user for verification
    dispatch(sendOtp(formData.email,navigate));

    //reset state
    setFormData({
      firstName:"",
      lastName:"",
      email:"",
      password:"",
      confirmPassword:""
    })

    setAccountType("Student");

   
    toast.success("Account Created");
    
  }

  return (
    <div className="text-black">
      {/* student-instructor tab  */}
      
      <Tab tabData={tabData} field={accountType} setField={setAccountType} />

      <form onSubmit={submitHandler} className="flex flex-col justify-between gap-y-1">
        {/* firstname and lastname  */}
        <div className="flex  gap-x-2">
          <label>
            <p className="text-[0.875rem] text-richblack-5 mb-1 leading-[1.375rem]">
              First Name<sup className="text-pink-200">*</sup>
            </p>
            <input
              type="text"
              required
              name="firstName"
              onChange={changeHandler}
              placeholder="Enter name here"
              value={firstName}
              className="bg-richblack-800 rounded-[0.5rem] text-richblack-5 w-full p-[8px]"
            />
          </label>

          <label>
            <p className="text-[0.875rem] text-richblack-5 mb-1 leading-[1.375rem]">
              Last Name<sup className="text-pink-200">*</sup>
            </p>
            <input
              type="text"
              required
              name="lastName"
              onChange={changeHandler}
              placeholder="Enter last name here"
              value={lastName}
              className="bg-richblack-800 rounded-[0.5rem] text-richblack-5 w-full p-[8px]"
            />
          </label>
        </div>

        {/* email address here  */}
        <label>
          <p className="text-[0.875rem] text-richblack-5 mb-1 leading-[1.375rem]">
            Email Address<sup className="text-pink-200">*</sup>
          </p>
          <input
            type="email"
            required
            name="email"
            onChange={changeHandler}
            placeholder="Enter email here"
            value={email}
            className="bg-richblack-800 rounded-[0.5rem] text-richblack-5 w-full p-[8px]"
          />
        </label>

        {/* create password and confirm password  */}
        <div className="flex gap-x-2">
          <label className="relative">
            <p className="text-[0.875rem] text-richblack-5 mb-1 leading-[1.375rem]">
              Create Password<sup className="text-pink-200">*</sup>
            </p>
            <input
              type={showPassword ? "text" : "password"}
              required
              name="password"
              onChange={changeHandler}
              placeholder="Password"
              value={password}
              className="bg-richblack-800 rounded-[0.5rem] text-richblack-5 w-full p-[8px]"
            />
            <span onClick={() => setShowPassword((prev) => !prev)} className="absolute right-3 top-[33px]">
              {showPassword ? <AiOutlineEyeInvisible fontSize={24} fill="#AFB2BF"/> :
               <AiOutlineEye fontSize={24} fill="#AFB2BF"/>}
            </span>
          </label>

          <label className="relative">
            <p className="text-[0.875rem] text-richblack-5 mb-1 leading-[1.375rem]">
              Confirm Password<sup className="text-pink-200">*</sup>
            </p>
            <input
              type={showConfirmPassword ? "text" : "password"}
              required
              name="confirmPassword"
              onChange={changeHandler}
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              className="bg-richblack-800 rounded-[0.5rem] text-richblack-5 w-full p-[8px]"
            />
            <span onClick={() => setShowConfirmPassword((prev) => !prev)} className="absolute right-3 top-[33px]">
              {showConfirmPassword ? <AiOutlineEyeInvisible fontSize={24} fill="#AFB2BF"/> :
               <AiOutlineEye fontSize={24} fill="#AFB2BF"/>}
            </span>
          </label>
        </div>

        <button className="w-full bg-yellow-50 rounded-[8px] font-medium text-richblack-900
                           px-[12px] py-[8px] mt-3"
                type="submit"
        >
          Create Account
        </button>
      </form>
    </div>
  );
};

export default SignupForm;
