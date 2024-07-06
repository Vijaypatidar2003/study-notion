import React ,{ useEffect, useRef, useState } from 'react';
import {useDispatch, useSelector } from 'react-redux'
import IconBtn from '../../../common/IconBtn';
import { FiUpload } from "react-icons/fi"
import { updateDisplayPicture } from "../../../../services/operations/SettingsAPI"

const ChangeProfilePicture = () => {
    const {token} = useSelector((state)=>state.auth)
    const {user} = useSelector((state)=>state.profile);
    const dispatch = useDispatch();
    const [loading,setLoading] = useState(false);
    const [imageFile,setImageFile] = useState(null);
    const [previewSource,setPreviewSource] = useState(null)


    const fileInputRef = useRef(null);

    const handleClick=()=>{
        fileInputRef.current.click();
    }

    const handleFileChange = (e)=>{
        const file = e.target.files[0];

        if(file){
            setImageFile(file);
            previewFile(file);
        }
    }

    const previewFile = (file)=>{
        //create instance of FileReader
        const reader = new FileReader();
        // FileReader is a built-in object in JavaScript that allows reading the content of files asynchronously.

        reader.readAsDataURL(file);
        // This instructs the FileReader to read the contents of the specified file
        //  and generate a Data URL representing the file's data.

        reader.onloadend=()=>{
            setPreviewSource(reader.result);
        }
        // When the reading operation is completed, the onloadend event of the reader is triggered.
        //  At this point, the reader contains the file's data in the form of a Data URL.
        // Inside the onloadend event handler, setPreviewSource(reader.result) is called. 
        // It presumably updates the state variable previewSource with the result of the file reading,
        // which is the Data URL representing the content of the file.

    }

    const handleFileUpload = ()=>{
        try{
            console.log("Uploading...");
            setLoading(true);
            const formData = {
                "displayPicture":imageFile
            }
            dispatch(updateDisplayPicture(token,formData));
            setLoading(false);
            console.log("Picture Uploaded");
        }catch(error){
            console.log("ERROR MESSAGE - ", error.message)
        }
    }

    useEffect(()=>{
        if(imageFile){
            previewFile(imageFile);
        }

    },[imageFile]);

  return (
    <div className='w-full rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-8' >
        <div className='flex space-x-4'>
            <img src={previewSource||user?.image} alt={user?.firstName}
             className='aspect-square w-[78px] rounded-full object-cover'/>
            <div>
                <p className='font-medium font-semibold text-lg'>Change Profile Picture</p>

                <div className='flex gap-x-1'>
                    <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                    accept="image/png, image/gif, image/jpeg"
                    />
                    <button
                        onClick={handleClick}
                        disabled={loading}
                        className="text-lg cursor-pointer rounded-md bg-richblack-700 py-2 px-7 font-semibold text-richblack-50"
                    >
                        Select
                    </button>

                    <IconBtn
                    text={loading ? "Uploading..." : "Upload"}
                    onclick={handleFileUpload}
                    className='text-sm '
                    >
                    {!loading && (
                    <FiUpload className="text-sm text-richblack-900" />
                    )}
                    </IconBtn>

                </div>
            </div>

        </div>
        
    </div>
  )
}

export default ChangeProfilePicture