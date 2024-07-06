import React from 'react'
import instructor from '../../../assests/images/Instructor.png'
import HighLightText from './HighLightText'
import CTAButton from './CTAButton'
import { FaArrowRight } from 'react-icons/fa'

const InstructorSection = () => {
  return (
    <div className='mt-16'>
        <div className='flex flex-row  items-center gap-20'>
            <div className='w-[50%]'>
            
                <img src={instructor}
                className='shadow-white p-10'/>

            </div>
            <div className='w-[50%] flex flex-col gap-10 '>
            
                <div className='text-3xl font-semibold'>
                    Become an<br/>
                    <HighLightText text={"Instructor"}/>
                </div>

                <p className='text-[16px] w-[80%]  text-richblack-300 font-medium'>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. 
                    Reprehenderit impedit enim similique inventore voluptatum cupiditate.
                </p>

                <div className='w-fit'>
                    <CTAButton active={true} linkto={'/signup'}>
                        <div className='flex flex-row gap-2 items-center'>
                            Start Teaching today
                            <FaArrowRight/>
                        </div>
                    </CTAButton>

                </div>
               
            

            </div>
        </div>
    </div>
  )
}

export default InstructorSection