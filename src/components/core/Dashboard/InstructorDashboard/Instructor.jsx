import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import {fetchInstructorCourses} from '../../../../services/operations/courseDetailsAPI'
import { getInstructorData } from '../../../../services/operations/profileAPI';
import { apiConnector } from '../../../../services/apiconnector';

const Instructor = () => {

    const [loading,setLoading] = useState(false);
    const [instructorData,setInstructorData] = useState(null);
    const [courses,setCourses] = useState([]);

    const {token} = useSelector((state)=>state.auth);
 
    useEffect(()=>{

        const getCourseDetailsWithStats = async ()=>{
            setLoading(true);

            
            const result = await fetchInstructorCourses(token);
            console.log("instructor=",result)
            // const instructorApiData = await getInstructorData(token);
            

            // console.log("instructorApiData=",instructorApiData);

            // if(instructorApiData.length){
            //     setInstructorData(instructorApiData);
            // }

            if(result){
                setCourses(result);
            }
           
        }

        getCourseDetailsWithStats();

    },[])

  return (
    <div>Instructor</div>
  )
}

export default Instructor