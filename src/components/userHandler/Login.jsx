import React, { useEffect, useState } from 'react'
import { Button, Container, Form } from 'react-bootstrap'
import { useForm } from 'react-hook-form'
import { FaUserCheck } from 'react-icons/fa'
import axiosInstance from '../../api/axiosInstance/axiosInstance'
import { endPoint_User } from '../../api/api_url/apiUrl'
import Swal from 'sweetalert2'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

const Login = () => {

  const [users, setUsers] = useState([]),
    navigate = useNavigate();

  const form = useForm(),
    { register, handleSubmit, formState } = form,
    { errors } = formState;

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

  const handleLogin = (data) => {
    // console.log(data);

    const userAuthObj = {
      email: data.email,
      password: data.pwd
    }

    const checkUserAuth = users.find(user => user.email === userAuthObj.email && user.password === userAuthObj.password);

    if (!checkUserAuth) {
      Swal.fire("Oops...", "Invalid email or password", "error");
    }

    else {
      sessionStorage.setItem('access-token', checkUserAuth.token);
      toast.success("Logged In Successfully");
      navigate('/');
    }
  }

  return (
    <div className='maintain_gap'>
      <Container className='d-flex flex-column align-items-center mt-5'>
        <h2>Login Form</h2>

        <Form className='my-3 form-50' id='user-login' onSubmit={handleSubmit(handleLogin)}>

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

          {/* Password  */}
          <Form.Group className="mb-3" controlId="formBasicPwd">
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" {...register('pwd', {
              required: {
                value: true,
                message: 'Required*'
              }
            })} placeholder="Enter password" autoComplete='off' />
            <p className="input-error">{errors.pwd?.message}</p>
          </Form.Group>

          <div className="text-center">
            <Button variant="outline-success" type="submit"><FaUserCheck className='icon' /> Login</Button>
          </div>
        </Form>
      </Container>
    </div>
  )
}

export default Login