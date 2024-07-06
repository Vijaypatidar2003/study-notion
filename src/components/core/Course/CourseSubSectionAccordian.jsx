import React from 'react'
import { FaVideo } from "react-icons/fa";

const CourseSubSectionAccordian = ({subSection}) => {
  return (
    <div >
        <div className="flex justify-between ">
            <div className={`flex items-center gap-2`}>
                <span><FaVideo /></span>
                <p>{subSection?.title}</p>
            </div>
            <div>
                {subSection?.timeDuration}
            </div>
      </div>
    </div>
  )
}

export default CourseSubSectionAccordian