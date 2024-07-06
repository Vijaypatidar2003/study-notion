//when the user clicks on forgot password he gets an interface containing input field of email then he enters 
//his email then submit now resetPasswordToken controller sends an email to the user containig link to page
//where he fills his new password then submit after that resetPassword controller gets execute and reset password
//in database
const { findOne, findOneAndUpdate } = require('../models/OTP');
const User=require('../models/User');
const mailSender=require('../utils/mailSender');
const bcrypt=require('bcrypt')
//ResetPasswordToken -->send an email to reset password
exports.resetPasswordToken=async (req,res)=>{
    try{
        //fetch email from req.body
        const {email}=req.body;

        //validation
        if(!email){
            return res.status(401).json({
                success:false,
                message:"email field is required"
            })
        }
        //check if the user exist
        const user=await User.findOne({email});

        if(!user){
            return res.status(401).json({
                success:false,
                message:"Your email is not registered with us"
            })
        }
        
        //generate token
        const token=crypto.randomUUID();

        //update User by adding token and expiration time
        const updatedDetails=await User.findOneAndUpdate({email},{token:token,
                             resetPasswordExpires:Date.now()+5*60*1000},
                             {new:true});
        //create url
        //url for every user would be different that's why we will generate unique token  and it is different than jwt token
        const url=`http://localhost:3000/update-password/${token}`;

        //send mail containing url
        await mailSender(email,"Password Reset Link",`Password Reset Link:${url}`);

        //return res
        return res.status(200).json({
            success:true,
            message:'mail sent successfully. Please check mail and reset password'
        })
       
    }catch(error){
        return res.status(500).json({
            success:false,
            message:'Something went wrong while reset password'
        })
    }
}


//resetPassword-->reset password in database
exports.resetPassword=async (req,res)=>{
    try{

        //fetch data from req.body
        const {password,confirmPassword,token}=req.body;
        
      
        if(password!==confirmPassword){
            return res.json({
                success:false,
                message:'new Password and confirm Password must be same'
            })
        }

      
        //get userDetails from db using token
        const userDetails=await User.findOne({token});
        //if no entry invalid token
       
        if(!userDetails){
            return res.json({
                success:false,
                message:'invalid token'
            })
        }
        
        //token time check
        if(userDetails.resetPasswordExpires<Date.now()){
            return res.json({
                success:false,
                message:'token expired'
            })
        }
        
        //hash password
        const hashedPassword= await bcrypt.hash(password,10);
        

        //update password in database
        const newUserDetails=await User.findOneAndUpdate({token},
            {password:hashedPassword},
            {new:true})
            

        //return response
        return res.json({
            success:true,
            message:'Password reset successfully'
        })
    }catch(error){
        return res.json({
            success:false,
            message:'both fields are required'
        })
    }
}