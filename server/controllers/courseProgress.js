const SubSection = require("../models/SubSection")
const CourseProgress = require("../models/CourseProgress")


exports.updateCourseProgress = async (req,res)=>{
    const {courseId,subSectionId} = req.body;
    const userId = req.user.id;

    try{
        //if subsection is valid or not
        const subSection = await SubSection.findById(subSectionId);

        if(!subSection){
            return res.status(404).json({success:false,message:"Invalid subsection"})
        }

        //check for old entry
        const courseProgress = await CourseProgress.findOne({
            courseID:courseId,
            userId:userId
        })

        if(!courseProgress){
            return res.status(404).json({
                success:false,
                message:"course progress does not exist"
            })
        }else{
            //check video is already marked as completed
            if(courseProgress.completedVideos.includes(subSectionId)){
                return res.status(400).json({
                    success:false,
                    message:"subsection already completed"
                })
            }

            //push lecture in completedVideos
            courseProgress.completedVideos.push(subSectionId);
            await courseProgress.save();
        }
        return res.status(200).json({
            success:true,
            message:"marked lecture as completed"
        })
    }catch(error){
        res.status(500).json({
            success:false,
            message:"Internal Server Error"
        })
    }
}