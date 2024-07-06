const express=require('express');
const Router=express.Router();

//import required controllers
const {
    capturePayment,
    verifyPayment,
    sendPaymentSuccessEmail,
}   = require('../controllers/Payments');

//import require middlewares
const {auth,isStudent}=require('../middlewares/auth');

//routes for capture payment
Router.post('/capturePayment',auth,isStudent,capturePayment);

//routes for verify payment
Router.post('/verifyPayment',auth,isStudent,verifyPayment);

//routes for send success email
Router.post('/sendPaymentSuccessEmail',auth,isStudent,sendPaymentSuccessEmail)





 module.exports=Router;