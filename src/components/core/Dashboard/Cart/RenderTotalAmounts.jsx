import React from 'react'
import { useSelector } from 'react-redux'
import IconBtn from '../../../common/IconBtn'

const RenderTotalAmounts = () => {
  const {total,cart} = useSelector((state)=>state.cart);

  const handleBuyCourse = ()=>{
    const courses = cart.map((course,index)=>course._id);
    console.log("Bought these course:",courses);
    //Todo api integrate that will take us to payment gateway.
  }

  return (
    <div>
      <p>Total:</p>

      <p>Rs. {total}</p>

      <IconBtn 
        text="Buy Now" 
        type="submit" 
        onclick={handleBuyCourse}
        customClasses={"w-full justify-center"}
      />

    </div>
  )
}

export default RenderTotalAmounts