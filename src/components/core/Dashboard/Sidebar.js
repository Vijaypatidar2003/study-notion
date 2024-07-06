import React, { useState } from 'react'
import { logout } from '../../../services/operations/authAPI'
import {sidebarLinks} from '../../../data/dashboard-links'
import { useDispatch, useSelector } from 'react-redux'
import SidebarLink from './SidebarLink'
import { VscSettingsGear, VscSignOut } from 'react-icons/vsc'
import { matchPath, useNavigate } from 'react-router-dom'
import ConfirmationModal from '../../common/ConfirmationModal'

const Sidebar = () => {
    const {user,loading:profileLoading} = useSelector((state)=>state.profile);
    const {loading:authLoading} = useSelector((state)=>state.auth);
    const navigate=useNavigate();
    const dispatch=useDispatch();
    //to keep track of confirmation Modal
    const [confirmationModal,setConfirmationModal] = useState(null);

    if(profileLoading||authLoading){
        return <div className='mt-10'>Loading...</div>
    }
    // const matchRoute = (route)=>{
    //     return matchPath({path:route},location.pathname);
    // }
  return (
    <div>
        <div className='flex flex-col min-w-[222px] h-full border-r-[1px] border-r-richblack-800
        bg-richblack-800 py-10 text-white'>
            <div className='flex flex-col'>
                {
                    sidebarLinks.map((link,index)=>{
                        if(link.type && link.type !== user?.accountType) return null;
                        return (
                            <SidebarLink link={link} iconName={link.icon} key={link.id}/>
                        )
                    })
                }

            </div>

            <div className='mx-auto mt-6 mb-6 h-[1px] w-10/12 bg-white'></div>

            <SidebarLink link={{name:"Settings",path:"dashboard/settings"}}
            iconName="VscSettingsGear" />

            {/* below btn will not render page or outlet that's why we handle it without SidebarLink tag */}
            
            <button onClick={()=>
                setConfirmationModal({
                    text1:"Are you sure ?",
                    text2:"You will be logged out of your account.",
                    btn1Text:"Logout",
                    btn2Text:"Cancel",
                    btn1Handler:()=>dispatch(logout(navigate)),
                    btn2Handler:()=>setConfirmationModal(null)
                })

            }
            className='px-8 py-2 text-sm font-medium font-semibold text-richblack-300'
            >
                <div className='flex  items-center gap-x-2'>
                    <VscSignOut className='text-lg'/>
                    <span>Logout</span>
                </div>
            </button>
        </div>
        {confirmationModal && <ConfirmationModal  modalData={confirmationModal}/>}
    </div>
  )
}

export default Sidebar