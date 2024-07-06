import React from 'react'
import { MdClose } from "react-icons/md"
import { useSelector } from "react-redux"
import { useEffect, useState } from "react"

const ChipInput = ({
    label,
    name,
    register,
    setValue,
    getValues,
    placeholder,
    errors
}) => {
    const {course,editCourse} = useSelector((state)=>state.course);

    // Setting up state for managing chips array
    const [chips, setChips] = useState([]);


    useEffect(()=>{
        if(editCourse){
            setChips(course?.tag);
        }
        register(name,{required:true, validate: (value)=>value.length>0});

    },[])

    useEffect(()=>{
        setValue(name,chips);
    },[chips])

    //function to handle deletion of a chip
    const handleDeleteChip = (chipIndex)=>{
        const newChips = chips.filter((chip,index)=>index!==chipIndex)
        setChips(newChips);
    }

    //function to handle user input when chips are added
    const handleKeyDown = (event)=>{
        //check it the user input 'enter' or ','
        if(event.key==="Enter" || event.key===","){
            // Prevent the default behavior of the event
            event.preventDefault()
            // Get the input value and remove any leading/trailing spaces
            const chipValue = event.target.value.trim()
            // check if the input value exists and is not already in chips array 
            if(chipValue && !chips.includes(chipValue)){
                //add chipValue to chips array
                const updatedChipsArray = [...chips,chipValue];
                setChips(updatedChipsArray);
                event.target.value=""
            }
        }
    }
  return (
    <div className='flex flex-col space-y-2'>
        {/* Render the label for input  */}
        <label className="text-sm text-richblack-5" htmlFor={name}>
            {label}
        </label>

        {/* Render the chips and input  */}
        <div className="flex w-full flex-wrap gap-y-2">
            {
                // {/* Map over the chips array and render each chip */}
                chips.map((chip,index)=>(
                    <div className='m-1 flex items-center rounded-full bg-yellow-400 px-2 py-1 text-sm text-richblack-5'>
                        {/* Render the chip value  */}
                        {chip}
                        {/* Render the button to delete the chip  */}
                        <button
                        type='button'
                        className='ml-2 focus:outline-none'
                        onClick={()=>handleDeleteChip(index)}>
                            <MdClose className='text-sm'/>
                        </button>
                    </div>
                ))
            }
            {/* Render the input for adding new chips  */}
            <input 
                type='text'
                id={name}
                name={name}
                placeholder={placeholder}
                onKeyDown={handleKeyDown}
                className='form-style w-full text-richblack-700'
            />
        </div>
         {/* Render an error message if the input is required and not filled */}
        {errors[name] && (
            <span className="ml-2 text-xs tracking-wide text-pink-200">
                 {label} is required
            </span>
        )}
    </div>
  )
}

export default ChipInput