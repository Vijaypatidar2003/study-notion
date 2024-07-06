import React, { useState } from 'react'
import { useDispatch,useSelector } from 'react-redux';
import { RxDropdownMenu } from "react-icons/rx";
import { MdModeEdit } from "react-icons/md";
import { AiTwotoneDelete } from "react-icons/ai";
import { BiSolidDownArrow } from "react-icons/bi";
import { FaPlus } from "react-icons/fa6";
import SubSectionModal from './SubSectionModal';

import { deleteSection,deleteSubSection } from '../../../../../services/operations/courseDetailsAPI';
import { setCourse } from '../../../../../slices/courseSlice';
import ConfirmationModal from '../../../../common/ConfirmationModal'



const NestedView = ({handleChangeEditSectionName}) => {
    const {course} = useSelector((state)=>state.course);
    const {token} = useSelector((state)=>state.auth)
    const dispatch = useDispatch();

    const [addSubSection,setAddSubSection] = useState(null);
    const [viewSubSection,setViewSubSection] = useState(null);
    const [editSubSection,setEditSubSection] = useState(null);

    const [confirmationModal,setConfirmationModal] = useState(null);

    const handleDeleteSection = async (sectionId)=>{
        const result = await deleteSection({sectionId,courseId:course._id},token)
        console.log("inside nestedview handle delete section =",result)
        if(result){
            dispatch(setCourse(result));
        }
        setConfirmationModal(null);
    }

    const handleDeleteSubSection = async (subSectionId,sectionId)=>{
        const result = await deleteSubSection({subSectionId,sectionId},token);
        if(result){
            dispatch(setCourse(result))
        }
        setConfirmationModal(null);
    }
  return (
    <>
        
        <div className='rounded-lg bg-richblack-700 p-6 px-8'>
            {
                course?.courseContent?.map((section)=>(
                    <details key={section._id} open>

                        <summary className='flex justify-between items-center gap-x-3 border-b-2'>
                            <div className='flex items-center gap-x-3'>
                                <RxDropdownMenu />
                                <p>{section.sectionName}</p>
                            </div>
                            <div className='flex items-center gap-x-3'>
                                <button
                                    onClick={()=>handleChangeEditSectionName(section._id,section.sectionName)}>
                                <MdModeEdit />
                                </button>
                                <button
                                    onClick={()=>{
                                        setConfirmationModal({
                                            text1:"Delete this Section",
                                            text2:"All the lectures in this section will be deleted",
                                            btn1Text:"Delete",
                                            btn2Text:"Cancel",
                                            btn1Handler:()=>handleDeleteSection(section._id),
                                            btn2Handler:()=>setConfirmationModal(null)
                                        })
                                    }}>
                                <AiTwotoneDelete />
                                </button>
                                <span>|</span>
                                
                                <BiSolidDownArrow />
                               
                            </div>

                        </summary>

                        <div>
                            {
                                section.subSection.map((data)=>(
                                    <div key={data?._id} 
                                        onClick={()=>setViewSubSection(data)}
                                        className='flex cursor-pointer items-center justify-between gap-x-3 border-b-2 border-b-richblack-600 py-2'
                                    >
                                        <div className='flex items-center gap-x-3 py-2 '>
                                            <RxDropdownMenu className="text-2xl text-richblack-50"/>
                                            <p className="font-semibold text-richblack-50">{data.title}</p>
                                        </div>
                                        {/* we do not want to execute onClick of below div on clicking upon above div  */}
                                        {/* so we have done e.stopPropogation  */}
                                        <div className='flex items-center gap-x-3' onClick={(e) => e.stopPropagation()}>
                                            <button onClick={()=>setEditSubSection({...data,sectionId:section._id})}>
                                                <MdModeEdit className="text-xl text-richblack-300" />
                                            </button>
                                            <button
                                                 onClick={() =>
                                                    setConfirmationModal({
                                                      text1: "Delete this Sub-Section?",
                                                      text2: "This lecture will be deleted",
                                                      btn1Text: "Delete",
                                                      btn2Text: "Cancel",
                                                      btn1Handler: () =>
                                                      handleDeleteSubSection(data._id, section._id),
                                                      btn2Handler: () => setConfirmationModal(null),
                                                    })
                                                  }>
                                                <AiTwotoneDelete className="text-xl text-richblack-300" />
                                            </button>
                                        </div>
                                    </div>
                                ))
                            }

                            {/* add new lectures to the section */}
                            <button onClick={()=>setAddSubSection(section._id)} className="mt-3 flex items-center gap-x-1 text-yellow-50">
                                <FaPlus className="text-lg"/>
                                <p>Add Lecture</p>
                            </button>
                        </div>

                    </details>
                ))
            }
        </div>
        
          {/* Modal Display */}
      {addSubSection ? (
        <SubSectionModal
          modalData={addSubSection}
          setModalData={setAddSubSection}
          add={true}
        />
      ) : viewSubSection ? (
        <SubSectionModal
          modalData={viewSubSection}
          setModalData={setViewSubSection}
          view={true}
        />
      ) : editSubSection ? (
        <SubSectionModal
          modalData={editSubSection}
          setModalData={setEditSubSection}
          edit={true}
        />
      ) : (
        <></>
      )}
      {/* Confirmation Modal */}
      {confirmationModal ? (
        <ConfirmationModal modalData={confirmationModal} />
      ) : (
        <></>
      )}
        
    </>
  )
}

export default NestedView