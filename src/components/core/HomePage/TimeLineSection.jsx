import React from 'react'
import logo1 from '../../../assests/TimeLineLogo/Logo1.svg';
import logo2 from '../../../assests/TimeLineLogo/Logo2.svg';
import logo3 from '../../../assests/TimeLineLogo/Logo3.svg';
import logo4 from '../../../assests/TimeLineLogo/Logo4.svg';
import timelineImage from '../../../assests/images/TimelineImage.png'

const TimeLineSection = () => {
    const timeline=[
        {
            logo:logo1,
            heading:'Leadership',
            description:'fully commited to success company'
        },
        {
            logo:logo2,
            heading:'Leadership',
            description:'fully commited to success company'
        },
        {
            logo:logo3,
            heading:'Leadership',
            description:'fully commited to success company'
        },
        {
            logo:logo4,
            heading:'Leadership',
            description:'fully commited to success company'
        },
    ]
  return (
    <div>
        
        <div className='flex flex-row gap-15 items-center'>

            {/* left part */}
            <div className='flex flex-col gap-5 w-[45%]'>
                {
                    timeline.map((element,index)=>{
                        return (
                            
                                <div className='flex flex-row gap-6 ' key={index}>

                                    <div className='w-[50px] h-[50px] flex items-center bg-white'>
                                   <img src={element.logo}/>
                                    </div>
                                    
                                
                                    <div className='flex flex-col'>
                                <h2 className='font-semibold text-[18px]'> {element.heading}</h2>
                                <p className='text-base'>{element.description}</p>
                                    </div>

                                </div>
                                
                           
                        )
                    })
                }

            </div>

            {/* right part */}
            <div className='relative shadow-blue-200 w-[45%]'>

               <img src={timelineImage} className='shadow-white object-cover h-fit '/> 

               <div className='absolute bg-green-700 text-white flex flex-row py-5 b-[20px] 
               left-[50%] translate-x-[-50%] translate-y-[-50%]'>
                    <div className='flex flex-row gap-4 border-r border-green-200 px-7 items-center'>
                        <p className='font-bold text-3xl'>10</p>
                        <p className='text-sm text-greys-400 font-normal'>Years of Experience</p>
                    </div>
                    <div className='flex flex-row gap-4 border-r border-green-200 px-7 items-center'>
                        <p className='font-bold text-3xl'>250</p>
                        <p className='text-sm text-greys-400 font-normal'>Type of Courses</p>
                    </div>
               </div>
            </div>
        </div>

    </div>
  )
}

export default TimeLineSection