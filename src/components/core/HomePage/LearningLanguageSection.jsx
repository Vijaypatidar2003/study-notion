import React from 'react'
import HighLightText from './HighLightText'
import img1 from '../../../assests/images/Know_your_progress.png';
import img2 from '../../../assests/images/Compare_with_others.png';
import img3 from '../../../assests/images/Plan_your_lessons.png';
import CTAButton from './CTAButton';

const LearningLanguageSection = () => {
  return (
    <div className='mt-20 mb-32'>
        <div className='flex flex-col items-center justify-between gap-3  '>

            <div className='flex text-center text-2xl font-bold'>
                 Your swiss knife for 
                <HighLightText text={'learning any language'}/>
            </div>

            <div className=' text-center mx-auto text-base w-[70%] text-sm'>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Consequatur voluptatum optio voluptas nostrum 
                aliquam explicabo eligendi incidunt beatae officiis id?
                Lorem ipsum dolor sit amet consectetur adipisicing elit. 
            </div>

            <div className=' flex items-center justify-center mt-8 w-[90%]'>
                
                <img src={img1} className='object-contain -mr-32 '/>
                <img src={img2} className=' object-contain '/>
                <img src={img3}  className=' object-contain -ml-36 '/>
            </div>

            <div>
                <CTAButton active={true} linkto={'/signup'}>
                    <div>
                        Learn More
                    </div>
                </CTAButton>
            </div>

        </div>
    </div>
  )
}

export default LearningLanguageSection