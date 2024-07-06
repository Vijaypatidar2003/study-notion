import { toast } from "react-hot-toast"
import {apiConnector} from '../apiconnector'
import { courseEndpoints } from "../apis"
import { setLoading } from "../../slices/authSlice"

const {
    COURSE_DETAILS_API,
    COURSE_CATEGORIES_API,
    GET_ALL_COURSE_API,
    CREATE_COURSE_API,
    EDIT_COURSE_API,
    CREATE_SECTION_API,
    CREATE_SUBSECTION_API,
    UPDATE_SECTION_API,
    UPDATE_SUBSECTION_API,
    DELETE_SECTION_API,
    DELETE_SUBSECTION_API,
    GET_ALL_INSTRUCTOR_COURSES_API,
    DELETE_COURSE_API,
    GET_FULL_COURSE_DETAILS_AUTHENTICATED,
    CREATE_RATING_API,
    LECTURE_COMPLETION_API,
  } = courseEndpoints

  //*********************************COURSE*************************************

  //fetching the available course categories
  export const fetchCourseCategories = async ()=>{
    let result =[];
    try{
        const response = await apiConnector("GET", COURSE_CATEGORIES_API);
         

        console.log("COURSE_CATEGORIES_API API RESPONSE............", response);

        if(!response?.data?.success){
            throw new Error(response.data.message);
        }
        result = response?.data?.data
    }catch(error){
        console.log("COURSE_CATEGORY_API API ERROR............", error)
        toast.error(error.message)
    }
    return result;
  }
  //update the course details
  export const editCourseDetails = async(data,token)=>{
        const toastId = toast.loading("Loading...")
        let result=null;
        
        try{
            const response = await apiConnector('POST',EDIT_COURSE_API,data,{
                "Content-Type":"multipart/form-data",
                Authorization:`Bearer ${token}`
            })

            console.log("EDIT COURSE API RESPONSE............", response);

            if(!response?.data?.success){
                throw new Error("Could not updated course details");
            }

            toast.success("Course Details Updated Successfully")

            result = response?.data?.data

        }catch(error){
            console.log("EDIT COURSEe API ERROR............", error)
            toast.error(error.message)
        }
        toast.dismiss(toastId);
        return result;
    
  }

  //add course details
  export const addCourseDetails = async (data, token) => {
    console.log("inside course details api data is----",data)
    let result = null
    const toastId = toast.loading("Loading...")
    try {
      const response = await apiConnector("POST", CREATE_COURSE_API, data, {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      })
      console.log("CREATE COURSE API RESPONSE............", response)
      if (!response?.data?.success) {
        throw new Error("Could Not Add Course Details")
      }
      toast.success("Course Details Added Successfully")
      result = response?.data?.data
    } catch (error) {
      console.log("CREATE COURSE API ERROR............", error)
      toast.error(error.message)
    }
    toast.dismiss(toastId)
    return result
  }

  //fetch all the courses under specific instructor
  export const fetchInstructorCourses =  async (token)=>{
    let result = [];
    const toastId = toast.loading("Loading...");
    try{
      const response = await apiConnector("GET", GET_ALL_INSTRUCTOR_COURSES_API,null,{
        Authorization:`Bearer ${token}`
      });

      console.log("FETCH INSTRUCTOR COURSES API RESPONSE=",response);

      if(!response?.data?.success){
        throw new Error("Error while fetching instructor courses");
      }

      toast.success("instructor courses fetched successfully");
      result = response?.data?.data;
    }catch(error){
      console.log("error in fetching instructor courses is =",error)
      toast.error(error.message);
    }
    toast.dismiss(toastId);
    return result;
  }

  //delete a course
  export const deleteCourse = async (data,token)=>{
    const toastId = toast.loading("Loading...");
    try{
      let response = await apiConnector("POST",DELETE_COURSE_API,data,
      {
        Authorization:`Bearer ${token}`
      });

      console.log("DELETE COURSE API RESPONSE==",response);

      if(!response?.status?.success){
        throw new Error("Course couldn't be deleted");
      }

      toast.success("Course deleted successfully");

    }catch(error){
      console.log("ERROR IN DELETE COURSE API==",error);
      toast.error(error.message);
    }
    toast.dismiss(toastId);
  }

  // get full details of a course
export const getFullDetailsOfCourse = async (courseId, token) => {
  const toastId = toast.loading("Loading...")
  let result = null
  try {
    console.log("we are in services")
    const response = await apiConnector(
      "POST",
      GET_FULL_COURSE_DETAILS_AUTHENTICATED,
      {
        courseId,
      },
      {
        Authorization: `Bearer ${token}`,
      }
    )
    console.log("COURSE_FULL_DETAILS_API API RESPONSE............", response)

    if (!response.data.success) {
      throw new Error(response.data.message)
    }
    result = response?.data?.data
  } catch (error) {
    console.log("COURSE_FULL_DETAILS_API API ERROR............", error)
    result = error.response.data
  }
  toast.dismiss(toastId)
  return result
}

export const fetchCourseDetails = async (courseId)=>{
  const toastId = toast.loading("Loading...");
  let result=null;
  try{
    const response = await apiConnector("POST",COURSE_DETAILS_API,{courseId});
    console.log("COURSE_DETAILS_API API RESPONSE............", response);

    if(!response?.data?.success){
      throw new Error(response.data.message);
    }

    result=response.data;

  }catch(error){
    console.log("COURSE_DETAILS_API API ERROR............", error)
    result = error.response.data;
  }
  toast.dismiss(toastId);
  return result;
}

// *********************************SECTION*************************************
// create a section
export const createSection = async (data, token) => {
    let result = null
    const toastId = toast.loading("Loading...")
    try {
      const response = await apiConnector("POST", CREATE_SECTION_API, data, {
        Authorization: `Bearer ${token}`,
      })
      console.log("CREATE SECTION API RESPONSE............", response)
      if (!response?.data?.success) {
        throw new Error("Could Not Create Section")
      }
      toast.success("Course Section Created")
      result = response?.data?.updatedCourse
    } catch (error) {
      console.log("CREATE SECTION API ERROR............", error)
      toast.error(error.message)
    }
    toast.dismiss(toastId)
    return result
  }
//update section
  export const updateSection = async(data,token)=>{
    let result = null;
    const toastId = toast.loading("Loading...");
    try{
        const response = await apiConnector("POST",UPDATE_SECTION_API,data,
        {
            Authorization:`Bearer ${token}`
        })

        console.log("UPDATE SECTION API RESPONSE===",response);
        if(!response?.data?.success){
            throw new Error("Could not updated Section");
        }
        toast.success("Course Section Updated");
        result=response?.data?.data;
    }catch(error){
        console.log("UPDATE SECTION API ERROR==",error);
        toast.error(error.message);
    }
    toast.dismiss(toastId);
    return result;
  }
//delete section
export const deleteSection = async (data,token)=>{
  console.log("data in details=",data)
  let result=null;
  const toastId = toast.loading("Loading...");
  try{
    const response = await apiConnector("POST",DELETE_SECTION_API,data,{
      Authorization:`Bearer ${token}`
    });
    console.log("DELETE SECTION API RESPONSE===",response);
    if(!response?.data?.success){
      throw new Error("Section cannot be deleted");
    }
    toast.success("Course Section deleted");
    result = response?.data?.data;
  }catch(error){
    console.log("Delete SECTION API ERROR==",error);
    toast.error(error.message);
  }
  toast.dismiss(toastId);
  return result;
} 


// *********************************SUBSECTION*************************************

//create subSection 
export const createSubSection = async (data,token)=>{
  let result=null;
  const toastId=toast.loading("Loading...");
  try{
    const response = await apiConnector("POST",CREATE_SUBSECTION_API,data,{
      "Content-Type": "multipart/form-data",
      Authorization:`Bearer ${token}`
    });
    console.log("create subsection api response=",response);
    if(!response?.data?.success){
      throw new Error("could not added lecture");
    }
    console.log("Lecture added successfully");
    result = response?.data?.data;
  }catch(error){
    console.log("CREATE SUBSECTION API ERROR............", error)
    toast.error(error.message)
  }
  toast.dismiss(toastId);
  return result;
}
//delete subSection
export const deleteSubSection = async (data,token)=>{
  let result=null
  const toastId=toast.loading("Loading");
  try{
    const response = await apiConnector("POST",DELETE_SUBSECTION_API,data,{
     Authorization:`Bearer ${token}`
    });
    console.log("DELETE SUBSECTION API RESPONSE===",response);
    if(!response?.data?.sucess){
      throw new Error("SubSection cannot be deleted");
    }
    toast.success("Course SubSection deleted");
    result = response?.data?.data;
  }catch(error){
    console.log("Delete SUBSECTION API ERROR==",error);
    toast.error(error.message);
  }
  toast.dismiss(toastId);
  return result;
}
//update subSection 
export const updateSubSection = async(data,token)=>{
  let result = null;
  const toastId = toast.loading("Loading...");
  try{
      const response = await apiConnector("POST",UPDATE_SUBSECTION_API,data,
      {
        
          Authorization:`Bearer ${token}`
      })

      console.log("UPDATE SUBSECTION API RESPONSE===",response);
      if(!response?.data?.success){
          throw new Error("Could not updated LECTURE");
      }
      toast.success("Course LECTURE Updated");
      result=response?.data?.data;
  }catch(error){
      console.log("UPDATE SUBSECTION API ERROR==",error);
      toast.error(error.message);
  }
  toast.dismiss(toastId);
  return result;
}


// ******************************CREATE RATING****************************
export const createRating = async(data,token)=>{
  const toastId = toast.loading("Loading...");
  let success=false;
  try{
    const response = await apiConnector("POST",CREATE_RATING_API,data,{
      Authorization:`Bearer ${token}`
    });

    console.log("CREATE RATING API RESPONSE............", response);

    if(!response.status.success){
      throw new Error("Could not create rating");
    }

    toast.success("Rating Created")
    success = true;
  }catch(error){
    success = false
    console.log("CREATE RATING API ERROR............", error)
    toast.error(error.message)
  }
  toast.dismiss(toastId);
  return success;
}


export const markLectureAsComplete = async (data,token)=>{
  let result = null
  console.log("mark complete data", data)
  const toastId = toast.loading("Loading...");
  try{
    const response = await apiConnector("POST",LECTURE_COMPLETION_API,data,{
      Authorization:`Bearer ${token}`
    })

    console.log(
      "MARK_LECTURE_AS_COMPLETE_API API RESPONSE............",
      response
    )

    if (!response.data.status) {
      throw new Error(response.data.message)
    }
    toast.success("Lecture Completed")
    result = true;
  }catch(error){
    console.log("MARK_LECTURE_AS_COMPLETE_API API ERROR............", error)
    toast.error(error.message)
    result = false
  }
  toast.dismiss(toastId)
  return result
}