import React ,{useState} from 'react'
import {useForm} from 'react-hook-form'
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai"
import { useNavigate } from 'react-router-dom';
import IconBtn from '../../../common/IconBtn';
import { useDispatch, useSelector } from 'react-redux';
import {changePassword} from '../../../../services/operations/SettingsAPI'

const UpdatePassword = () => {
    const [showOldPassword,setShowOldPassword] = useState(false);
    const [showNewPassword,setShowNewPassword] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const {token} = useSelector((state)=>state.auth)

    const submitPasswordForm = async (data) =>{
        try{
            console.log("password data = ",data);
            await dispatch(changePassword(token,data));
        }catch(error){
            console.log("ERROR MESSAGE - ", error.message)
        }
    }

    const {
        handleSubmit ,
        register,
        formState:{errors},
    } = useForm();

  return (
    <>
    <form onSubmit={handleSubmit(submitPasswordForm)}>
        <div className='flex flex-col justify-between p-8 px-12 border-[1px] border-richblack-700 bg-richblack-800'>

            <h1 className='font-semibold text-lg text-richblack-5'>Password</h1>
            <div className='flex flex-col lg:flex-row gap-5'>
                <div className='relative flex flex-col gap-2 lg:w-[48%]'>
                    <label htmlFor='oldPassword'>Current Password</label>
                    <input 
                        type={showOldPassword?"text" : "password"}
                        id='oldPassword'
                        name='oldPassword'
                        className='form-style text-black'
                        placeholder='Enter Current Password'
                        {...register("oldPassword",{
                            value:true,
                            message:"Please enter Password"
                        })}
                    />
                    <span onClick={()=>setShowOldPassword((prev)=>!prev)}
                        className='absolute right-2 bottom-1 text-black cursor-pointer z-[10]'
                    >
                        {
                            showOldPassword ? 
                            <AiOutlineEyeInvisible/>
                            :<AiOutlineEye/>
                        }
                    </span>
                    {errors.password && 
                    <span>
                        {errors.password.message}
                    </span>}
                </div>
                <div className='relative flex flex-col gap-2 lg:w-[48%]'>
                    <label htmlFor='newPassword'>Confirm Password</label>
                        <input 
                            type={showNewPassword?"text":"password"}
                            id='newPassword'
                            name='newPassword'
                            className='form-style text-black'
                            {...register("newPassword",{
                                value:true,
                                message:"Please enter New Password"
                            })}
                        />
                        <span onClick={()=>(setShowNewPassword((prev)=>!prev))}
                            className='absolute right-2 bottom-1 text-black cursor-pointer z-[10]'
                        >
                            {
                                showNewPassword ?
                                <AiOutlineEyeInvisible/>
                                :<AiOutlineEye/>
                            }
                        </span>
                        {errors.confirmPassword && 
                        <span>
                            {errors.confirmPassword.message}
                        </span>}
                </div>

            </div>
        </div>

        <div className='flex justify-end my-3 gap-2'>
            <button 
                onClick={()=>{
                navigate("/dashboard/my-profile");
                }} 
                className='py-2 px-8 bg-richblack-500 border-[1px] rounded-md border-richblack-200 font-semibold
                border-box transition-all duration-300 hover:scale-110'
            >    
                Cancel
            </button>

            <IconBtn text="Update" type="submit"/>

        </div>
    </form>
        
    </>
  )
}

export default UpdatePassword