const express=require('express');
const router=express.Router();

//import required controllers
const {sendOTP,signup,login,changePassword}=require('../controllers/Auth');
const {resetPasswordToken,resetPassword}=require('../controllers/ResetPassword');

//import required middlewares
const {auth}=require('../middlewares/auth')

console.log("we are in user routes")
/**************************Authentication Routes*****************************/
//routes for sendotp
router.post('/sendotp',sendOTP);

//routes for user login
router.post('/login',login);

//routes for user signup
router.post('/signup',signup);

//routes for changing the password
router.post('/changepassword',auth,changePassword);

/***************************Reset password routes********************************/

//routes for generating reset password token
router.post('/reset-password-token',resetPasswordToken);

//routes for reset password
router.post('/reset-password',resetPassword);

module.exports=router;