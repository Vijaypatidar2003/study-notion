const {instance}=require('../config/razorpay');
const Course=require('../models/Course');
const User=require('../models/User');
require("dotenv")
//we need to send mail about that the user has successfully purchased the course so we will be sending email 
const mailSender=require('../utils/mailSender');
const { mongoose } = require('mongoose');
const crypto = require("crypto");
const CourseProgress = require('../models/CourseProgress');
const {courseEnrollmentEmail} =require("../mail/templates/courseEnrollmentEmail");
const { paymentSuccessEmail } = require('../mail/templates/paymentSuccessEmail');


//controller that will be called when we click on the buy now
//basically it initiates the razorpay order
// exports.capturePayment=async (req,res)=>{
   
//     //get userid and courseid
//     const {courseId}=req.body;
//     const userId=req.user.id;

//     //validation
        
//     //valid course id
//     if(!courseId){
//         return res.status(400).json({
//             success:false,
//             message:"please provide valid course id"
//         })
//     }

//     var courseDetails;
//     try{
//         //valid courseDetails
//         courseDetails=await Course.findById({_id:courseId});
        
//         if(!courseDetails){
//             return res.status(400).json({
//                 success:false,
//                 message:"could not find the course"
//             })  
//         }

//         //user is already enrolled in that course
//         const uid=new mongoose.Types.ObjectId(userId);
//         if(Course.studentsEnrolled.includes(uid)){
//             return res.status(400).json({
//                 success:false,
//                 message:"Students is already enrolled"
//             })
//         }
//         //create order
//         const amount=courseDetails.price;
//         const currency="INR";
        
    

//         const options={
//             amount:amount*100,
//             currency,
//             receipt:Math.random(Date.now()).toString(),
//             notes:{
//                 courseId,
//                 userId
//             }
//         }

//         //initiate the payment using razorpay
//         const paymentResponse=await instance.orders.create(options);
//         console.log(paymentResponse);

//         //return response
//         return res.status(200).json({
//             success:true,
//             courseName:courseDetails.courseName,
//             courseDescription:courseDetails.courseDescription,
//             thumbnail:courseDetails.thumbnail,
//             orderId:paymentResponse.id,
//             currency:paymentResponse.currency,
//             amount:paymentResponse.amount

//         })
//     }catch(error){
//         console.log(error);
//         return res.status(500).json({
//                 success:false,
//                 message:error.message
//             })
//     }
    
    
// }

//controller that will be called when we click on the buy now
//basically it initiates the razorpay order
//it will be able to make payments for multiple courses in a single time
exports.capturePayment = async (req,res)=>{
    
    const {courses} = req.body;
    const userId = req.user.id;

    if(courses.length===0){
        return res.json({success:false,message:"Please provide courseId"});
    }

    let totalAmount=0;
    for(let course_id of courses){
        let course;
        try{
            course = await Course.findById(course_id);

            if(!course){
                return res.json({success:false,message:"could not find the course"})
            }

            let uid = new mongoose.Types.ObjectId(userId)
            if(course.studentsEnrolled.includes(uid)){
                return res.json({success:false,message:"Student is already enrolled"})
            }

            totalAmount+=course.price;
        }catch(error){
            console.log(error);
            return res.status(500).json({success:false,message:error.message})
        }
    }

    const options = {
        amount:totalAmount*100,
        currency:"INR",
        receipt:Math.random(Date.now()).toString()
    }

    //create order
    try{
        const paymentResponse = await instance.orders.create(options);
        res.json({
            success:true,
            message:paymentResponse
        })
    }catch(error){
        console.log(error)
        return res.status(500).json({
            success:false,message:"could not initiate order"
        })
    }
}

//verify signature of razorpay and server
// exports.verifySignature=async (req,res)=>{
//     const webhookSecret="1234";

//     //we know that the signature sent by razorpat would we in encrypted format and we cannot convert back into
//     //original format but all that we can do is we can encrypt secret key on the server and then we can match
//     //both keys to verify signature

//     //signature sent by razorpay in encrypted format
//     const signature=req.headers["x-razorpay-signature"];

//     //this function takes hashing algo name as a 1st argument and text as a 2nd argument that needs to be encrypted
//     const shasum=crypto.createHmax("sha256",webhookSecret);
//     //above function will return Hmac object and it is converted into string using below statement
//     shasum.update(JSON.stringify(req.body));
//     //below statement convert it into hexadecimal format
//     const digest=shasum.digest("hex");

//     if(digest===signature){
//         console.log("Payment is authorized");

//         //now we have to provide access to the course to user
//         //for that we need to update course and user model 
//         //but we can not fetch course id from req.body as this request is not made from the frontend rather 
//         //from razorpay after successfull payment

//         //we don't need to remeber all properties we can check using clg(req)
//         const {userId,courseId}=req.body.payload.payment.entity.notes;

//         try{
//             //fullfill the action

//             //find the course and enroll the student in it.
//             const enrolledCourse=await Course.findOneAndUpdate({_id:courseId},
//                                 {$push:
//                                     {
//                                         studentsEnrolled:userId
//                                     }
//                                 },{new:true});
//             if(!enrolledCourse){
//                 return res.status(500).json({
//                     success:false,
//                     message:'course not found'
//                 })
//             }
//             console.log(enrolledCourse);
            
//             //find the user and make entry of course in it
//             const enrolledStudent=await User.findOneAndUpdate({_id:userId},
//                 {$push:
//                     {
//                         courses:courseId
//                     }
//                 },{new:true});
            
//                 if(!enrolledStudent){
//                     return res.status(500).json({
//                         success:false,
//                         message:'enrolled student  not found'
//                     })
//                 }    
//             console.log(enrolledStudent);
//             //confirmation mail send
//             const emailResponse=await mailSender(
//                                         enrolledStudent.email,
//                                         "Congratulations",
//                                         "Congratulations, You are onboarded on Codehelp course",


//             );
//             console.log(emailResponse);

//             //return response
//             return res.status(200).json({
//                 success:true,
//                 message:'signature varified and course added'
//             })

//         }catch(error){
//             return res.status(500).json({
//                 success:false,
//                 message:error.message
//             })
//         }
//     }else{
//         return res.status(500).json({
//             success:true,
//             message:'invalid request'
//         })
//     }


        
    
// }

// verify payment 
exports.verifyPayment= async (req,res)=>{
    const razorpay_order_id = req.body?.razorpay_order_id;
    const razorpay_payment_id = req.body?.razorpay_payment_id;
    const razorpay_signature = req.body?.razorpay_signature;
    const courses = req.body?.courses;
    const userId = req.user.id;

    if(!razorpay_order_id||!razorpay_payment_id||!razorpay_signature||!courses||!userId){
        return res.status(400).json({success:false,message:"Payment Failed"});
    }

    let body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
        .createHmac("sha256",process.env.RAZORPAY_SECRET)
        .update(body.toString())
        .digest("hex");

    if(expectedSignature===razorpay_signature){
        //enroll the student
        await enrollStudents(courses,userId,res);
        //send success response
        return res.status(200).json({success:true,message:"Payment Verified"})
    }
    return res.status(200).json({success:false,message:"Payment failed"})
}

const enrollStudents = async (courses,userId,res)=>{
    if(!courses||!userId){
        return res.status(400).json({success:false,message:"Please provide data for courses or userid"})
    }

    for(const courseId of courses){
       try{
         //find the course and enroll student in it
         const enrolledCourse = await Course
         .findByIdAndUpdate({_id:courseId},
         {$push:{studentsEnrolled:userId}},
         {new:true})

         if(!enrolledCourse){
            return res.status(500).json({success:false,message:"course not found"})
         }

         const courseProgress = await CourseProgress.create({
            courseID:courseId,
            userId:userId,
            completedVideos:[]
         })

         //find the student and add the course in their list of enrolled courses
         const enrolledStudent = await User.findByIdAndUpdate(
            userId,
            {$push:{
                courses:courseId,
                courseProgress:courseProgress._id
            }},
            {new:true}
         )

        console.log("Enrolled student: ", enrolledStudent);
        // Send an email notification to the enrolled student
        const emailResponse = await mailSender(
            enrolledStudent.email,
            `Successfully enrolled into ${enrolledCourse.courseName}`,
            courseEnrollmentEmail(
                enrolledCourse.courseName,
                `${enrolledStudent.firstName} ${enrolledStudent.lastName}`
            )
        )
        // console.log("Email sent successfully: ", emailResponse.response);

       }catch(error){
        console.log(error)
        return res.status(400).json({ success: false, error: error.message })
       }
    }
}


exports.sendPaymentSuccessEmail = async (req,res)=>{
    const {orderId,paymentId,amount} = req.body;

    const userId = req.user.id;

    if(!orderId||!paymentId||!amount||!userId){
        return res.status(400).json({success:false,message:"Please provide all fields"})
    }

    try{
        //find the student
        const enrolledStudent = await User.findById(userId);

        //send mail to email of that student
        await mailSender(
            enrolledStudent.email,
            "Payment Recieved",
            paymentSuccessEmail(
                `${enrolledStudent.firstName} ${enrollStudents.lastName}`,
                amount/100,
                orderId,
                paymentId)
        )


    }catch(error){
        console.log("error in sending mail...",error);
        return res.status(500).json({success:false,message:"Could not send email"})
    }
}
