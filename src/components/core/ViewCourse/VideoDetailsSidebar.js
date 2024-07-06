import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { IoIosArrowDropleftCircle } from "react-icons/io";
import IconBtn from '../../common/IconBtn'
import { IoIosArrowDown } from "react-icons/io";



const VideoDetailsSidebar = ({setReviewModal}) => {

    const [activeStatus,setActiveStatus] = useState("");
    const [videobarActive,setVideobarActive] = useState("");
    const navigate = useNavigate();
    const location = useLocation(); 
    const {sectionId,subSectionId} = useParams()

    const {
        courseSectionData,
        courseEntireData,
        totalNoOfLectures,
        completedLectures
    } = useSelector((state)=>state.viewCourse);

    useEffect(()=>{
        ;(()=>{
          if(!courseSectionData.length){
            return;
          }

          const currentSectionIndex = courseSectionData.findIndex((data)=>
          (data._id===sectionId)
          )

          const currentSubSectionIndex = courseSectionData?.[currentSectionIndex]?.subSection.findIndex(
            (data)=>data._id===subSectionId
          )

          const activeSubSectionId = courseSectionData?.[currentSectionIndex]?.subSection
          ?.[currentSubSectionIndex]?._id;

          //set current section here
          setActiveStatus(courseSectionData?.[currentSectionIndex]?._id);
          //set current subsection here
          setVideobarActive(activeSubSectionId);
        })()
    },[courseSectionData,courseEntireData,location.pathname])

  return (
    <>
      <div className='flex flex-col h-[calc(100vh-3.5rem)] w-[320px] max-w-[350px] border-r-[1px]
        border-r-richblack-700 bg-richblack-800'>
        {/* for buttons and heading */}
        <div className='px-4 flex flex-col items-start justify-between gap-2 gap-y-4  border-b border-richblack-600
        py-5 text-lg font-bold text-richblack-2 '>
          {/* for buttons  */}
          <div className='flex items-center justify-between w-full'>
            <div onClick={()=>navigate("/dashboard/enrolled-courses")}
                  className='flex items-center justify-center h-[35px] w-[35px] rounded-full bg-richblack-100
                  p-1 text-richblack-700 hover:scale-90'>
              <IoIosArrowDropleftCircle size={30}/>
            </div>
            <div><IconBtn text="Add Review" onclick={()=>setReviewModal(true)}  customClasses="ml-auto"/></div>
          </div>
          {/* for heading */}
          <div className='flex flex-col'>
            <p>{courseEntireData?.courseName}</p>
            <p className="text-sm font-semibold text-richblack-500">
              {completedLectures.length}/{totalNoOfLectures}
            </p>
          </div>
        </div>

        {/* for sections and subsections */}
        <div className='h-[calc(100vh-5rem)] overflow-y-auto'>
          {
            courseSectionData?.map((section,index)=>(
              <div
                onClick={()=>setActiveStatus(section?._id)}
                key={index}
                className="mt-2 cursor-pointer text-sm text-richblack-5"
              >

                {/* section  */}
                <div className='flex flex-row justify-between px-5 py-4 bg-richblack-600'>
                    <div  className="w-[70%] font-semibold">
                      {section?.sectionName}
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`${activeStatus===section._id ? "rotate-180" : "rotate-0" }
                        transition-all duration-500`}>
                        <IoIosArrowDown />
                      </span>
                    </div>
                </div>

                {/* subsection */}
                <div>
                  {
                    activeStatus===section?._id && (
                      <div className='transition-[height] duration-500 ease-in-out'>
                        {
                          section?.subSection?.map((subSection,index)=>(
                            <div
                              className={
                                ` flex gap-5 p-5
                                ${videobarActive===subSection?._id 
                                  ? "bg-yellow-200 text-richblack-900"
                                  :"bg-richblack-800 text-richblack-100"}
                                `}
                                key={index}
                                onClick={()=>{
                                  navigate(`/view-course/${courseEntireData._id}/section/${section._id}
                                  /sub-section/${subSection._id}`)
                                  setVideobarActive(subSection._id)
                                }}
                            >
                              <input
                                type='checkbox'
                                checked={completedLectures?.includes(subSection._id)}
                                onChange={()=>{}}
                              />
                              <span>{subSection.title}</span>
                            </div>
                          ))
                        }
                      </div>
                    )
                  }
                </div>

              </div>
            ))
          }
        </div>
      </div>
    </>
  )
}

export default VideoDetailsSidebar