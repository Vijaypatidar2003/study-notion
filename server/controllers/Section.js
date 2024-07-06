
const Section= require('../models/Section');
const Course = require('../models/Course')
const SubSection = require('../models/SubSection');

exports.createSection=async (req,res)=>{
    try{
        //fetch data
        const {sectionName,courseId}=req.body
        console.log("inside server createsection=",sectionName)
        console.log(courseId);
        //validation
        if(!sectionName||!courseId){
            return res.status(400).json({
                success:false,
                message:"both fields are required"
            })  
        }
        //create section
        const newSection=await Section.create({sectionName});
        console.log("new Section=",newSection)
        console.log("above the updated course")
        //add in the course
         await Course.findByIdAndUpdate(
			courseId,
			{
				$push: {
					courseContent: newSection._id,
				},
			},
			{ new: true }
		)

        console.log("above  the find")
        const updatedCourse = await Course.findById(courseId)
        .populate("courseContent").exec();

			
            console.log("updatedCourse=",updatedCourse)
        //return response
        return res.status(200).json({
            success:true,
            message:"section created successfully",
            updatedCourse
        })
    }catch(error){
        console.log("inside catch")
        return res.status(500).json({
            success:false,
            message:"section cannot be created",
            error:error.message
        })
    }
}

// update section
exports.updateSection=async(req,res)=>{
    try{
        //fetch data
        const {sectionName,sectionId,courseId}=req.body;
        //validate data
        if(!sectionName||!sectionId||!courseId){
            return res.status(400).json({
                success:false,
                message:"all fields are required"
            }) 
        }

        //update the section
        const updatedSection=await Section.findByIdAndUpdate(sectionId,{sectionName:sectionName},{new:true});

        const course = await Course.findById(courseId).populate({
            path:"courseContent",
            populate:{
                path:"subSection"
            }
        }).exec()

        console.log("course",course);

        //return response
        return res.status(200).json({
            success:true,
            message:updatedSection,
            data:course
        })

    }catch(error){
        console.error("Error updating section:", error)
        res.status(500).json({
          success: false,
          message: "Internal server error",
          error: error.message,
        })
    }
}

// delete section
exports.deleteSection=async(req,res)=>{
    try{
        //fetch id from req.body
        const {sectionId,courseId}=req.body;

        //validation
        if(!sectionId||!courseId){
            return res.status(400).json({
                success:false,
                message:"all fields are required"
            }) 
        }

        //update course by removing section from course
        await Course.findByIdAndUpdate(courseId,{
            $pull:{
                courseContent:sectionId
            }
        })
        
        const section = await Section.findById(sectionId);
        if(!section){
            return res.status(404).json({
                success:false,
                message:"Section not found"
            })
        }

        // delete the associate subsection
        await SubSection.deleteMany({_id: {$in : section.subSection}});
           
        //delete section from Section collection
        await Section.findByIdAndDelete(sectionId);

        // find the updated course and return it
        const course = await Course.findById(courseId).populate("courseContent").exec()
      

        //return response
        return res.status(200).json({
            success:true,
            message:"section deleted successfully",
            data:course
        })

    }catch(error){
        return res.status(500).json({
            success:false,
            message:error.message
        })
    }
}