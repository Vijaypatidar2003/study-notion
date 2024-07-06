import { setLoading, setToken } from "../../slices/authSlice";
import { apiConnector } from "../apiconnector";
import { profileEndpoints } from "../apis";
import { toast } from "react-hot-toast";

const {
    GET_USER_DETAILS_API,
    GET_USER_ENROLLED_COURSES_API,
    GET_INSTRUCTOR_DATA_API,
} = profileEndpoints

export async function getUserEnrolledCourses(token){

        const toastId = toast.loading("Loading...")
        let result = [];
        try{
            const response = await apiConnector("GET", 
            GET_USER_ENROLLED_COURSES_API,
            null,
            {
                Authorization: `Bearer ${token}`,
            })

            if(!response.data.success){
                throw new Error(response.data.message)
            }
            console.log("user enrolled courses=",response)
            result = response.data.data;
            toast.success("successfully fetched enrolled courses")

        }catch(error){
            console.log("GET_USER_ENROLLED_COURSES_API API ERROR............", error)
            toast.error("Could Not Get Enrolled Courses")
        }
        toast.dismiss(toastId)
        return result
    
}

export async function getInstructorData(token){
    const toastId = toast.loading("Loading...");
    let result = [];
    try{
        const response = await apiConnector("GET",GET_INSTRUCTOR_DATA_API,null,{
            Authorization:`Bearer ${token}`
        });

        console.log("GET_INSTRUCTOR_DATA_API_RESPONSE",response);

        if(!response.status.success){
            throw new Error(response.status.message);
        }
        result=response?.data?.courses;
    }catch(error){
        console.log("GET_INSTRUCTOR_API_ERROR",error);
        toast.error(error);
    }
    toast.dismiss(toastId);
    return result;
}