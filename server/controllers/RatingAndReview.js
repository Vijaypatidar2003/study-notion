const RatingAndReview=require('../models/RatingAndReview');
const Course=require('../models/Course');
const { response } = require('express');
const { default: mongoose } = require('mongoose');

//createRating
exports.createRating=async (req,res)=>{
    try{
        //get rating ,course id ,review and userid
        const {rating,courseId,review}=req.body;
        const userId=req.user.id;

        //validation
        if(!rating || !courseId || !review){
            return res.status(400).json({
                success:false,
                message:"provide data"
            })
        }

        //check wether the course is taken by that user or not
        const courseDetails = await Course.findOne({_id:courseId,studentsEnrolled:{$elemMatch:{$eq:userId}}});
        if(!courseDetails){
            return res.status(404).json({
                success:false,
                message:"student is not enrolled in this course"
            })
        }
        
        //if the student has already reviewed
        const alreadyReviewed=await RatingAndReview.findOne({user:userId,course:courseId});
        if(alreadyReviewed){
            return res.status(400).json({
                success:false,
                message:"course is already reviewed by the student"
            })
        }
     

        //store in the database
        const ratingAndReviewDetails=await RatingAndReview.create({user:userId,rating,review,course:courseId});

        //update course with this rating and review
        const updatedCourse = await Course
        .findByIdAndUpdate(courseId,{$push:{ratingAndReviews:ratingAndReviewDetails._id}},{new:true});

        // return response
        return res.status(200).json({
            success:true,
            message:"Rating and Reviewed successfully",
            ratingAndReviewDetails
        })
    }catch(error){
        return res.status(404).json({
            success:false,
            message:error.message
        })
    }
}

//getAverageRating
exports.getAverageRating=async (req,res)=>{
    try{
        //get course id
        const courseId=req.body.courseId;
        //calculate average rating
        const result=await RatingAndReview.aggregate([
                                                        {
                                                            $match:{
                                                                course:mongoose.Types.ObjectId(courseId)
                                                            }
                                                        },
                                                        {
                                                            $group:{
                                                                _id:null,
                                                                averageRating:{$avg:"$rating"}
                                                            }
                                                        }
                                                    ]);
         
        //return rating                                           
        if(result.length>0){
            return res.status(200).json({
                success:true,
                averageRating:result[0].averageRating
            })
        }
        //if not review and rating exist
        return res.status(200).json({
            success:true,
            message:"average rating is 0, no rating till now",
            averageRating:0
        })
       

    }catch(error){
        return res.status(500).json({
            success:true,
            message:"could not find average rating",
            error:error.message
            
        })
    }
}

//get all rating and reviews
exports.getAllRatingAndReviews=async(req,res)=>{
    try{
       
        const allReviews=await RatingAndReview.find({})
                                              .sort({rating:"desc"})
                                              .populate({
                                                  path:"user",
                                                  select:"firstName lastName email image"
                                              })
                                              .populate({
                                                path:"course",
                                                select:"courseName"
                                              })
                                              .exec();
        return res.status(200).json({
            success:true,
            message:"all reviews fetched successfully",
            data:allReviews
        })
        


    }catch(error){
        return res.status(500).json({
            success:true,
            message:"could not fetch rating and reviews",
            error:error.message
        })
    }
}