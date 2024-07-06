import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import copy from 'copy-to-clipboard';
import toast from 'react-hot-toast';
import { ACCOUNT_TYPE } from '../../../utils/constants';
import { addToCart } from '../../../slices/cartSlice';

const CourseDetailsCard = ({course,setConfirmationModal,handleBuyCourse}) => {

    const {user} = useSelector((state)=>state.profile);
    const {token} = useSelector((state)=>state.auth);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(()=>{
        {console.log("course",course)}
    },[])

    const {
        thumbnail:thumbnailImage,
        price:currentPrice,
        
    } = course;

    const handleAddToCart = ()=>{
        if(user && user?.accountType===ACCOUNT_TYPE.INSTRUCTOR){
            toast.error("You are an Instructor. you can't buy a course");
            return;
        }
        if(token){
            dispatch(addToCart(course));
            console.log("add to cart")
            return;
        }
        setConfirmationModal({
            text1:"You are not logged in",
            text2:"Please login to add to cart",
            btn1Text:"Login",
            btn2Text:"Cancel",
            btn1Handler:()=>navigate("/login"),
            btn2Handler:()=>setConfirmationModal(null)
        })

    }
    const handleShare = ()=>{
        copy(window.location.href);
        toast.success("Link copied to clipboard")
    }
  return (
    <div className={`flex flex-col gap-4 rounded-md bg-richblack-700 p-4 text-richblack-5
    border border-richblack-800 border-[1px] border-rounded`}>
      
        <img
            src={thumbnailImage}
            alt='Thumbnail Image'
            className="max-h-[250px] min-h-[180px] w-[400px] overflow-hidden rounded-2xl object-cover md:max-w-full"
        />
        <div className='px-4'>
        <div className="space-x-3 pb-4 text-3xl font-semibold">
                Rs. {currentPrice}
            </div>
            <div className='flex flex-col gap-y-4'>
                <button 
                    onClick={user && course?.studentsEnrolled.includes(user._id) 
                            ? ()=>navigate("/dashboard/enrolled-courses")
                            : handleBuyCourse}
                    className='bg-yellow-400 py-2 w-full text-richblack-900 font-bold'
                >
                    {user && course?.studentsEnrolled.includes(user?._id) ? "Go to Course" : "Buy Now"}
                </button>

                {
                    (!course.studentsEnrolled.includes(user?._id) )&& (
                        <button 
                            onClick={handleAddToCart} 
                            className='bg-richblack-200 py-2 w-full text-richblack-900 font-bold'>
                                Add To Cart
                        </button>
                    )
                }
            </div>
            <div>
                <p className="pb-3 pt-6 text-center text-sm text-richblack-25">30 days money back guarantee</p>
                <p className={`my-2 text-xl font-semibold `}>This course includes:</p>
                <div className='flex flex-col gap-y-3'>
                    {
                        // course?.instructions.map((item,index)=>(
                        //     <p>
                        //         <span>{item}</span>
                        //     </p>
                        // ))
                    }

                </div>
            </div>
            <div>
                <button
                    onClick={handleShare}
                    className='mx-auto flex items-center gap-2 p-6 text-yellow-200'
                >
                    Share
                </button>
            </div>
        </div>
    </div>
  )
}

export default CourseDetailsCard