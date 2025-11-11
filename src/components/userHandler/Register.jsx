import React, { useEffect, useState } from 'react'
import { Button, Col, Container, Form, Row } from 'react-bootstrap'
import { useForm } from 'react-hook-form'
import { FaUserPlus } from 'react-icons/fa'
import getBase64Promise from '../../common-function/ConvertBase64'
import axiosInstance from '../../api/axiosInstance/axiosInstance'
import { endPoint_User } from '../../api/api_url/apiUrl'
import Swal from 'sweetalert2'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'

const Register = () => {

  const [users, setUsers] = useState([]),
    navigate = useNavigate(),
    { user_type } = useParams();

  const form = useForm(),
    { register, handleSubmit, formState } = form,
    { errors } = formState;

  const imgType = ['jpeg', 'jpg', 'png'];

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

  useEffect(() => {
    getAllUser();
  }, [setUsers]);

  const handleRegister = async (data) => {
    // console.log(data);
    try {
      const profileImg = await getBase64Promise(data.profile_img[0]);

      const userObj = {
        f_name: data.f_name,
        l_name: data.l_name,
        contact_no: user_type !== 'admin' ? data.contact_no : null,
        email: data.email,
        password: data.pwd,
        profile_pic: profileImg,
        address: user_type !== 'admin' ? data.address : null,
        token: 'token' + new Date().getTime(),
        user_type: user_type !== 'admin' ? "user" : "admin"
      }
      // console.log(data.profile_img[0].type.split('/')[1]);

      let checkUser = users.find(user => user.email === userObj.email);

      if (checkUser) {
        Swal.fire("Oops...", "User email already exist", "info");
      }

      else if (userObj.password !== data.c_pwd) {
        toast.warn("Password and confirm password are not same");
      }

      else if (data.profile_img[0].size / 1024 > 100) {
        toast.warn("Profile image size should less than 100KB");
      }

      else if (!imgType.includes(data.profile_img[0].type.split('/')[1])) {
        toast.warn("Profile image type should be jpeg / jpg / png");
      }

      else {
        axiosInstance.post(endPoint_User, userObj)
          .then(res => {
            if (res.status === 201) {
              toast.success(user_type !== 'admin' ? "Registration Successful" : "Admin Registration Successful");
              document.getElementById('user-form').reset();
              user_type !== 'admin' ? navigate('/login') : navigate('/all_members/admin');
            }
            else {
              Swal.fire("Oops...", "Something went wrong!", "error");
            }
          })
          .catch(err => console.log(err));
      }
    }
    catch (err) {
      console.log('Error occured ', err);
    }
  }

  return (
    <div className='maintain_gap'>
      <Container className='d-flex flex-column align-items-center mt-3'>
        <h2>Register Form</h2>

        <Form className='my-3 form-50' id='user-form' onSubmit={handleSubmit(handleRegister)}>

          <Row className={user_type !== 'admin' ? "mb-3" : "mb-1"}>
            {/* First name  */}
            <Form.Group as={Col} controlId="formBasicF_name">
              <Form.Label>First name</Form.Label>
              <Form.Control type="text" {...register('f_name', {
                required: {
                  value: true,
                  message: 'Required*'
                }
              })} placeholder="Enter first name" autoComplete='off' />
              <p className="input-error">{errors.f_name?.message}</p>
            </Form.Group>

            {/* Last name  */}
            <Form.Group as={Col} controlId="formBasicL_name">
              <Form.Label>Last name</Form.Label>
              <Form.Control type="text" {...register('l_name', {
                required: {
                  value: true,
                  message: 'Required*'
                }
              })} placeholder="Enter last name" autoComplete='off' />
              <p className="input-error">{errors.l_name?.message}</p>
            </Form.Group>
          </Row>

          {user_type !== 'admin' ? <>

            <Row className="mb-3">
              {/* Email ID  */}
              <Form.Group as={Col} controlId="formBasicEmail">
                <Form.Label>Email ID</Form.Label>
                <Form.Control type="email" {...register('email', {
                  required: {
                    value: true,
                    message: 'Required*'
                  },
                  pattern: {
                    value: /^[a-z0-9._-]+@[a-z0-9.-]+\.[a-zA-Z.]{2,}$/,
                    message: 'Invalid email'
                  }
                })} placeholder="Enter email" autoComplete='off' />
                <p className="input-error">{errors.email?.message}</p>
              </Form.Group>

              {/* Contact no */}
              <Form.Group as={Col} controlId="formBasicContact">
                <Form.Label>Contact no</Form.Label>
                <Form.Control type="number" {...register('contact_no', {
                  required: {
                    value: true,
                    message: 'Required*'
                  },
                  pattern: {
                    value: /^[6-9][0-9]{9}$/,
                    message: 'Invalid contact  number'
                  }
                })} placeholder="Enter phone no" autoComplete='off' />
                <p className="input-error">{errors.contact_no?.message}</p>
              </Form.Group>
            </Row>
          </> : <>
            {/* Email ID  */}
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Email ID</Form.Label>
              <Form.Control type="email" {...register('email', {
                required: {
                  value: true,
                  message: 'Required*'
                },
                pattern: {
                  value: /^[a-z0-9._-]+@[a-z0-9.-]+\.[a-zA-Z.]{2,}$/,
                  message: 'Invalid email'
                }
              })} placeholder="Enter email" autoComplete='off' />
              <p className="input-error">{errors.email?.message}</p>
            </Form.Group>
          </>
          }

          {/* Profile image  */}
          <Form.Group className="mb-3" controlId="formBasicImage">
            <Form.Label>Profile Image</Form.Label>
            <Form.Control type="file" {...register('profile_img', {
              required: {
                value: true,
                message: 'Required*'
              }
            })} placeholder="Select Image" accept='Image/*' />
            <Form.Text className="text-muted">
              Image should be in jpeg/jpg/png format and less than 100KB
            </Form.Text>
            <p className="input-error">{errors.profile_img?.message}</p>
          </Form.Group>

          {user_type !== 'admin' ? <>

            {/* Address */}
            <Form.Group className="mb-3" controlId="formBasicAddress">
              <Form.Label>Full address</Form.Label>
              <Form.Control as="textarea" rows={3} {...register('address', {
                required: {
                  value: true,
                  message: 'Required*'
                },
                pattern: {
                  value: /^[A-Za-z0-9,.&()\- ]+$/,
                  message: 'Accept only ,-.()& as special character'
                }
              })} placeholder='Type here...' autoComplete='off' />
              <p className="input-error">{errors.address?.message}</p>
            </Form.Group>
          </> : null}

          {/* Password  */}
          <Form.Group className="mb-3" controlId="formBasicPwd">
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" {...register('pwd', {
              required: {
                value: true,
                message: 'Required*'
              },
              pattern: {
                value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d])[A-Za-z\d\S]{8,}$/,
                message: 'Password should have minimum 8 characters with a lower case, a upper case, a number and a special character'
              }
            })} placeholder="Enter password" autoComplete='off' />
            <p className="input-error">{errors.pwd?.message}</p>
          </Form.Group>

          {/* Confirm password  */}
          <Form.Group className="mb-3" controlId="formBasicCpwd">
            <Form.Label>Confirm password</Form.Label>
            <Form.Control type="password" {...register('c_pwd')} placeholder="Enter confirm password" autoComplete='false' />
          </Form.Group>

          <div className="text-center">
            <Button variant="outline-primary" type="submit"><FaUserPlus className='icon' /> Register</Button>
          </div>
        </Form>
      </Container>
    </div>
  )
}

export default Register