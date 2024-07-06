import React, { useEffect,useState} from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux';
import { HiOutlineCurrencyRupee } from "react-icons/hi";
import { MdNavigateNext } from "react-icons/md"
import ChipInput from './ChipInput';
import Upload  from '../Upload';
import { toast } from "react-hot-toast"
import RequirementField from './RequirementField';
import { setStep,setCourse } from '../../../../../slices/courseSlice';
import IconBtn from '../../../../common/IconBtn'
import { COURSE_STATUS } from '../../../../../utils/constants';


import {
    editCourseDetails,
    addCourseDetails,
    fetchCourseCategories
} from '../../../../../services/operations/courseDetailsAPI'

const CourseInformationForm = () => {

    const {
        register,
        handleSubmit,
        setValue,
        getValues,
        formState:{errors},
    } = useForm();


    const {token} = useSelector((state)=>state.auth);
    const dispatch = useDispatch();
    const {course,editCourse} = useSelector((state)=>state.course);
    const [loading, setLoading] = useState(false);
    const [courseCategories,setCourseCategories] = useState([]);

    const getCourseCategories = async ()=>{
        setLoading(true);
        const response = await fetchCourseCategories();
        if(response.length>0){
            console.log("course categories=",response)
            setCourseCategories(response);
        }
        setLoading(false);
    }

    const isFormUpdated = ()=>{
        const currentValues = getValues();

        if(currentValues.courseTitle!==course.courseName ||
            currentValues.courseShortDesc !== course.courseDescription ||
            currentValues.coursePrice !== course.price ||
            currentValues.courseTags.toString() !== course.tag.toString() ||
            currentValues.courseBenefits !== course.whatYouWillLearn ||
            currentValues.courseCategory._id !== course.category._id ||
            currentValues.courseRequirements.toString() !==
              course.instructions.toString() ||
            currentValues.courseImage !== course.thumbnail)
                return true;
        else 
                return false;
    }

    // handle next button click 
    const submitHandler = async (data) =>{
        console.log("data=",data)
        if(editCourse){
           if(isFormUpdated()){
            const formData = new FormData();
            formData.append("courseId",course._id);
            const currentValues = getValues();

            if(currentValues.courseTitle!==course.courseName){
                FormData.append("courseName",data.courseTitle);
            }
            if(currentValues.courseShortDesc!==course.courseDescription){
                FormData.append("courseDescription",data.courseShortDesc);
            }
            if(currentValues.coursePrice!==course.price){
                FormData.append("coursePrice",data.coursePrice);
            }
            if(currentValues.courseTags.toString() !== course.tag.toString()){
                formData.append("tag", JSON.stringify(data.courseTags))
            }
            if(currentValues.courseBenefits !== course.whatYouWillLearn){
                formData.append("whatYouWillLearn", data.courseBenefits)
            }
            if(currentValues.courseCategory._id !== course.category._id) {
                formData.append("category", data.courseCategory)
            }
            if(currentValues.courseRequirements.toString() !== course.instructions.toString()) {
                formData.append("instructions",JSON.stringify(data.courseRequirements))
            }
            if(currentValues.courseImage !== course.thumbnail) {
                formData.append("thumbnailImage", data.courseImage)
            }

            setLoading(true)
            const result = await editCourseDetails(formData,token);
            setLoading(false)
                if(result){
                    dispatch(setStep(2));
                    dispatch(setCourse(result));
                } 
            }else{
            toast.error("No changes made so far")
            return ;
            }

        }else{
            // create a new course 
            const formData = new FormData()
            formData.append("courseName", data.courseTitle)
            formData.append("courseDescription", data.courseShortDesc)
            formData.append("price", data.coursePrice)
            formData.append("tag", JSON.stringify(data.courseTags))
            formData.append("whatYouWillLearn", data.courseBenefits)
            formData.append("category", data.courseCategory)
            formData.append("status", COURSE_STATUS.DRAFT)
            formData.append("instructions", JSON.stringify(data.courseRequirements))
            formData.append("thumbnailImage", data.courseImage)
            console.log("formData=",formData.toString());

            setLoading(true)
            const result = await addCourseDetails(formData,token);
            if (result) {
                dispatch(setStep(2))
                dispatch(setCourse(result))
              }
              setLoading(false)
        }
    }

    useEffect(()=>{

        getCourseCategories();

        if(editCourse){
            setValue("courseTitle", course.courseName)
            setValue("courseShortDesc", course.courseDescription)
            setValue("coursePrice", course.price)
            setValue("courseTags", course.tag)
            setValue("courseBenefits", course.whatYouWillLearn)
            setValue("courseCategory", course.category)
            setValue("courseRequirements", course.instructions)
            setValue("courseImage", course.thumbnail)
        }
    },[])
  return (
    <form onSubmit={handleSubmit(submitHandler)}
          className='rounded-md space-y-8 p-6 border-richblack-700 bg-richblack-800 '
    >
        {/* course title  */}
        <div>
            <label htmlFor='courseTitle'>Course Title <sup>*</sup></label>
            <input 
                type='text'
                id='courseTitle'
                placeholder='Enter course title'
                {...register("courseTitle",{required:true})}
                className='w-full text-richblack-700'
            />
            {errors.courseTitle && (
                <span>Course Title is required</span>
            )   
            }
        </div>

        {/* course description  */}
        <div>
            <label htmlFor='courseShortDesc'>Course Short Description <sup>*</sup></label>
            <textarea
                
                id='courseShortDesc'
                placeholder='Enter Course Description'
                {...register("courseShortDesc",{required:true})}
                className='w-full min-h-[140px] text-richblack-700'
            />
            {errors.courseShortDesc && (
                <span>Course Description is required</span>
            )   
            }
        </div>

        {/* course price  */}
        <div className='relative'>
            <label htmlFor='coursePrice'>Course Price <sup>*</sup></label>
            <input 
                id='coursePrice'
                placeholder='Enter Course Price'
                {...register("coursePrice",{
                    required:true,
                    valueAsNumber:true
                })}
                className='w-full text-richblack-700'
            />
            <HiOutlineCurrencyRupee className='absolute left-1 top-7 text-richblack-800'/>
            {errors.coursePrice && (
                <span>Course Price  is required</span>
            )   
            }
        </div>

        {/* course Category  */}
        <div>
            <label htmlFor='courseCategory'>Course Category <sup>*</sup></label>
            <select 
                id='courseCategory'
                defaultValue=""
                {...register("courseCategory",{required:true})}
                className='w-full text-richblack-800'
            >
                <option value="" disabled>Choose a Category</option>
                {!loading && (
                    courseCategories.map((category,index)=>(
                        <option value={category?._id} key={category?._id}>{category?.name}</option>
                    ))
                )
                }

            </select>
            {errors.courseCategory && (
                <span>Course Category is required</span>
            )   
            }
        </div>

        {/* course Tags  */}
        <ChipInput 
            label="Tags"
            name="courseTags"
            placeholder="Enter Tags and Press Enter"
            register={register}
            errors={errors}
            setValue={setValue}
            getValues={getValues}
        />
        
        {/* create a component for uploading and showing preview of media  */}
        <Upload 
             name="courseImage"
             label="Course Thumbnail"
             register={register}
             setValue={setValue}
             errors={errors}
             editData={editCourse ? course?.thumbnail : null}
        />

        {/* Benefits of the course  */}
        <div>
            <label>Benefits of the course<sup>*</sup></label>
            <textarea
                id='courseBenefits'
                placeholder='Benefits of the course'
                {...register("courseBenefits",{required:true})}
                className='min-h-[140px] w-full text-richblack-700'
            />
            {errors.courseBenefits && (
                <span>Benefits of the course</span>
            )}
        </div>

        <RequirementField 
            label="Requirements/Instructions"
            name="courseRequirements"
            register={register}
            errors={errors}
            setValue={setValue}
            getValues={getValues}
        />

        <div>
            {editCourse && (
                <button 
                    onClick={()=>dispatch(setStep(2))}
                    disabled={loading}
                    className='flex items-center gap-x-2 bg-richblack-300'>
                    Continue without saving
                </button>)
            }
            <IconBtn
                disabled={loading}
                text={!editCourse ? "Next" : "Save Changes"}
               
            >
                <MdNavigateNext />
            </IconBtn>
        </div>

    </form>
  )
}

export default CourseInformationForm