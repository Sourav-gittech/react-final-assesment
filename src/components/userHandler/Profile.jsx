import React, { useEffect, useState } from 'react'
import { Button, Col, Container, Image, Row } from 'react-bootstrap'
import { FaUserCog, FaUserEdit, FaUserLock, FaUserPlus } from 'react-icons/fa'
import { RiUserShared2Fill } from 'react-icons/ri'
import axiosInstance from '../../api/axiosInstance/axiosInstance'
import { endPoint_User } from '../../api/api_url/apiUrl'
import { Link, useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'
import { toast } from 'react-toastify'
import { BsCardChecklist } from 'react-icons/bs'
import { MdIntegrationInstructions } from 'react-icons/md'

const Profile = () => {

  const [users, setUsers] = useState([]),
    [loggedUser, setLoggedUser] = useState({}),
    navigator = useNavigate();

  // Fetch All User 
  const getAllUser = () => {
    axiosInstance.get(endPoint_User)
      .then(res => {
        // console.log(res);
        if (res.status === 200) {
          setUsers([...res.data]);
        }
        else {
          Swal.fire("Oops...", "Something went wrong!", "error");
        }
      })
      .catch(err => console.log(err));
  }

  // Fetch logged user
  const fetchLoggedUser = () => {
    try {
      const token = (sessionStorage.getItem('access-token') || '').trim();
      // console.log(token);

      const findLoggedUser = users.find(user => user.token === token);
      // console.log(findLoggedUser);

      const loggedUserObj = {
        id: findLoggedUser.id,
        name: findLoggedUser.f_name + ' ' + findLoggedUser.l_name,
        email: findLoggedUser.email,
        profile_img: findLoggedUser.profile_pic === '' ? '/assets/user/demo-user.png' : findLoggedUser.profile_pic,
        contact: findLoggedUser.contact_no,
        address: findLoggedUser.address,
        type: findLoggedUser.user_type
      }

      setLoggedUser({ ...loggedUserObj });
    }
    catch (err) {
      console.log(err);
    }
  }
  // console.log(loggedUser);

  // user log out 
  const userLogout = (key) => {
    sessionStorage.removeItem(key);
    toast.success("Logged Out Successfully");
    navigator('/');
  }

  useEffect(() => {
    getAllUser();
  }, []);

  useEffect(() => {
    if (users.length > 0) {
      fetchLoggedUser();
    }
  }, [users]);

  if (!loggedUser) {
    return (
      <div className='maintain_gap'>
        <h3 className="text-center mt-5">Loading...</h3>
      </div>
    )
  }

  return (
    <div className='maintain_gap'>
      <h3 className="text-center mt-5">{loggedUser.type === 'user' ? 'User' : 'Admin'} Profile</h3>

      <Container className='profile-box mt-5'>

        <Row className='d-flex align-items-center'>
          <Col md={loggedUser.type === 'user' ? 5 : 4} sm={12} className='p-5 bg-success text-center p-img'>
            <Image className='rounded-circle object-fit-cover' src={loggedUser.profile_img} alt='#profile' />
            <div className='text-center mt-3'>
              <Button variant='danger' className='middle-btn my-1' onClick={() => userLogout('access-token')}><RiUserShared2Fill className='icon' /> Logout</Button>
            </div>
          </Col>

          <Col md={loggedUser.type === 'user' ? 7 : 4} sm={12} className='p-5'>
            <p><span className='p-title'>Name : </span> {loggedUser.name || 'Not available'}</p>
            <p><span className='p-title'>Email : </span> {loggedUser.email || 'Not available'}</p>

            {loggedUser.type === 'user' ?
              (<span>
                <p><span className='p-title'>Contact no : </span> {loggedUser.contact || 'Not available'}</p>
                <p><span className='p-title'>Address : </span> {loggedUser.address || 'Not available'}</p>
              </span>) : null
            }
            <div className='d-flex flex-md-row flex-column align-items-center justify-content-evenly mt-1'>

              {loggedUser.type === 'user' ?
                <div className='d-flex flex-lg-row flex-column align-items-center'>
                  <Button variant='primary' className='middle-btn my-1' as={Link} to={`/edit_profile/${loggedUser.id}`}><FaUserEdit className='icon' /> Edit Profile</Button>
                  <Button variant='info' className='big-btn mx-1' as={Link} to={`/change_password/${loggedUser.id}`}><FaUserLock className='icon' /> Change Password</Button>
                  <Button variant='success' className='middle-btn my-1' as={Link} to={`/order_details/${loggedUser.id}`}><BsCardChecklist className='icon' /> Order Details</Button>
                </div> : null}

            </div>
          </Col>
          {loggedUser.type !== 'user' ?
            <Col md={4} sm={12} className='d-flex flex-column p-5'>
              <Button variant='outline-primary' className='big-btn my-2' as={Link} to='/signup/admin'><FaUserPlus className='icon' /> Add Admin</Button>
              <Button variant='outline-success' className='big-btn my-2' as={Link} to='/all_members/admin'><FaUserCog className='icon' /> Manage Admin</Button>
              <Button variant='outline-warning' className='big-btn my-2' as={Link} to='/instructions'><MdIntegrationInstructions className='icon' /> Manage Instruction</Button>
              <Button variant='outline-info' className='big-btn my-2' as={Link} to={`/change_password/${loggedUser.id}`}><FaUserLock className='icon' /> Change Password</Button>
            </Col> : null}
        </Row>
      </Container>
    </div >
  )
}

export default Profile