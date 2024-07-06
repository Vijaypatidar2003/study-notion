import React from 'react'
import * as Icons from 'react-icons/vsc'
import { useDispatch } from 'react-redux';
import { NavLink, useLocation,matchPath } from 'react-router-dom'

const SidebarLink = ({link,iconName}) => {
    const location = useLocation();
    const Icon =Icons[iconName];
    const dispatch = useDispatch();

    const matchRoute = (route)=>{
        return matchPath({path:route},location.pathname);
    }

    
  return (
    <NavLink
    to={link.path}
    className={`relative px-8 py-2 text-sm font-medium font-semibold  transition-all duration-300ms hover:scale-110
     ${matchRoute(link.path) ? " text-richblack-800 bg-yellow-300 border-solid border-2 border-red-600 " 
     : "bg-opacity-0 "}
    `}>
        <span className={`absolute left-0 top-0 h-full w-[0.4rem] bg-orange-800
        ${matchRoute(link.path) ? "opacity-100" : "opacity-0"}`}></span>

        <div className='flex items-center gap-x-2'>
            <Icon className='text-lg'/>
            <span>{link.name}</span>
        </div>
    </NavLink>
  )
}

export default SidebarLink