import React, { useEffect,useState } from 'react'
import ReactStars from 'react-rating-stars-component'
import { ratingsEndpoints } from '../../services/apis'
import {apiConnector} from '../../services/apiconnector'
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react"


// Import Swiper styles
import "swiper/css"
import "swiper/css/free-mode"
import "swiper/css/pagination"
import "../../App.css"

// // Import required modules
import { Autoplay,Navigation,FreeMode, Pagination} from "swiper/modules"

import { FaStar } from "react-icons/fa"


const ReviewSlider = () => {
    const [reviews,setReviews] = useState([]);
    const truncateWords = 15;

    useEffect(()=>{
        const fetchAllReviews = async()=>{
          const response =  await apiConnector("GET",ratingsEndpoints.REVIEWS_DETAILS_API);
          console.log("reviews=",response);
          const {data} = response;
          if(data?.success){
            setReviews(data?.data);
            console.log("printing reviews=",reviews)
          }
        }
        fetchAllReviews();
        
    },[])
  return (
    <div className="text-white">
      <div className="my-[50px] h-[184px] max-w-maxContentTab lg:max-w-maxContent">
        <Swiper
          slidesPerView={2}
          spaceBetween={24}
          loop={true}
          freeMode={true}
          autoplay={{
            delay:2500,
          }}
          modules={[FreeMode,Pagination,Autoplay]}
          className='w-full'
        >
          {
            reviews.map((review,index)=>(
              <SwiperSlide key={index}>
                <div className="flex flex-col gap-3 bg-richblack-800 p-3 text-[14px] text-richblack-25">
                  <div className="flex items-center gap-4">
                    <img 
                      className="h-9 w-9 rounded-full object-cover"
                      src={`${review?.user?.image 
                      ? review?.user?.image 
                      : "https://api.dicebear.com/5.x/initials/svg?seed=${review?.user?.firstName} ${review?.user?.lastName}"}`}
                    />
                    <div className="flex flex-col">
                      <div className="font-semibold text-richblack-5">
                        {review?.user?.firstName} {review?.user?.lastName}
                      </div>
                      <div className="text-[12px] font-medium text-richblack-500">
                        {review?.course?.courseName}
                      </div>
                    </div>
                  </div>

                  <div>{review?.review.split(" ").length > truncateWords
                      ? `${review?.review
                          .split(" ")
                          .slice(0, truncateWords)
                          .join(" ")} ...`
                      : `${review?.review}`}
                  </div>

                  <div className="flex items-center gap-2 ">
                    <div className="font-semibold text-yellow-100">{review?.rating}</div>
                    <div>
                      <ReactStars
                        count={5}
                        value={review.rating}
                        size={20}
                        edit={false}
                        activeColor="#ffd700"
                        emptyIcon={<FaStar />}
                        fullIcon={<FaStar />}
                      />
                    </div>
                  </div>
                </div>

              </SwiperSlide>
            ))
          }

        </Swiper>
      </div>
    </div>
  )
}

export default ReviewSlider