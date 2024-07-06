import React from 'react'
import { useSelector } from 'react-redux'
import RenderCartCourses from './RenderCartCourses';
import RenderTotalAmounts from './RenderTotalAmounts';

const Cart = () => {
    const {total,totalItems} = useSelector((state)=>state.cart); 
  return (
    <div>
        <h1  className="mb-14 text-3xl font-medium text-richblack-5">My Cart</h1>

        <p  className="border-b border-b-richblack-400 pb-2 font-semibold text-richblack-400">{totalItems} Courses in Cart</p>

        {
            total>0 ?
            (
                <div className='mt-8 flex flex-col-reverse lg:flex-row items-start gap-x-6 gap-y-10'>
                    <RenderCartCourses/>
                    <RenderTotalAmounts />
                </div>
            ):(
                <div className='grid h-[50vh] place-items-center text-3xl font-semibold   text-richblack-5'>
                    Cart is Empty 
                </div>
            )
        }
    </div>
  )
}

export default Cart