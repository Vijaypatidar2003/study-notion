const jwt=require('jsonwebtoken');
const User=require('../models/User');
require('dotenv').config();

//auth
exports.auth=async (req,res,next)=>{
    try{
        //extract token 
        const token=req.cookies.token
                    ||req.body.token
                    ||req.header('Authorization').replace("Bearer ","");

        //if token in missing then return response
        if(!token){
            return res.status(401).json({
                success:false,
                message:'token is missing'
            })
        }

        //verify token
        try{
        const decodePayload=await jwt.verify(token,process.env.JWT_SECRET);
        console.log(decodePayload)

        req.user=decodePayload;

        }catch(error){
            //verification failed then return response
            return res.status(401).json({
                success:false,
                message:'token is invalid'
            })

        }
        next();

    }catch(error){
        return res.status(401).json({
            success:false,
            message:'Something went wrong while validating the token'
        })

    }
}


//isStudent
exports.isStudent=async (req,res,next)=>{
    try{
        if(req.user.role!=="Student"){
            return res.status(401).json({
                success:false,
                message:'This is a protected route for Students only'
            })
        }
        next();

    }catch(error){
        return res.status(500).json({
            success:false,
            message:'User role cannot be verified, Please try again!'
        })
    }
}

//isInstructor
exports.isInstructor=async (req,res,next)=>{
    try{
        if(req.user.role!=="Instructor"){
            return res.status(401).json({
                success:false,
                message:'This is a protected route for Instructors only'
            })
        }
        next();

    }catch(error){
        return res.status(500).json({
            success:false,
            message:'User role cannot be verified, Please try again!'
        })
    }
}


//isAdmin
exports.isAdmin=async (req,res,next)=>{
    try{
        if(req.user.role!=="Admin"){
            return res.status(401).json({
                success:false,
                message:'This is a protected route for Admin only'
            })
        }
        next();

    }catch(error){
        return res.status(500).json({
            success:false,
            message:'User role cannot be verified, Please try again!'
        })
    }
}