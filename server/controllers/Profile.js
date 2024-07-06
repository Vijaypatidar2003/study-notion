const Profile=require('../models/Profile');
const User=require('../models/User');
const {uploadImageToCloudinary} = require("../utils/imageUploader")
require("dotenv").config();
const {convertSecondsToDuration} = require("../utils/secToDuration")
const CourseProgress =require("../models/CourseProgress")


//create update profile handler
exports.updateProfile=async (req,res)=>{
    try{
        //fetch data
        const {
            firstName="",
            lastName="",
            dateOfBirth="", 
            about="",
            contactNumber="",
            gender=""}=req.body;
        //fetch userid
        const userid=req.user.id;
        //validation
        if(!contactNumber || !gender || !userid){
            return res.status(400).json({
                success:false,
                message:'All fields are required'
            })
        }
        
        //find the user
        const userDetails = await User.findById(userid);
        //extract profileId of the user
        const profileId=userDetails.additionalDetails;
    
        const user = await User.findByIdAndUpdate(userid,{
            firstName:firstName,
            lastName:lastName
        })

        await user.save();
        //find profile
        const profileDetails=await Profile.findById(profileId);
        //update profile object 
        
        if(dateOfBirth!==""){
            profileDetails.dateOfBirth=dateOfBirth;
        }
        if(about!==""){
            profileDetails.about=about;
        }
        profileDetails.contactNumber=contactNumber;
        profileDetails.gender=gender;

        //update profile document
        profileDetails.save();

        //find the updated user details
        const updatedUserDetails =await User.findById(userid).populate("additionalDetails").exec();
        //return response
        return res.status(200).json({
            success:true,
            message:'profile  updated successfully',
            updatedUserDetails
        })

        

    }catch(error){
        return res.status(500).json({
            success:false,
            message:'profile cannot be updated'
        })
    }
}

//delete Account
//how can we schedule deleted operation
exports.deleteAccount=async(req,res)=>{
    try{
        //fetch userid
        const {userId}=req.user.id;
        //validation
        const userDetails=await User.findById(userId);
        if(!userDetails){
            return res.status(404).json({
                success:false,
                message:'User  not found'
            })
        }
      
        //delete profile
        await Profile.findByIdAndDelete({_id:userDetails.additionalDetails});
        //unenroll user from all enrolled courses
        //delete user
        await User.findByIdAndDelete({_id:userid});
        //return response
        return res.status(200).json({
            success:true,
            message:'User deleted successfully'
        })

    }catch(error){
        return res.status(500).json({
            success:false,
            message:'User Account cannot be deleted'
        })
    }
}

exports.getAllUserDetails=async (req,res)=>{
    try{
        //get user id
        const id=req.user.id;
        //get user details
        const userDetails=await User.findById({_id:id}).populate('additionalDetails');
        //return response
        return res.status(200).json({
            success:true,
            message:userDetails
        })

    }catch(error){
        return res.status(500).json({
            success:false,
            message:'User details cannot be accessed'
        })
    }
}

//update profile picture
// exports.updateDisplayPicture= async (req,res)=>{
//     try{
//         //fetch profile from the req.files
//         const {profile}=req.files.profile;
        
//         //validation
//         if(!profile){
//             return res.status(404).json({
//                 success:false,
//                 message:"profile is not found"
//             }) 
//         }
//         //get user id
//         const id=req.user.id;
//         //upload on cloudinary
//         const uploadedProfile=await uploadImageToCloudinary(profile,"onlineEducation",1000,1000);

//         if(!uploadedProfile){
//             return res.status(402).json({
//                 success:false,
//                 message:"profile couldn't uploaded to cloudinary"
//             })
//         }

//         //update in database
//         const updatedUser=await User.findByIdAndUpdate(id,{image:uploadedProfile.secure_url},{new:true});
//         if(!updatedUser){
//             return res.status(401).json({
//                 success:false,
//                 message:"profile couldn't uploaded to database"
//             })
//         }

//         //return res
//         return res.status(200).json({
//             success:true,
//             message:"profile updated successfully"
//         })



//     }catch(error){
//         return res.status(500).json({
//             success:false,
//             message:"problem in updating profile picture"
//         })
//     }
// }
exports.updateDisplayPicture = async (req, res) => {
    try {
      const displayPicture = req.files.displayPicture
      const userId = req.user.id
      const image=await uploadImageToCloudinary(displayPicture,"onlineEducation",1000,1000);
      console.log(image)
      const updatedProfile = await User.findByIdAndUpdate(
        { _id: userId },
        { image: image.secure_url },
        { new: true }
      )
      res.send({
        success: true,
        message: `Image Updated successfully`,
        data: updatedProfile,
      })
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      })
    }
  }
//get enrolled courses
exports.getEnrolledCourses= async (req,res)=>{
    try {
        const userId = req.user.id
        console.log("userid=",userId);
        let userDetails = await User.findOne({
          _id: userId,
        })
          .populate({
            path: "courses",
            populate: {
              path: "courseContent",
              populate: {
                path: "subSection",
              },
            },
          })
          .exec()
          console.log("userDetails=",userDetails)
          console.log("userDetails.courses.length=",userDetails.courses.length)
          console.log("userDetails.courses[0].courseContent.length",userDetails.courses[0].courseContent.length)
        userDetails = userDetails.toObject()
        var SubsectionLength = 0
        for (var i = 0; i < userDetails.courses.length; i++) {
          let totalDurationInSeconds = 0
          SubsectionLength = 0
          for (var j = 0; j < userDetails.courses[i].courseContent.length; j++) {
            totalDurationInSeconds += userDetails.courses[i].courseContent[
              j
            ].subSection.reduce((acc, curr) => acc + parseInt(curr.timeDuration), 0)
            userDetails.courses[i].totalDuration = convertSecondsToDuration(
              totalDurationInSeconds
            )
            SubsectionLength +=
              userDetails.courses[i].courseContent[j].subSection.length
          }
          console.log("subsection length=",SubsectionLength)
          let courseProgressCount = await CourseProgress.findOne({
            courseID: userDetails.courses[i]._id,
            userId: userId,
          })
          console.log("courseProgressCount=",courseProgressCount)
          courseProgressCount = courseProgressCount?.completedVideos.length
           
          if (SubsectionLength === 0) {
            userDetails.courses[i].progressPercentage = 100
          } else {
            // To make it up to 2 decimal point
            const multiplier = Math.pow(10, 2)
            userDetails.courses[i].progressPercentage =
              Math.round(
                (courseProgressCount / SubsectionLength) * 100 * multiplier
              ) / multiplier
          }
        }
    
        if (!userDetails) {
          return res.status(400).json({
            success: false,
            message: `Could not find user with id: ${userDetails}`,
          })
        }
        return res.status(200).json({
          success: true,
          data: userDetails.courses,
        })
      } catch (error) {
        return res.status(500).json({
          success: false,
          message: error.message,
        })
      }
    }

//instructorDashboard
exports.instructorDashboard = async (req, res) => {
  try {
    const courseDetails = await Course.find({ instructor: req.user.id })

    const courseData = courseDetails.map((course) => {
      const totalStudentsEnrolled = course.studentsEnroled.length
      const totalAmountGenerated = totalStudentsEnrolled * course.price

      // Create a new object with the additional fields
      const courseDataWithStats = {
        _id: course._id,
        courseName: course.courseName,
        courseDescription: course.courseDescription,
        // Include other course properties as needed
        totalStudentsEnrolled,
        totalAmountGenerated,
      }

      return courseDataWithStats
    })

    res.status(200).json({ courses: courseData })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server Error" })
  }
}