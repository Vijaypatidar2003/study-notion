import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import { apiConnector } from '../../../services/apiconnector';
import { contactusEndpoint } from '../../../services/apis';
import CountryCode from '../../../data/countrycode.json'

const ContactUsForm = () => {
    const [loading,setLoading]=useState();

    const {
        register,
        handleSubmit,
        reset,
        formState:{errors, isSubmitSuccessful}
    } = useForm();

    const submitContactForm = async (data) => {
        console.log("Form Data - ", data)
        try {
          setLoading(true)
          const res = await apiConnector(
            "POST",
            contactusEndpoint.CONTACT_US_API,
            data
          )
          // console.log("Email Res - ", res)
          setLoading(false)
        } catch (error) {
          console.log("ERROR MESSAGE - ", error.message)
          setLoading(false)
        }
      }
    useEffect(()=>{
        if(isSubmitSuccessful){
            reset({
                email:"",
                firstname:"",
                lastname:"",
                message:"",
                phoneNo:""
            })
        }
    },[reset,isSubmitSuccessful])
  return (
    <form onSubmit={handleSubmit(submitContactForm)}>
        
        <div className="flex flex-col gap-5 " >

            {/* name  */}
            <div className='flex gap-5 lg:flex-row'>
                {/* firstname  */}
                <div className="flex flex-col gap-1 lg:w-[48%]">
                    <label htmlFor='firstname'>First Name:</label>
                    <input type='text'
                        name='firstname'
                        id='firstname'
                        placeholder='Enter First Name'
                        className='text-black'
                        {...register("firstname",{required:true})}
                    />
                    {
                        errors.firstname && 
                        <span className="-mt-1 text-[12px] text-yellow-100">
                            Please enter firstName
                         </span>
                    }
                </div>

                {/* lastname */}
                <div className="flex flex-col gap-1 lg:w-[48%]">
                    <label htmlFor='lastname'>Last Name:</label>
                    <input type='text'
                        name='lastname'
                        id='lastname'
                        placeholder='Enter Last Name'
                        className='text-black'
                        {...register("lastname")}
                    />
                </div>
            </div>

            {/* email  */}
            <div className='flex flex-col gap-1'>
                <label htmlFor='email'>Email Address:</label>
                <input type='email'
                    name='email'
                    id='email'
                    placeholder='Enter Your Email'
                    className='text-black'
                    {...register("email",{required:true})}
                />
                {
                    errors.email && (
                        <span className="-mt-1 text-[12px] text-yellow-100">
                            Please Enter your Email Address
                        </span>
                    )
                }
            </div>

            {/* phone number  */}
            <div className='flex flex-col gap-1'>

                <label htmlFor='phonenumber'>Phone Number:</label>
                <div className='flex flex-row gap-5 '>
                {/* dropdown */}
                    <div  className="flex w-[81px] flex-col gap-2">
                        <select name='dropdown' 
                                id='dropdown' 
                                {...register("countrycode", {required:true})}
                                className='text-richblack-800 form-style mt-[2px]'
                        >
                            {
                                CountryCode.map((country,index)=>{
                                    return (<option value={country.code} key={index}>
                                                {country.code}-{country.country}
                                            </option>)
                                })
                            }
                        </select>
                    </div>

                    {/* phone no  */}
                    <div className="flex w-[calc(100%-90px)] flex-col gap-2">
                        <input type='phonenumber'
                               name='phonenumber'
                               id='phonenumber'
                               placeholder='1234 5678 90'
                               className='text-black'
                               {...register("phoneNo",
                                            {
                                                required:{value:true, message:"please enter mobile no."},
                                                maxLength:{value:10 , message:"Invalid phone no."},
                                                minLength:{value:8 , message:"Invalid phone no."}
                                            })}
                        />
                    </div>

                </div>

            </div>
            {
                errors.phoneNo && (
                    <span className="-mt-1 text-[12px] text-yellow-100">
                        {errors.phoneNo.message}
                    </span>
                )
            }

            {/* message  */}
            <div className='flex flex-col gap-1'>
                <label htmlFor='message'>Message</label>
                <textarea 
                    name='message'
                    id='message'
                    className='text-black'
                    placeholder='Enter Your Message here'
                    cols={30}
                    rows={7}
                    
                    {...register("message",{required:true})}
                />
                {
                    errors.message && (
                        <span className="-mt-1 text-[12px] text-yellow-100">
                            please enter your message
                        </span>
                    )
                }
            </div>

            <button type='submit' 
                    className='rounded-md bg-yellow-50 text-black 
                              p-1 text-center text-[16px] font-bold '>
                Send Message 
            </button>
        </div>
        
    </form>
  )
}

export default ContactUsForm