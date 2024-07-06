import React, { useEffect, useState } from 'react'
import { HomePageExplore } from '../../../data/homepage-explore';
import HighLightText from './HighLightText';

// const tabsName=[
//     "Free",
//     "New to Coding",
//     "Most Popular",
//     "Skill Paths",
//     "Career Paths"
// ];

// const ExploreMore = () => {
  
//     const [currentTab,setCurrentTab]=useState(tabsName[0]);
//     const [courses, setCourses]=useState(HomePageExplore[0].courses);
//     const [currentCard,setCurrentCard]=useState(HomePageExplore[0].courses[0].heading);

//     const setMyCards=(value)=>{
//         setCurrentTab(value);
//         const result=HomePageExplore.filter((course)=>(course.tag===value));
//         setCourses(result.courses);
//         setCurrentCard(result.courses[0].heading);
//     }

    // useEffect(()=>{
    //     tabHandler(){
    //         const course=HomePageExplore.map((page)=>{
    //             return page.tag===tab;
    //         })
    //         setCourses(course);
    //     }
    // },[currentTab]);
//   return (
//     <div>
//         <div className='flex flex-col justify-between text-center items-center'>
//             <div className='text-2xl font-semibold  flex items-center'>
//                 Unlock the 
//                 <HighLightText text={"Power of Code"}/>
//             </div>

//             <p className='text-center text-sm  text-richblack-300 mt-3'>
//                 Learn to build anything you can imagine.
//             </p>
//             <div className={` text-center flex flex-row gap-3 bg-richblack-500 items-center rounded p-2`}>
//                 {
//                     tabsName.map((element,index)=>{
//                         return <div onClick={setMyCards} value={element}
//                          className={`${(currentTab===element)
//                         ?"bg-richblack-900 text-white" rounded-full cursor-pointer transition all duration-200":
//                         " text-richblack-200"}`}>
//                             {element}
//                         </div>;
//                     })
//                 }
                
//             </div>
//         </div>
//     </div>
//   )
// }

// export default ExploreMore