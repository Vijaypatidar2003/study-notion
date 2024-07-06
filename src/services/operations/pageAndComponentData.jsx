import { apiConnector } from "../apiconnector"
import { toast } from "react-hot-toast"
import { catalogData } from "../apis"

export const getCatalogPageData = async (categoryId)=>{
    const toastId=toast.loading("Loading...");
    let result = [];
    try{
        let response = await apiConnector("POST",catalogData.CATALOGPAGEDATA_API,{
            categoryId:categoryId
        });

        if(!response?.data?.success){
            throw new Error(response.data.message);
        }

        result = response?.data;

    }catch(error){
        console.log("CATALOGPAGEDATA_API API ERROR............", error)
        toast.error(error.message)
        result = error.response?.data
    }
    toast.dismiss(toastId);
    return result;
}