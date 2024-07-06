import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import ReactStars from 'react-stars'
import { ImStarEmpty, ImStarFull} from "react-icons/im";
import { FaTrashCan } from "react-icons/fa6";

const RenderCartCourses = () => {
    const dispatch = useDispatch();
    const {cart,removeFromCart} = useSelector((state)=>state.cart);

    
  return (
    <div>
        {
            cart.map((course,index)=>{
                return (
                    <div>
                        <div>
                            <img src={course?.thumbnail} />
                            <div>
                                <p>{course?.courseName}</p>
                                <p>{course?.category?.name}</p>
                                <div>
                                    <span>{course?.ratingAndReviews?.rating}</span>
                                    <ReactStars
                                        count={5}
                                        edit={false}
                                        size={20}
                                        activeColor='ffd700'
                                        emptyIcon={<ImStarEmpty />}
                                        fullIcon={<ImStarFull/>}
                                    />
                                    <span>{course?.ratingAndReviews?.length}</span>
                                </div> 
                            </div>
                        </div>

                        <div>
                            <button onClick={()=>dispatch(removeFromCart(course._id))}>
                                <FaTrashCan />
                                <span>Remove</span>
                            </button>

                            <p>Rs.{course?.price}</p>
                        </div>
                    </div> 
                )
            })
        }
    </div>
  )
}

export default RenderCartCourses