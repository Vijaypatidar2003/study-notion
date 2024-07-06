const Course = require("../models/Course");
const Category = require("../models/Category");
const User = require("../models/User");
const Section = require("../models/Section");
const SubSection = require("../models/SubSection")
const { uploadImageToCloudinary } = require("../utils/imageUploader");
const e = require("express");
const CourseProgress = require("../models/CourseProgress");
const { convertSecondsToDuration } = require("../utils/secToDuration");
const RatingAndReview = require("../models/RatingAndReview");

//create course handler
exports.createCourse = async (req, res) => {
  try {
    // Get user ID from request object
    const userId = req.user.id

    // Get all required fields from request body
    let {
      courseName,
      courseDescription,
      whatYouWillLearn,
      price,
      tag: _tag,
      category,
      status,
      instructions: _instructions,
    } = req.body
    // Get thumbnail image from request files
    const thumbnail = req.files.thumbnailImage

    // Convert the tag and instructions from stringified Array to Array
    const tag = JSON.parse(_tag)
    const instructions = JSON.parse(_instructions)

    console.log("tag", tag)
    console.log("instructions", instructions)

    // Check if any of the required fields are missing
    if (
      !courseName ||
      !courseDescription ||
      !whatYouWillLearn ||
      !price ||
      !tag.length ||
      !thumbnail ||
      !category ||
      !instructions.length
    ) {
      return res.status(400).json({
        success: false,
        message: "All Fields are Mandatory",
      })
    }
    if (!status || status === undefined) {
      status = "Draft"
    }
    // Check if the user is an instructor
    const instructorDetails = await User.findById(userId, {
      accountType: "Instructor",
    })

    if (!instructorDetails) {
      return res.status(404).json({
        success: false,
        message: "Instructor Details Not Found",
      })
    }

    // Check if the tag given is valid
    const categoryDetails = await Category.findById(category)
    if (!categoryDetails) {
      return res.status(404).json({
        success: false,
        message: "Category Details Not Found",
      })
    }
    // Upload the Thumbnail to Cloudinary
    const thumbnailImage = await uploadImageToCloudinary(
      thumbnail,
      process.env.FOLDER_NAME
    )
    console.log(thumbnailImage)
    // Create a new course with the given details
    const newCourse = await Course.create({
      courseName,
      courseDescription,
      instructor: instructorDetails._id,
      whatYouWillLearn: whatYouWillLearn,
      price,
      tag,
      category: categoryDetails._id,
      thumbnail: thumbnailImage.secure_url,
      status: status,
      instructions,
    })

    // Add the new course to the User Schema of the Instructor
    await User.findByIdAndUpdate(
      {
        _id: instructorDetails._id,
      },
      {
        $push: {
          courses: newCourse._id,
        },
      },
      { new: true }
    )
    // Add the new course to the Categories
    const categoryDetails2 = await Category.findByIdAndUpdate(
      { _id: category },
      {
        $push: {
          courses: newCourse._id,
        },
      },
      { new: true }
    )
    console.log("HEREEEEEEEE", categoryDetails2)
    // Return the new course and a success message
    res.status(200).json({
      success: true,
      data: newCourse,
      message: "Course Created Successfully",
    })
  } catch (error) {
    // Handle any errors that occur during the creation of the course
    console.error(error)
    res.status(500).json({
      success: false,
      message: "Failed to create course",
      error: error.message,
    })
  }
}

//edit course Details
exports.editCourse = async (req,res)=>{
  try{
    const {courseId} = req.body;
    const updates = req.body;

    const course = await Course.findById(courseId);

    if(!course){
      res.status(404).json({
        success:false,
        message:"course not found"
      })
    }

    // if thumbnail image is found, update it 
    if(req.files){
      const thumbnail = req.files.thumbnail;
      const thumbnailImage = await uploadImageToCloudinary(
        thumbnail,
        process.env.FOLDER_NAME
      )
      course.thumbnail = thumbnailImage.secure_url;
    }

    // Update only the fields that are present in the request body
    for(let key in updates){
      if(updates.hasOwnProperty(key)){
        if(key==="tags"||key==="instructions"){
          course[key]=JSON.parse(updates[key]);
        }else{
          course[key]=updates[key]
        }
      }
    }

    console.log("below the for loop=",course)
    await course.save();
    console.log("course saved")

    const updatedCourse = await Course.findOne({_id:courseId})
            .populate({
              path:"instructor",
              populate :{
                path:"additionalDetails"
              }
            })
            .populate("category")
            
            .populate({
              path:"courseContent",
              populate:{
                path:"subSection"
              }
            })
            .exec();

    res.status(200).json({
      success:true,
      data:updatedCourse,
      message:"Course Updated Successfully"
    })
  }catch(error){
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    })
  }

}


//delete course



//getCourse Details
exports.getCourseDetails = async (req, res) => {
  try {
    //extract course id
    const { courseId } = req.body;
    //fetch course
    const courseDetails = await Course.findById({ _id: courseId })
      .populate({
        path: "instructor",
        populate: {
          path: "additionalDetails",
        },
      })
      .populate("category")
      .populate("ratingAndReviews")
      .populate({
        path: "courseContent",
        populate: {
          path: "subSection",
        },
      })
      .exec();

    if (!courseDetails) {
      return res.status(400).json({
        success: false,
        message: `could not find the course with ${courseId}`,
      });
    }

    let totalDurationInSecods = 0;
    courseDetails?.courseContent?.forEach((section)=>{
      section.subSection.forEach((subSection)=>{
        const timeDurationInSeconds = parseInt(subSection.timeDuration);
        totalDurationInSecods+=timeDurationInSeconds;
      })
    })

    const totalDuration = convertSecondsToDuration(totalDurationInSecods);
    return res.status(200).json({
      success: true,
      message: "course details fetched successfully",
      data: {
        courseDetails,
        totalDuration
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//getAllCourses handler
exports.showAllCourses = async (req, res) => {
  try {
    const allCourses = await Course.find({ status: "Published" })
      .populate("instructor")
      .exec();

    return res.status(200).json({
      success: true,
      message: "Data for all courses fetched successfully",
      data: allCourses,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "cannot fetch course data",
    });
  }
};

//get all the courses of instructor
exports.getInstructorCourses = async (req,res)=>{
  try{
    console.log("we are at server")
    //fetch instructor id from request body
    const instructorId = req.user.id;

    //fetch all the courses belonging to instructor
    const instructorCourses = await Course.find({instructor:instructorId}).sort({createdAt:-1});

    //return the instructor courses
    return res.status(200).json({
      success:true,
      data:instructorCourses,
      message:"courses fetched successfully"
    })

  }catch(error){
    console.error(error)
    res.status(500).json({
      success: false,
      message: "Failed to retrieve instructor courses",
      error: error.message,
    })
  }
}

exports.deleteCourse = async (req, res) => {
  try {
    const { courseId } = req.body

    // Find the course
    const course = await Course.findById(courseId)
    if (!course) {
      return res.status(404).json({ message: "Course not found" })
    }

    // Unenroll students from the course
    const studentsEnrolled = course.studentsEnrolled
    for (const studentId of studentsEnrolled) {
      await User.findByIdAndUpdate(studentId, {
        $pull: { courses: courseId },
      })
    }

    // Delete sections and sub-sections
    const courseSections = course.courseContent
    for (const sectionId of courseSections) {
      // Delete sub-sections of the section
      const section = await Section.findById(sectionId)
      if (section) {
        const subSections = section.subSection
        for (const subSectionId of subSections) {
          await SubSection.findByIdAndDelete(subSectionId)
        }
      }

      // Delete the section
      await Section.findByIdAndDelete(sectionId)
    }

    // Delete the course
    await Course.findByIdAndDelete(courseId)

    return res.status(200).json({
      success: true,
      message: "Course deleted successfully",
    })
  } catch (error) {
    console.error(error)
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    })
  }
}

exports.getFullCourseDetails = async (req,res)=>{
  try{
    const {courseId} = req.body;
    const userId = req.user.id;

    const courseDetails = await Course.findOne({
      _id:courseId
    })
    .populate({
      path:"instructor",
      populate:{
        path:"additionalDetails"
      },
    })
    .populate("category")
    
    .populate({
      path:"courseContent",
      populate:{
        path:"subSection"
      }
    })
    .exec();

    if (!courseDetails) {
      return res.status(400).json({
        success: false,
        message: `Could not find course with id: ${courseId}`,
      })
    }

    const courseProgressCount = await CourseProgress.findOne({
      courseID: courseId,
      userId:userId
    })

    console.log("courseProgressCount : ", courseProgressCount)


    let totalDurationInSecods = 0;
    courseDetails.courseContent.forEach((section)=>{
      section.subSection.forEach((subSection)=>{
        const timeDurationInSecods = parseInt(subSection.timeDuration);
        totalDurationInSecods+=timeDurationInSecods;
      })
    })

    const totalDuration = convertSecondsToDuration(totalDurationInSecods);

    return res.status(200).json({
      success:true,
      data:{
        courseDetails,
        totalDuration,
        completedVideos:courseProgressCount?.completedVideos? 
                        courseProgressCount?.completedVideos 
                        :[]
      }
    })
  }catch(error){
    return res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

