const express=require('express');
const Router=express.Router();

//import required controllers
const {
    updateProfile,
    deleteAccount,
    getAllUserDetails,
    updateDisplayPicture,
    getEnrolledCourses,
    instructorDashboard
}   = require('../controllers/Profile');

const {auth}=require('../middlewares/auth');

//routes for update profile
Router.put('/updateProfile',auth,updateProfile);

//routes for delete account
Router.delete('/deleteAccount',auth,deleteAccount);

//routes for get all user details
Router.get('/userDetails',auth,getAllUserDetails);

//routes for update profile picture
Router.put('/updateDisplayPicture',auth,updateDisplayPicture);

//routes for getting enrolled courses
Router.get('/enrolledCourses',auth,getEnrolledCourses);
//routes for instructor dashboard
Router.get("/instructorDashboard",auth,instructorDashboard);

 module.exports=Router;