const express=require('express');
const Router=express.Router();


const  {
    updateCourseProgress
} = require("../controllers/courseProgress")
/*************************************** import required middlewares ********************************* */
const {auth,isInstructor, isStudent,isAdmin}=require('../middlewares/auth');
/*************************************** course controller imports ********************************* */
const {
    createCourse,
    getCourseDetails,
    showAllCourses,
    editCourse,
    getInstructorCourses,
    deleteCourse,
    getFullCourseDetails
}   = require('../controllers/Course');

/*************************************** category controller imports ********************************* */

const {
    createCategory,
    showAllCategories,
    categoryPageDetails,
}   =require('../controllers/Category');

/***************************************category routes  only for Admin ********************************* */
Router.post('/createCategory',auth,isAdmin,createCategory);
Router.get('/showAllCategories',showAllCategories);
Router.post('/getCategoryPageDetails',categoryPageDetails);


//section controller imports
const {
    updateSection,
    createSection,
    deleteSection
} = require("../controllers/Section")

const {
    createSubSection,
    updateSubSection,
    deleteSubSection
} = require('../controllers/Subsection');
const { createRating, getAllRatingAndReviews } = require('../controllers/RatingAndReview');


//routes for creating course
Router.post('/createCourse',auth,isInstructor,createCourse);

//routes for course details
Router.post('/getCourseDetails',getCourseDetails);

//routes for get all course 
Router.get('/show-courses',auth,showAllCourses);

//routes for update course details
Router.post('/editCourse',auth,isInstructor,editCourse)

//routes for delete course
Router.post("/deleteCourse",auth,isInstructor,deleteCourse)

// Get Details for a Specific Courses
Router.post("/getFullCourseDetails", auth, getFullCourseDetails)

//routes for fetching all courses of specific instructor
Router.get("/getInstructorCourses", auth, isInstructor, getInstructorCourses);
//Add a Section to a Course
Router.post("/addSection", auth, isInstructor, createSection)
// Update a Section
Router.post("/updateSection", auth, isInstructor, updateSection)
//delete section 
Router.post("/deleteSection",auth,isInstructor,deleteSection)

Router.post('/addSubSection',auth,isInstructor,createSubSection)

Router.post('/updateSubSection',auth,isInstructor,updateSubSection);

Router.post('/deleteSubSection',auth,isInstructor,deleteSubSection);

Router.post('/updateCourseProgress',auth,isStudent,updateCourseProgress);

// ************************rating and reviews *****************************
Router.post('/createRating',auth,isStudent,createRating)

Router.get('/getReviews',getAllRatingAndReviews)


module.exports=Router;