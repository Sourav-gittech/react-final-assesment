import React from 'react'
import { useParams } from 'react-router-dom';
import UserDetailsUpdate from './UserDetailsUpdate';

const EditProfile = () => {

    const { user_id } = useParams();
       
    return (
        <div className='maintain_gap'>
            <UserDetailsUpdate action='editProfile' user_id={user_id} />
        </div>
    )
}

export default EditProfile