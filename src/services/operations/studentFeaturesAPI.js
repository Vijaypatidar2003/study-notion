import toast from "react-hot-toast";
import { studentEndpoints } from "../apis";
import { apiConnector } from "../apiconnector";
import rzpLogo from "../../assests/Logo/rzp_logo.png"
import { setPaymentLoading } from "../../slices/courseSlice";
import { resetCart } from "../../slices/cartSlice";



const {COURSE_PAYMENT_API,COURSE_VERIFY_API,SEND_PAYMENT_SUCCESS_EMAIL_API} = studentEndpoints


//function to load the script
function loadScript(src){
    return new Promise((resolve)=>{
        const script = document.createElement("script");
        script.src = src;

        script.onload = ()=>{
            resolve(true);
        }

        script.onerror = ()=>{
            resolve(false);
        }
        document.body.appendChild(script);
    })   
}

export const buyCourse = async(token,courses,userDetails,navigate,dispatch)=>{
    const toastId = toast.loading("Loading...");
    try{
        //load the script
        const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js");

        if(!res){
            toast.error("razorpay SDK failed to load");
            return;
        }

        //initiate the order
        const orderResponse = await apiConnector("POST",COURSE_PAYMENT_API,
        {courses},
        {Authorization:`Bearer ${token}`}
        )

        if(!orderResponse.data.success){
            throw new Error(orderResponse.data.message);
        }

        //options
        const options = {
            key:process.env.RAZORPAY_KEY,
            currency:orderResponse.data.message.currency,
            amount:orderResponse.data.message.amount,
            order_id:orderResponse.data.message.id,
            name:"StudyNotion",
            description:"Thank you for purchasing the course",
            image:rzpLogo,
            prefill:{
                name:`${userDetails.firstName}`,
                email:`${userDetails.email}`
            },
            handler: function(response){
                //send successfull mail
                sendPaymentSuccessEmail(response,orderResponse.data.message.amount,token);
                //verify payment
                verifyPayment({...response,courses},token,navigate,dispatch )
            } 
        }

        const paymentObject = new window.Razorpay(options);
        paymentObject.open();
        paymentObject.on("payment.failed",function(response){
            toast.error("oops, payment failed");
            console.log(response.error);
        })

    }catch(error){
        console.log("PAYMENT API ERROR....",error);
        toast.error("Could not make payment");
    }
    toast.dismiss(toastId)
}

async function sendPaymentSuccessEmail(response,amount,token){
    try{
        await apiConnector("POST",SEND_PAYMENT_SUCCESS_EMAIL_API,{
            orderId:response.razorpay_order_id,
            paymentId:response.razorpay_payment_id,
            amount,
        },
        {
            Authorization:`Bearer ${token}`
        })
    }catch(error){
        console.log("PAYMENT SUCCESS EMAIL ERROR...",error)
    }
}

async function verifyPayment(bodyData,token,navigate,dispatch){
    const toastId = toast.loading("verifying payment...");
    dispatch(setPaymentLoading(true));
    try{
        const response = await apiConnector("POST",COURSE_VERIFY_API,bodyData,
        {Authorization:`Bearer ${token}`})

        if(!response.data.success){
            throw new Error(response.data.massage);
        }
        toast.success("Payment successful, you are added to the course");
        navigate("/dashboard/enrolled-courses");
        dispatch(resetCart());
    }catch(error){
        console.log("PAYMENT VERIFY ERROR....", error);
        toast.error("Could not verify Payment");
    }
    toast.dismiss(toastId);
    dispatch(setPaymentLoading(false));
}