import React from 'react'
import ChangeProfilePicture from './ChangeProfilePicture'
import EditProfile from './EditProfile'
import UpdatePassword from './UpdatePassword'

const Settings = () => {
  return (
    <div className='text-white flex flex-col justify-between gap-y-2'>
        <h1 className="mb-4 text-3xl font-medium text-richblack-5">Edit Profile</h1>

        {/* change profile picture  */}
        <ChangeProfilePicture />

        {/* Edit Profile  */}
        <EditProfile/>

        {/* update Password  */}
        <UpdatePassword/>
    </div>
  )
}

export default Settings