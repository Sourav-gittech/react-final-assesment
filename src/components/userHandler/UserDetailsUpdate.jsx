import React, { useEffect, useState } from 'react'
import { Col, Container, Row } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useForm } from 'react-hook-form';
import { endPoint_User } from '../../api/api_url/apiUrl';
import axiosInstance from '../../api/axiosInstance/axiosInstance';
import { FaUserCog } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import getBase64Promise from '../../common-function/ConvertBase64';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';

const UserDetailsUpdate = (props) => {

    const { action, user_id } = props;
    // console.log(action,user_id);

    const imgType = ['jpeg', 'jpg', 'png'];


    const form = useForm(),
        { register, handleSubmit, formState, reset } = form,
        { errors } = formState,
        [existingDetails, setExistingDetails] = useState({}),
        navigate = useNavigate();

    const getUserDetails = () => {
        const userProfileUrl = endPoint_User + '/' + user_id;
        axiosInstance.get(userProfileUrl)
            .then(res => {
                const userProfileObj = {
                    f_name: res.data.f_name,
                    l_name: res.data.l_name,
                    email: res.data.email,
                    contact_no: res.data.contact_no,
                    profile_pic: res.data.profile_pic,
                    address: res.data.address,
                    password: res.data.password,
                    token: res.data.token,
                    user_type: res.data.user_type
                }
                setExistingDetails({ ...userProfileObj });
                reset({ ...userProfileObj });
            })
            .catch(err => console.log(err));
    }

    useEffect(() => {
        getUserDetails();
    }, []);

    const updateUserDetails = async (data) => {
        // console.log(data);

        try {
            const profileUrl = endPoint_User + '/' + user_id;

            let profileImg = existingDetails.profile_pic;

            if (data.profile_img && data.profile_img.length > 0) {
                profileImg = await getBase64Promise(data.profile_img[0]);
            }

            const updateProfileDetails = {
                f_name: existingDetails.f_name,
                l_name: existingDetails.l_name,
                contact_no: data.contact_no ? data.contact_no : existingDetails.contact_no,
                email: existingDetails.email,
                password: data.newPwd ? data.newPwd : existingDetails.password,
                profile_pic: profileImg,
                address: data.address ? data.address : existingDetails.address,
                token: existingDetails.token,
                user_type: existingDetails.user_type
            }
            if (action === 'editProfile' && data.profile_img.length > 0 && data.profile_img[0].size / 1024 > 100) {
                toast.warn("Profile image size should less than 100KB");
            }

            else if (action === 'editProfile' && data.profile_img.length > 0 && !imgType.includes(data.profile_img[0].type.split('/')[1])) {
                toast.warn("Profile image type should be jpeg / jpg / png");
            }
            else if (action === 'changePassword' && existingDetails.password !== data.oldPwd) {
                toast.error("Password don't match with the existing password");
            }
            else if (action === 'changePassword' && data.oldPwd === data.newPwd) {
                toast.warn("New password and previous password can't be same");
            }
            else if (action === 'changePassword' && data.newPwd !== data.c_pwd) {
                toast.warn("Password and confirm password are not same");
            }

            else {
                axiosInstance.put(profileUrl, updateProfileDetails)
                    .then(res => {
                        if (res.status === 200) {
                            toast.success(action === 'editProfile' ? "Profile Updated Successfully" : "Password Updated Successfully");
                            navigate('/profile');
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
        <Container className='d-flex flex-column align-items-center my-3'>
            <h2 className="text-center mt-3">{action === 'editProfile' ? 'Update Your Profile' : 'Change Profile Password'}</h2>

            <Form className='mt-3 form-50' id='user-update-form' onSubmit={handleSubmit(updateUserDetails)}>

                {action === 'editProfile' ? (
                    <>
                        <Row className="mb-3">
                            {/* First name  */}
                            <Form.Group as={Col} controlId="formBasicF_name">
                                <Form.Label>First name</Form.Label>
                                <Form.Control type="text" {...register('f_name')} placeholder="Enter first name" autoComplete='off' disabled />
                                <p className="input-error">{errors.f_name?.message}</p>
                            </Form.Group>

                            {/* Last name  */}
                            <Form.Group as={Col} controlId="formBasicL_name">
                                <Form.Label>Last name</Form.Label>
                                <Form.Control type="text" {...register('l_name')} placeholder="Enter last name" autoComplete='off' disabled />
                                <p className="input-error">{errors.l_name?.message}</p>
                            </Form.Group>
                        </Row>

                        <Row className="mb-3">
                            {/* Email ID  */}
                            <Form.Group as={Col} controlId="formBasicEmail">
                                <Form.Label>Email ID</Form.Label>
                                <Form.Control type="email" {...register('email')} placeholder="Enter email" autoComplete='off' disabled />
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

                        {/* Profile image  */}
                        <Form.Group className="mb-3" controlId="formBasicImage">
                            <Form.Label>Profile Image</Form.Label>
                            <Form.Control type="file" {...register('profile_img')} placeholder="Select Image" accept='Image/*' />
                            <Form.Text className="text-muted">
                                Image should be in jpeg/jpg/png format and less than 100KB
                            </Form.Text>
                            <p className="input-error">{errors.profile_img?.message}</p>
                        </Form.Group>

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
                    </>
                ) : (
                    <>
                        {/* Previous Password  */}
                        <Form.Group className="mb-3" controlId="formBasicOldPwd">
                            <Form.Label>Old Password</Form.Label>
                            <Form.Control type="password" {...register('oldPwd', {
                                required: {
                                    value: true,
                                    message: 'Required*'
                                }
                            })} placeholder="Enter password" autoComplete='off' />
                            <p className="input-error">{errors.oldPwd?.message}</p>
                        </Form.Group>

                        {/* New Password  */}
                        <Form.Group className="mb-3" controlId="formBasicNewPwd">
                            <Form.Label>New Password</Form.Label>
                            <Form.Control type="password" {...register('newPwd', {
                                required: {
                                    value: true,
                                    message: 'Required*'
                                },
                                pattern: {
                                    value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d])[A-Za-z\d\S]{8,}$/,
                                    message: 'Password should have minimum 8 characters with a lower case, a upper case, a number and a special character'
                                }
                            })} placeholder="Enter password" autoComplete='off' />
                            <p className="input-error">{errors.newPwd?.message}</p>
                        </Form.Group>

                        {/* Confirm password  */}
                        <Form.Group className="mb-3" controlId="formBasicCpwd">
                            <Form.Label>Confirm password</Form.Label>
                            <Form.Control type="password" {...register('c_pwd')} placeholder="Enter confirm password" autoComplete='off' />
                        </Form.Group>
                    </>
                )}

                <div className="text-center">
                    <Button variant="outline-primary" type="submit"><FaUserCog className='icon' /> Update</Button>
                </div>
            </Form>
        </Container>
    )
}

export default UserDetailsUpdate