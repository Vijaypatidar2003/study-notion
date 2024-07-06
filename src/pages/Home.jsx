import React from 'react'
import { FaArrowRight } from "react-icons/fa";
import { Link } from 'react-router-dom'
import HighLightText from '../components/core/HomePage/HighLightText';
import CTAButton from '../components/core/HomePage/CTAButton';
import Banner from '../assests/images/banner.mp4'
import CodeBlocks from '../components/core/HomePage/CodeBlocks';
import TimeLineSection from '../components/core/HomePage/TimeLineSection';
import LearningLanguageSection from '../components/core/HomePage/LearningLanguageSection';
import InstructorSection from '../components/core/HomePage/InstructorSection';
import Footer from '../components/common/Footer';
import ExploreMore from '../components/core/HomePage/ExploreMore';
import ReviewSlider from '../components/common/ReviewSlider';

const Home = () => {
  return (
    <div>
        {/* section 1 */}
        <div className='relative  max-w-maxContent mx-auto flex flex-col items-center w-11/12 text-white
                        justify-between'> 
            <Link to='/signup'>

                <div className='mt-16 group rounded-full mx-auto bg-richblack-800 font-bold text-richblack-200 
                                transition-all duration-200 hover:scale-95 w-fit '>
                    <div className='flex items-center justify-center gap-1 
                    group-hover:bg-richblack-900 rounded-full px-8 py-[4px]'>
                        <p>Become an Instructor</p>
                        <FaArrowRight />
                    </div>
                </div>

            </Link>

            <div className='text-center font-semibold text-4xl mt-7'>Empower Your Future with
                 <HighLightText text={"Coding Skills"}/>
            </div>

            <div className='mt-4 w-[70%] text-center font-bold text-md text-richblack-400'>
              Lorem ipsum dolor, sit amet consectetur adipisicing elit. 
              Ullam quasi odit, molestias, ipsam nulla eaque natus et eligendi esse
               quos doloribus. Provident quaerat facere consequuntur ad eaque.
            </div>

            <div className='flex flex-row gap-7 mt-8'>
                <CTAButton active={true} linkto={"/signup"} >
                  Learn More
                </CTAButton>

                <CTAButton active={false} linkto={"/login"}>
                  Book a Demo
                </CTAButton>
            </div>

            <div className='mx-3 my-12 shadow-blue-200 max-w-[60%]'>
                <video
                muted
                autoPlay
                loop>
                  <source src={Banner}/>
                </video>

            </div>

            {/* <ExploreMore/> */}
            {/* code section 1 */}
            <div>
              <CodeBlocks position={"lg:flex-row"}
               heading={
               <div className='text-4xl font-semibold'>unlock your 
              <HighLightText text={"Coding Potential"}/>
              with our online courses
              </div>}
              subheading={<div>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloremque, blanditiis.
              </div>}
              ctabtn1={
                {
                  btnText:"Try it Yourself",
                  active:true,
                  linkto:"/signup"
                }
              }
              ctabtn2={
                {
                  btnText:"Learn More",
                  active:false,
                  linkto:"/login"
                }
              }/>
            </div>
            
        </div>

        {/* section 2 */}
        <div className='bg-white text-richblack-700'>

              <div className='home_bg h-[310px]'>
                {/* w-11/12 means we are not placing content in screen width but  */}
                <div className='w-11/12 max-w-maxContent flex flex-col items-center gap-5 mx-auto'>

                  <div className='h-[150px]'></div>                
                  <div className='flex flex-row gap-7 text-white'>
                      <CTAButton active={true} linkto={'/signup'}>
                        <div className='flex items-center gap-1'>
                            Explore Full Catalog
                            <FaArrowRight/>
                        </div>
                      </CTAButton>

                      <CTAButton active={false} linkto={'/signup'}>
                        Learn More
                      </CTAButton>
                  </div>
                </div>
              </div>
                
              <div className='w-11/12 max-w-maxContent flex flex-col items-center justify-between  gap-7 mx-auto
                '>
                    <div className='flex  gap-1 mt-10 mb-10  ml-[130px] mt-[95px]'>
                      <div className='text-4xl font-semibold w-[40%] '>
                        Get the Skills you need for a
                        <HighLightText text={'Job that is in demand'}/>
                      </div>

                      <div className='flex flex-col  gap-10 text-[16px] items-start w-[40%]'>
                         <div>Lorem ipsum dolor sit, amet consectetur adipisicing elit.
                         Quibusdam, quod mollitia eligendi nostrum quia quae!
                         </div>
                         
                         <CTAButton active={true} linkto={'/signup'} >
                          <div>
                            Learn More
                          </div>              
                         </CTAButton>
                        
                        

                      </div>
                    </div>
                    <TimeLineSection/>

                    <LearningLanguageSection/>
              </div>


            
              

        </div> 

        {/* section 3 */}
        <div className='w-11/12 max-w-maxContent flex flex-col items-center justify-between gap-8 first-letter
        bg-richblack-900 text-white mx-auto'>

              <InstructorSection/>

              <h2 className='text-3xl text-center font-semibold my-4'> Review from learners</h2>
        </div>

        {/* review slider here */}
        <ReviewSlider/>

        {/* footer  */}
        <div className="text-white">
        <Footer/>
        </div>
        
    </div>
  )
}

export default Home