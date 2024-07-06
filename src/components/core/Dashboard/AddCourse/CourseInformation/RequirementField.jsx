import React, { useEffect, useState} from 'react'


const RequirementField = ({label,name,errors,register,setValue,getValues}) => {
    const [requirement,setRequirement] = useState("");
    const [requirementList,setRequirementList] = useState([]);

    // register input field on first render 
    useEffect(()=>{
        register(name,{
            required:true,
            validate:(value)=>value.length>0
        })
    },[])

    // whenever something is updated in the form we must set its value 
    useEffect(()=>{
        setValue(name,requirementList)
    },[requirementList])

    const handleAddRequirement = ()=>{
        if(requirement){
            setRequirementList([...requirementList,requirement]);
            setRequirement("");
        }
    }

    const handleRemoveRequirement = (index)=>{
        const updatedRequirementList = [...requirementList];
        updatedRequirementList.splice(index,1);
        setRequirementList(updatedRequirementList);

    }

  return (
    <div>
        <label htmlFor={name}>{label}<sup>*</sup></label>
        <div>
            <input 
                type='text'
                name={name}
                id={name}
                value={requirement}
                onChange={(e)=>setRequirement(e.target.value)}
                className='form-style w-full'
            />
            <button 
                type='button'
                onClick={handleAddRequirement}
                className='font-semibold text-yellow-50'>
                Add
            </button>
        </div>
        {requirementList.length>0 && (
            <ul>
                {requirementList.map((req,index)=>(
                    <li key={index} className='flex items-center gap-x-1'>
                        <span>{req}</span>
                        <button
                            onClick={()=>handleRemoveRequirement(index)}
                            type='button'
                            className='text-xs text-pure-greys-300'
                        >clear
                        </button>
                    </li>
                    ))
                }
            </ul>
        )
        }
        {errors[name]  && (
            <span>
                {label} is required
            </span>
        )   
        }
    </div>
  )
}

export default RequirementField