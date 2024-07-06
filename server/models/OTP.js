const mongoose=require('mongoose');
const mailSender=require('../utils/mailSender')
const emailTemplate = require('../mail/templates/emailVerificationTemplate');



const OTPSchema=new mongoose.Schema({
    email:{
        type:String,
        required:true,
    },
    otp:{
        type:String,
        required:true
    },
    createdAt:{
        type:Date,
        default:Date.now(),
        expires:5*60
    }
    
})

//--> a function to send emails
async function sendVerificationEmail(email,otp){
    try{
            const mailResponse=await mailSender(email,"Verification from Study notion",emailTemplate(otp));
            console.log(`email sends successfully ${mailResponse}`)
    }catch(error){
        console.log("error occurred while sending emails"+error);
        throw error;
    }
}

OTPSchema.pre("save",async function(next){

    // send an email only when a new document is created 
    if(this.isNew)
        await sendVerificationEmail(this.email,this.otp);
    next();
}) 

module.exports=mongoose.model("OTP",OTPSchema);