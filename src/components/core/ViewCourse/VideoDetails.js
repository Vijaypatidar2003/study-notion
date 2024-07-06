import React, { useRef, useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { markLectureAsComplete } from '../../../services/operations/courseDetailsAPI';
import { updateCompletedLectures } from '../../../slices/viewCourseSlice';
import { FaCirclePlay } from "react-icons/fa6";
import { Player } from 'video-react';
import 'video-react/dist/video-react.css'; // import css
import IconBtn from '../../common/IconBtn';

const VideoDetails = () => {

  const {courseId,sectionId,subSectionId} = useParams();
  const playerRef = useRef();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const {token} = useSelector((state)=>state.auth);
  const {courseSectionData,courseEntireData,completedLectures} = useSelector((state)=>state.viewCourse);

  const [videoData,setVideoData] = useState([]);
  const [videoEnded,setVideoEnded] = useState(false);
  const [loading,setLoading] = useState(false);

  useEffect(()=>{
    const setVideoSpecificDetails = async()=>{
      if(!courseSectionData.length){
        return;
      }else if(!courseId && !sectionId && !subSectionId){
        navigate("/dashboard/enrolled-courses");
      }else{
        const filteredSection = courseSectionData.filter((sec)=>sec._id===sectionId);
        const filteredSubSection = filteredSection?.[0].subSection.filter((subsec)=>subsec._id===subSectionId);
        setVideoData(filteredSubSection[0]);
        setVideoEnded(false);
      }
    }
    setVideoSpecificDetails();
  },[courseEntireData,courseSectionData,location.pathname]);

  const isFirstVideo = ()=>{
    const currentSectionIndex = courseSectionData.findIndex(
      (data)=>data._id===sectionId
    )

    const currentSubSectionIndex = courseSectionData[currentSectionIndex].subSection.findIndex(
      (data)=>data._id===subSectionId
    )

    return (currentSectionIndex===0 && currentSubSectionIndex===0)
  }

  const isLastVideo = ()=>{
    const currentSectionIndex = courseSectionData.findIndex(
      (data) => data._id === sectionId
    )

    const noOfSubSections = courseSectionData[currentSectionIndex].subSection.length

    const currentSubSectionIndex = courseSectionData[currentSectionIndex].subSection.findIndex(
      (data)=>data._id===subSectionId
    )

    if(currentSectionIndex === courseSectionData.length-1 && currentSubSectionIndex === noOfSubSections-1){
      return true;
    }else{
      return false;
    }
  }

  const goToNextVideo = ()=>{
    const currentSectionIndex = courseSectionData.findIndex(
      (data) => data._id === sectionId
    )

    const noOfSubSections = courseSectionData[currentSectionIndex].subSection.length;

    const currentSubSectionIndex = courseSectionData[currentSectionIndex].subSection.findIndex(
      (data)=>data._id===subSectionId
    )

    if(currentSubSectionIndex !== (noOfSubSections-1)){
      //same section ki next video mein jao
      const nextSubSectionId= courseSectionData[currentSectionIndex].subSection[currentSubSectionIndex+1]._id;
      //is video pr jao
      navigate(`/view-course/${courseId}/section/${sectionId}/sub-section/${nextSubSectionId}`);
    }else{
      const nextSectionId = courseSectionData[currentSectionIndex+1]._id;
      const nextSubSectionId = courseSectionData[currentSectionIndex+1].subSection[0]._id;
      //is video pr jao
      navigate(`/view-course/${courseId}/section/${nextSectionId}/sub-section/${nextSubSectionId}`);
    }

  }

  const goToPrevVideo = ()=>{
    const currentSectionIndex = courseSectionData.findIndex(
      (data) => data._id === sectionId
    )

    const currentSubSectionIndex = courseSectionData[currentSectionIndex].subSection.findIndex(
      (data)=>data._id===subSectionId
    )

    if( currentSubSectionIndex !== 0){
      //same section ki prev video pr jao
      const prevSubSectionId = courseSectionData[currentSectionIndex].subSection[currentSubSectionIndex-1]._id;

      //is video pr jao
      navigate(`/view-course/${courseId}/section/${sectionId}/sub-section/${prevSubSectionId}`);
    }else{
      //prev section ki last video pr jao
      const prevSectionId = courseSectionData[currentSectionIndex-1]._id;
      const prevSubSectionLength = courseSectionData[currentSectionIndex-1].subSection.length;
      const prevSubSectionId = courseSectionData[prevSectionId].subSection[prevSubSectionLength-1]._id;

      //is video pr jao
      navigate(`/view-course/${courseId}/section/${prevSectionId}/sub-section/${prevSubSectionId}`);
    }

  }

  const handleLectureCompletion = async()=>{
     setLoading(true);
     try{
      const res = await markLectureAsComplete({courseId:courseId,subSectionId:subSectionId},token);
      //state update
      if(res){
        dispatch(updateCompletedLectures(subSectionId));
      }
     }catch(error){

     }
  }
  return (
    <div className="flex flex-col gap-5 text-white">
      {
        !videoData ? (
          <div>
            No Data Found
          </div>)
        : (
          <Player
          ref={playerRef}
          aspectRatio="16:9"
          playsInline
          onEnded={()=>setVideoEnded(true)}
          src={videoData?.videoUrl}
        >
           <FaCirclePlay position="center"/>

           {
              videoEnded && (
                <div
                  style={{
                    backgroundImage:
                      "linear-gradient(to top, rgb(0, 0, 0), rgba(0,0,0,0.7), rgba(0,0,0,0.5), rgba(0,0,0,0.1)",
                  }}
                  className="full absolute inset-0 z-[100] grid h-full place-content-center font-inter"
                >
                  {
                    !completedLectures.includes(subSectionId) && (
                      <IconBtn
                        disabled={loading}
                        onclick={()=>handleLectureCompletion()}
                        text={!loading? "mark as completed" : "Loading..."}
                        customClasses="text-xl max-w-max px-4 mx-auto"
                      />
                    )
                  }
                  <IconBtn 
                    text="Rewatch"
                    disabled={loading}
                    onclick={()=>{
                        if(playerRef?.current){
                        //set the current time of video to 0
                        playerRef.current.seek(0);
                        setVideoEnded(false);
                        }
                    }}
                    customClasses="text-xl max-w-max px-4 mx-auto mt-2"
                  />

                  <div className="mt-10 flex min-w-[250px] justify-center gap-x-4 text-xl">
                    {!isFirstVideo() && (
                      <button
                        disabled={loading}
                        onClick={goToPrevVideo}
                      >
                        Prev
                      </button>
                    )}
                    {!isLastVideo() && (
                      <button
                      disabled={loading}
                      onClick={goToNextVideo}
                      >
                        Next
                      </button>
                    )
                      
                    }
                  </div>
                </div>
              )
           }
        </Player>
        )
      }
      <h1 className="mt-4 text-3xl font-semibold">{videoData?.title}</h1>
      <p className="pt-2 pb-6">{videoData?.description}</p>
    </div>
  )
}

export default VideoDetails