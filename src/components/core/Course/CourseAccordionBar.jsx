import React, { useEffect, useRef, useState } from 'react'
import { IoIosArrowDown } from "react-icons/io";
import { FaVideo } from "react-icons/fa";
import CourseSubSectionAccordian from './CourseSubSectionAccordian';


const CourseAccordionBar = ({section,isActive,handleActive}) => {

    const contentE1 = useRef(null);

    const [active,setActive] = useState(false);
    useEffect(()=>{
        setActive(isActive?.includes(section._id));
    },[isActive])
  
    const [sectionHeight,setSectionHeight] = useState(0);

    useEffect(()=>{
        setSectionHeight(active?50:0);
    },[active]);
  return (
    <div>
        <div className='flex items-center justify-between bg-richblack-700 h-[50px] p-3'>
            <div className='flex items-center gap-x-3'
                onClick={()=>handleActive(section._id)}
            >
                <span className={`${active?"rotate-180":"rotate-0"}`}> <IoIosArrowDown /></span>
                {section?.sectionName}
            </div>
            <div className='text-yellow-300'>
                {section.subSection.length} lecture(s)
            </div>
        </div>
       <div ref={contentE1}
            className='relative h-0 overflow-hidden bg-richblack-900 transition-[height] duration-[0.35s] ease-[ease]
            border border-richblack-700'
            style={{
                height:sectionHeight
            }}
        >
            <div className="text-textHead flex flex-col gap-2 px-7 py-3 font-semibold">
                {section?.subSection?.map((subSection, index) => {
                return <CourseSubSectionAccordian subSection={subSection} key={index}/>
                })}
            </div>
       </div>
        
    </div>
  )
}

export default CourseAccordionBar