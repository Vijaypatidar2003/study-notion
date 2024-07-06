import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getUserEnrolledCourses } from '../../../services/operations/profileAPI';
import ProgressBar from "@ramonak/react-progress-bar";
import { useNavigate } from 'react-router-dom';

const EnrolledCourses = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate()
    const {token}= useSelector((state)=>state.auth);
    const [enrolledCourses,setEnrolledCourses] = useState([]);


    const getEnrolledCourses = async ()=>{
        try{
            const response = await getUserEnrolledCourses(token);

            //filter published courses
            // const filterPublishedCourses = response.filter((course)=>course.status !== "Draft");
            console.log("response=",response)
            console.log("length=",response.courses);

            //set enrolledCourses
            setEnrolledCourses(response);

        }catch(error){
            console.log("Unable to fetch enrolled courses",error)
        }
    }

    useEffect( ()=>{
        getEnrolledCourses();
    },[])


  return (
    <div className='text-richblack-5'>
        <div className='text-3xl text-richblack-50'>Enrolled Courses</div>

        {
             !enrolledCourses ? (
                <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
                    <div className="spinner"></div>
              </div>
             ):
             !enrolledCourses.length ?(
                <p className="grid h-[10vh] w-full place-content-center text-richblack-5">
                    You have not enrolled in any course yet.
                </p>
            ):(
              <div className='my-8 text-richblack-5'>
                <div className='flex bg-richblack-500 rounded-t-lg'>
                    <p className="w-[45%] px-5 py-3">Course Name</p>
                    <p  className="w-1/4 px-2 py-3">Duration</p>
                    <p className="flex-1 px-2 py-3">Progress</p>
                </div>

                {
                    enrolledCourses.map((course,index)=>{
                        return (
                            <div className={`flex items-center border border-richblack-700 ${
                                index === enrolledCourses.length - 1 ? "rounded-b-lg" : "rounded-none"
                            }`}>
                                {/* Course Name section */}
                                    <div className="flex  w-[45%] cursor-pointer items-center gap-4 px-4 py-2"
                                    onClick={() => {
                                        navigate(
                                          `/view-course/${course?._id}/section/${course.courseContent?.[0]?._id}/sub-section/${course.courseContent?.[0]?.subSection?.[0]?._id}`
                                        )
                                      }}
                                    >
                                        <img 
                                             src={course.thumbnail}
                                             alt="course_img"
                                             className="h-14 w-14 rounded-lg object-cover"
                                        />
                                        <div  className="flex max-w-xs flex-col gap-2">
                                            <p className="font-semibold">{course.title}</p>
                                            <p className="text-xs text-richblack-300">{course.courseDescription}</p>
                                        </div>
                                    </div>

                                {/* course duration column */}
                                    <div className="w-1/4 px-2 py-3">
                                        {course?.totalDuration}
                                    </div>

                                {/* course progress column  */}
                                    <div className="flex w-1/5 flex-col gap-2 px-2 py-3">
                                        <p>Progress: {course?.progressPercentage || 0}%</p>
                                        <ProgressBar completed={course?.progressPercentage ||0} 
                                            height='8px' isLabelVisible={false}/>
                                    </div>

                            </div>
                        )
                    })
                }

              </div>  
            )

        }
    </div>
  )
}

export default EnrolledCourses