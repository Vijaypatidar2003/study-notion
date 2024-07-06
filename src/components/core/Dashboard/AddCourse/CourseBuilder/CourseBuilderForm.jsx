import React, { useState } from 'react'
import {useForm} from 'react-hook-form'
import IconBtn from '../../../../common/IconBtn';
import { MdAddCircleOutline } from "react-icons/md";
import { useDispatch, useSelector } from 'react-redux';
import { setCourse, setEditCourse, setStep } from '../../../../../slices/courseSlice';
import { IoMdArrowDropright } from "react-icons/io";
import { toast } from "react-hot-toast"
import {updateSection,createSection} from '../../../../../services/operations/courseDetailsAPI'
import NestedView from '../CourseBuilder/NestedView'

function CourseBuilderForm() {

    const dispatch = useDispatch();
    const {
        register,
        handleSubmit,
        setValue,
        formState:{errors}
    } = useForm();

    const [editSectionName,setEditSectionName] = useState(null);
    const [loading,setLoading] = useState(false);

    const cancelEdit = ()=>{
        setEditSectionName(null);
        setValue("sectionName", "");
    }
    
    const goToNext = ()=>{
        if(course.courseContent.length === 0){
            toast.error("Please add atleast one section")
            return;
        }
        if(course.courseContent.some((section)=>section.subSection.length===0)){
            toast.error("Please add atleast one lecture in each section")
            return;
        }
        dispatch(setStep(3));
    }

    const goBack = ()=>{
        dispatch(setStep(1));
        dispatch(setEditCourse(true));
    }
    
    const onSubmit = async (data)=>{
        setLoading(true);
        let result;
        if(editSectionName){
            //we are editing the section name
            result = await updateSection({
                sectionName:data.sectionName,
                sectionId:editSectionName,
                courseId:course._id
            },token)
        }else{
            //creating section
            result = await createSection({
                sectionName:data.sectionName,
                courseId:course._id
            },token)
        }

        //update values
        if(result){
           dispatch(setCourse(result));
           setValue("sectionName","");
           setEditSectionName(null);
        }

        setLoading(false);
    }

    const handleChangeEditSectionName = (sectionId,sectionName)=>{
        if(editSectionName===sectionId){
            cancelEdit();
            return;
        }
        setEditSectionName(sectionId);
        setValue("sectionName",sectionName);
    }

    const {course} = useSelector((state)=>state.course);
    const {token} = useSelector((state)=>state.auth);

  return (
    <div className='text-white'>
        <p>Course Builder</p>

        <form onSubmit={handleSubmit(onSubmit)}>
            <div>
                <label htmlFor='sectionName'>Section Name <sup>*</sup></label>
                <input 
                    id='sectionName'
                    placeholder='Add Section name'
                    {...register("sectionName",{required:true})}
                    className='w-full text-richblack-700'
                />
                {errors.sectionName && (
                <span>Section Name is required</span>)
                }
            </div>
            <div className='mt-10 flex w-full '>
                <IconBtn
                    type="submit"
                    text={editSectionName ? "Edit Section Name" : "Create Section "}
                    outline={true}
                    customClasses={"text-white"}
                >
                    <MdAddCircleOutline className='text-yellow-300'/>
                </IconBtn>
                {editSectionName && (
                    <button type='button'
                            onClick={cancelEdit}
                            className='text-sm text-richblack-300 underline ml-10'
                    >Cancel Edit</button>
                )}
            </div>
        </form>

        {course.courseContent.length > 0 && (
             <NestedView handleChangeEditSectionName={handleChangeEditSectionName}/>
        )}

        <div className='flex justify-end gap-x-3 mt-10'>
            <button onClick={goBack}
            className='rounded-md cursor-pointer flex items-center gap-x-2 bg-richblack-100 py-[8px] px-[20px]
            font-semibold text-richblack-900'>
                Back
            </button>
            <IconBtn text="Next" onclick={goToNext}>
            <IoMdArrowDropright size={25}/>
            </IconBtn>

        </div>

        
    </div>
  )
}

export default CourseBuilderForm