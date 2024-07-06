import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom'
import { fetchCourseDetails } from '../services/operations/courseDetailsAPI';
import getAvgRating from '../utils/avgRating'
import ReactMarkdown from "react-markdown";
import Error from '../pages/Error'
import ConfirmationModal from '../components/common/ConfirmationModal'
import RatingStars from '../components/common/RatingStars';
import {formatDate} from '../services/formatDate'
import CourseDetailsCard from '../components/core/Course/CourseDetailsCard';
import CourseAccordionBar from '../components/core/Course/CourseAccordionBar';
import Footer from '../components/common/Footer'
import { buyCourse } from '../services/operations/studentFeaturesAPI';

const CourseDetails = () => {

    const {courseId} = useParams();
    const {token} = useSelector((state)=>state.auth);
    const {user} = useSelector((state)=>state.profile);
    const {loading} = useSelector((state)=>state.profile);
    const dispatch = useDispatch();
    const navigate = useNavigate();


    const [confirmationModal,setConfirmationModal] = useState(null);

    const [courseData,setCourseData] = useState(null);
    const [isActive,setIsActive] = useState(Array(0));

    const handleActive = (id)=>{
        setIsActive(
            !isActive.includes(id)
            ? isActive.concat(id)
            : isActive.filter((e)=>e!=id)
        )
    }
    
    //fetch the course details whenever courseId changes in the url
    useEffect( ()=>{
        const getCourseFullDetails = async ()=>{
            try{
                const result = await fetchCourseDetails(courseId);
                console.log("result=",result)
                setCourseData(result);
                // console.log("courseData=",courseData)
    
            }catch(error){
                console.log("course details couldn't fetch")
            }
        }
        getCourseFullDetails();

    },[courseId]);

    const [avgReviewCount,setAvgReviewCount] = useState(0);

    //fetch course rating and reviews whenever course changes
    // useEffect(()=>{
    //     console.log("courseData=",courseData)
    //     console.log("c",courseData?.data?.courseDetails.ratingAndReviews)
       
    //     const count = getAvgRating(courseData?.data?.courseDetails.ratingAndReviews);
    //     console.log("count=",count)
    //     setAvgReviewCount(count);

    // },[courseData]);

    //calculate total lectures
    const [totalNoOfLectures,setTotalNoOfLectures] = useState(0);

    useEffect(()=>{
        let lectures = 0;
        courseData?.data?.courseDetails?.courseContent.forEach((section)=>{
            lectures+=section?.subSection?.length||0;
        })

        setTotalNoOfLectures(lectures);

    },[courseData]);

    const handleBuyCourse = ()=>{
        if(token){
             buyCourse(token,[courseId],user,navigate,dispatch);
            return;
        }
        setConfirmationModal({
            text1:"You are not logged in",
            text2:"Please login to purchase the course",
            btn1Text:"Login",
            btn2Text:"Cancel",
            btn1Handler:()=>navigate("/login"),
            btn2Handler:()=>setConfirmationModal(null),
        })
    }

    if(loading||!courseData){
        return <div>Loading...</div>
    }

    if(!courseData.success){
        return  <div>
                    <Error/>
                </div>
    }

    const {

        courseName,
        courseDescription,
        thumbnail,
        price,
        whatYouWillLearn,
        courseContent,
        ratingAndReviews,
        instructor,
        studentsEnrolled,
        createdAt,
      } = courseData?.data?.courseDetails;
  return (
    <div className='text-white flex flex-col bg-richblack-900 min-h-screen'>
        {/* Hero Section  */}
        <div className='relative flex flex-col justify-start bg-richblack-700 min-h-[300px]
            pl-20 pt-20 gap-y-2
        '>
            <p className="text-4xl font-bold text-richblack-5 sm:text-[42px]">{courseName}</p>
            <p className={`text-richblack-200`}>{courseDescription}</p>
            <div className='flex gap-x-2'>
                <span>{avgReviewCount}</span>
                <RatingStars Review_Count={avgReviewCount} Star_Size={24}/>
                <span>{`(${ratingAndReviews.length} reviews)`}</span>
                <span>{`(${studentsEnrolled.length} students enrolled)`}</span>
            </div>
            <div>
                <p>Created By {instructor.firstName} {instructor.lastName}</p>
            </div>
            <div className='flex gap-x-3'>
                <p>Created at {formatDate(createdAt)}</p>
                <p>{" "} English</p>
            </div>

            {/* course details card  */}
            <div  className="right-[5rem] top-[60px] mx-auto hidden min-h-[600px] w-1/3 
            max-w-[410px] translate-y-24 md:translate-y-0 lg:absolute  lg:block ">
                <CourseDetailsCard 
                    course={courseData?.data?.courseDetails}
                    setConfirmationModal={setConfirmationModal}
                    handleBuyCourse={handleBuyCourse}
                />
            </div>
        </div>
        {/* section 1 */}
        <div className='my-8 border border-richblack-800 p-6 w-[60%] ml-4'>
            <p  className="text-3xl font-semibold">What you'll learn</p>
            <div className='mt-5'>
                <ReactMarkdown>{whatYouWillLearn}</ReactMarkdown>
            </div>
        </div>
        {/* section 2 */}
        <div className='ml-4 p-1 flex flex-col gap-2 max-h-maxContent'>
            <div className='mt-1'>
                <p className='text-3xl font-semibold'>Course Content</p>
            </div>
            <div className='flex items-center justify-between w-[60%]'>
                <div className='flex gap-x-3'>
                    <span>{courseContent.length} section (s)</span>
                    <span>{totalNoOfLectures} Lecture (s)</span>
                    <span>{courseData.data.totalDuration} total length</span>
                </div>
                <div>
                    <button onClick={()=>setIsActive([])} className='text-yellow-300'>
                        Collapse all sections
                    </button>
                </div>
            </div>
            <div className='w-[60%]'>
                    {
                        courseContent?.map((section,index)=>(
                            <CourseAccordionBar
                                section={section}
                                key={index}
                                isActive={isActive}
                                handleActive={handleActive}
                            />

                        ))
                    }
                </div>
        </div>
        {/* Author Details  */}
        <div className='w-[60%] ml-4 p-4 mb-12 '>
            <div className="text-[28px] font-semibold">Author</div>
            <div className='flex flex-col gap-y-3 justify-between'>
                <div className='flex flex-row items-center gap-x-3'>
                    <img
                        src={instructor.image}
                        alt="Author"
                        className="h-14 w-14 rounded-full object-cover"
                    />
                    <p className="text-lg">{`${instructor.firstName} ${instructor.lastName}`}</p>
                </div>
                <div>
                    <p className='text-richblack-100'>
                        {instructor?.additionalDetails?.about}
                    </p>
                </div>
            </div>
        </div>
        <Footer/>
        {confirmationModal && <ConfirmationModal modalData={confirmationModal}/>}
    </div>
  )
}

export default CourseDetails