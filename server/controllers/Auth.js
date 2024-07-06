const OTP=require('../models/OTP');
const User = require('../models/User');
const otpGenerator=require('otp-generator')
const bcrypt=require('bcrypt')
const Profile=require('../models/Profile')
const jwt=require('jsonwebtoken');
const mailSender = require('../utils/mailSender');
const passwordUpdated=require('../mail/templates/passwordUpdated');
require('dotenv').config();
//sendOtp
exports.sendOTP=async (req,res)=>{

    try{
        //fetch email from req.body
        const {email}= req.body;

        console.log(email);
        //check if user already exist
        const userAlreadyPresent=await User.findOne({email});

        //if user already exist return response
        if(userAlreadyPresent){
            return res.status(401).json({
                success:false,
                message:"user already exist"
            })
        }

        //generate otp
        var otp=otpGenerator.generate(6,{
            upperCaseAlphabets:false,
            lowerCaseAlphabets:false,
            specialChars:false
        })
        console.log(otpGenerator)

        //check unique otp or not
        var result=await OTP.findOne({otp:otp});

        while(result){
            otp=otpGenerator.generate(6,{
                upperCaseAlphabets:false,
                lowerCaseAlphabets:false,
                specialChars:false
            })
            result=await OTP.findOne({otp:otp});
        }

        const payloadOtp={email,otp};

        //create an entry for otp
        const otpBody=await OTP.create(payloadOtp);
        console.log(otpBody);

        res.status(200).json({
            success:true,
            message:'otp sent successfully',
            otp
        })

    }catch(error){
       res.status(500).json({
        success:false,
        message:"otp cannot generated"
       })
    }
}

//signup
exports.signup=async(req,res)=>{
    try{
        //fetch data from req.body
        const {
            firstName,
            lastName,
            email,
            password,
            confirmPassword,
            accountType,
            otp
        }=req.body;

        //validation
        if(!firstName||!lastName||!password||!confirmPassword||!email||!otp){
            return res.status(403).json({
                success:false,
                message:"all fields are required"
            })
        }
        console.log("otp sent in the request is:"+otp);

        //2 password match
        if(password!==confirmPassword){
            return res.status(400).json({
                success:true,
                message:"password and confirm password must match"
            })
        }
        //check user already exist or not
        const existingUser=await User.findOne({email});
        if(existingUser){
            return res.status(400).json({
                success:false,
                message:'user already exists'
            })
        }

        //find most recent otp stored for the user
        const recentOtp=await OTP.find({email}).sort({createdAt:-1}).limit(1);
        console.log("recent otp is"+recentOtp);
        console.log(otp===recentOtp.otp)
        console.log("otp in the request is = ",otp);
        console.log("otp in model is = ",recentOtp);
        console.log(recentOtp.otp);
        //otp validate
        if(recentOtp.length===0){
            //otp not found
            return res.status(400).json({
                success:false,
                message:'otp not found'
            })
        }else if(otp!==recentOtp[0].otp){
            return res.status(400).json({
                success:false,
                message:'invalid otp'
            })
        }

        //hash password 
        const hashedPassword=await bcrypt.hash(password,10);
        //entry into db

        const profileDetails=await Profile.create({
            gender:null,
            dateOfBirth:null,
            about:null,
            contactNumber:null
        })

        const user=User.create({
            firstName,
            lastName,
            email,
            password:hashedPassword,
            accountType,
            additionalDetails:profileDetails._id,
            image:`https://api.dicebear.com/5.x/initials/svg?seed=${firstName}${lastName}`,
        })
        //return response
        return res.status(200).json({
            success:true,
            message:'user registered successfully'
        })
    }catch(error){
        return res.status(500).json({
            success:false,
            message:'user cannot be registered. Please try again'
        })
    }
}
//login
exports.login=async(req,res)=>{
    try{
        //get data from req.body
        const {email,password}=req.body;
        //validation data
        console.log("email="+email+"password="+password);
        if(!email||!password){
            return res.status(403).json({
                success:false,
                message:'all fields are required. Try again!'
            })
        }
        //user chek exists or not
        const user=await User.findOne({email}).populate("additionalDetails");
        if(!user){
            return res.status(403).json({
                success:false,
                message:'user in not registered!'
            })
        }
        //generate jwt token,after password matching
        if(await bcrypt.compare(password,user.password)){
            const payload={
                email:user.email,
                id:user._id,
                role:user.accountType
            }
            const token=jwt.sign(payload,process.env.JWT_SECRET,{
                expiresIn:"2h",
            })
            //in below 2 statement we are not making entry in database rather we are adding properties in the object
            //fetched from database means database will have no effect
            user.token=token;
            user.password=undefined;
            //create cookie and response
            const options={
                expires:new Date(Date.now()+3*24*60*60*1000),
                httpOnly:true
            }
           
            return res.cookie("token",token,options).status(200).json({
                success:true,
                token,
                user,
                message:"Logged in successfully"
            })
        }else{
            return res.status(401).json({
                success:false,
                message:"Password is incorrect"
            })
        }


    }catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
          
            message:"user is not logged in"
        })
    }
}
//change password
exports.changePassword=async (req,res)=>{
    try{
        //get user details 
        const userDetails = await  User.findById(req.user.id);

        //get old password and new password from req.body
        const {oldPassword,newPassword} = req.body;

        //validate old password
        const isPasswordMatch = await bcrypt.compare(oldPassword,userDetails.password);

        if (!isPasswordMatch) {
            // If old password does not match, return a 401 (Unauthorized) error
            return res
              .status(401)
              .json({ success: false, message: "The password is incorrect" })
        }

        //update password
        const encryptedPassword = await bcrypt.hash(newPassword,10);
        const updatedUserDetails = await User.findByIdAndUpdate(
            req.user.id,
            {password:encryptedPassword},
            {new:true}
        )

          // Send notification email
        const emailResponse = await mailSender(
          updatedUserDetails.email,
          "Password for your account has been updated",
          passwordUpdated(
            updatedUserDetails.email,
            `Password updated successfully for ${updatedUserDetails.firstName} ${updatedUserDetails.lastName}`
          )
        )
        console.log("Email sent successfully:", emailResponse.response)

        return res.status(200).json({
            success:true,
            message:"password updated successfully"
        })

    }catch(error){
        return res.status(500).json({
            success:false,
            message:"error while changing password"
        })
    }
}