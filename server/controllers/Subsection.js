const SubSection=require('../models/SubSection');
const Section=require('../models/Section');
const {uploadImageToCloudinary}=require('../utils/imageUploader');

exports.createSubSection=async(req,res)=>{
    try{
        //fetch data from req.body
        const {title, description,sectionId}=req.body;
        //fetch video
        const video=req.files.videoFile;
        //validation
        if(!title||!description||!video||!sectionId){
            return res.status(400).json({
                success:false,
                message:'All fields are required'
            })
        }
        //upload video on cloudinary
        const videoFile=await uploadImageToCloudinary(video,process.env.FOLDER_NAME);

        //create subsection in database
        const subsectionDetails=await SubSection.create({
            title:title,
            description:description,
            timeDuration:videoFile.duration,
            videoUrl:videoFile.secure_url
        })
        
        //update section with subsection ObjectId
        const updatedSection= await Section.findByIdAndUpdate(sectionId,
                                        {$push:{
                                                    subSection:subsectionDetails._id
                                               }
                                        },
                                        {new:true}).populate("subSection");

        //updated section here after populating query
        //return response
        return res.status(200).json({
            success:true,
            message:'sub section  created',
            data:updatedSection
        })

    }catch(error){
        return res.status(500).json({
            success:false,
            message:'sub section cannot be created'
        })
    }
}

//update subsection
exports.updateSubSection=async (req,res)=>{
    try{
        //fetch data
        const {subSectionId,title,description,sectionId}=req.body;

        //validation
        if(!subSectionId){
            return res.status(400).json({
                success:false,
                message:'subsection id is required'
            })
        }

        const subSection=await SubSection.findById(subSectionId);
        if(!subSection){
            return res.status(404).json({
                success:false,
                message:'sub section does not exist'
            })
        }
        
        if(title!==undefined){
            subSection.title=title;
        }

        if(description!==undefined){
            subSection.description=description;
        }

        if(req.files&&req.files.videoFile!==undefined){
            //extract videofile
            const video=req.files.videoFile;
            //upload video file on cloudinary
            const uploadedVideo=await uploadImageToCloudinary(video,process.env.FOLDER_NAME);
            //update video url
            subSection.videoUrl=uploadedVideo.secure_url;

            subSection.timeDuration=uploadedVideo.duration
        }
        
        //update all the data in subsection 
        await subSection.save();

        //find updated section and return it
        const updatedSection = await Section.findById(sectionId).populate("subSection");

        console.log("updated section", updatedSection)

        //return response
        return res.status(200).json({
            success:true,
            message:'sub section updated successfully',
            data:updatedSection
        })

    }catch(error){
        return res.status(500).json({
            success:false,
            message:'sub section cannot be updated'
        })
    }
}

//delete subsection

exports.deleteSubSection=async (req,res)=>{
    try{
        //fetch subsectionid and sectionId
        const {subSectionId,sectionId}=req.body;

        //validation
        if(!subSectionId||!sectionId){
            return res.status(400).json({
                success:false,
                message:'both fields are required'
            })
        }

        //remove subsection from section model
        await Section.findByIdAndUpdate(sectionId,{
            $pull:{subSection:subSectionId}
        });
        //delete subsection
        const subSection=await SubSection.findByIdAndDelete(subSectionId);

        if(!subSection){
            return res.status(404)
            .json({
                success:false,
                message:"SubSection Not Found"
            })
        }

        //find updated section and return it
        const updatedSection = await findById(sectionId).populate("subSection");
        //return response
        return res.status(200).json({
            success:true,
            message:'sub section deleted successfully',
            data:updatedSection
        })

    }catch(error){
        console.error(error)
        return res.status(500).json({
          success: false,
          message: "An error occurred while deleting the SubSection",
        })    
    }
}