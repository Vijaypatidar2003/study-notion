import React from 'react'
import Course_Card from './Course_Card'
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react"

// Import Swiper styles
import "swiper/css"
import "swiper/css/free-mode"
import "swiper/css/pagination"

// Import required modules
import { FreeMode, Pagination } from "swiper/modules"



const Course_Slider = ({Courses}) => {
  
  return (
    <div>
      {Courses?.length 
      ? (<Swiper
          slidesPerView={1}
          spaceBetween={25}
          loop={true}
          modules={[FreeMode, Pagination]}
          breakpoints={{
            1024: {
              slidesPerView:2,
            },
          }}
          className="max-h-[30rem]"
        >
          {
            Courses?.map((course,index)=>(
              <SwiperSlide key={index}>
                <Course_Card course={course} height={`h-[250px]`}/>
              </SwiperSlide>
            ))
          }
        </Swiper>) 
      : (<div className="text-xl text-richblack-5">No Courses Found</div>)
      }
    </div>
  )
}

export default Course_Slider