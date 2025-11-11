import React, { useEffect, useState } from 'react'
import { Button, Container, Form, Image, InputGroup } from 'react-bootstrap';
import Table from 'react-bootstrap/Table';
import { FaTrashAlt, FaUserPlus } from 'react-icons/fa';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axiosInstance from '../../../api/axiosInstance/axiosInstance';
import { endPoint_User } from '../../../api/api_url/apiUrl';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';

const AllUser = () => {

    const [users, setUsers] = useState([]),
        [searchText, setSearchText] = useState(''),
        navigator = useNavigate(),
        { member_type } = useParams();

    let count = 1;

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
    const fetchLoggedUser = (check_id) => {
        try {
            const token = (sessionStorage.getItem('access-token') || '').trim();
            // console.log(token);

            const findLoggedUser = users.find(user => user.token == token);
            // console.log(findLoggedUser);

            if (findLoggedUser.id === check_id) {
                return true;
            }
            return false;
        }
        catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        getAllUser();
    }, [setUsers]);

    const showSortingData = (event) => {
        if (event.target.value === 'assending') {
            let assendingUsers = users.sort((a, b) => a.f_name.localeCompare(b.f_name));
            setUsers([...assendingUsers]);
        }
        if (event.target.value === 'decending') {
            let decendingUsers = users.sort((a, b) => b.f_name.localeCompare(a.f_name));
            setUsers([...decendingUsers]);
        }
    }

    const deleteUser = (user_id, member_type) => {
        // console.log(user_id,typeof(member_type),member_type);

        Swal.fire({
            title: "Are you sure to delete?",
            showDenyButton: true,
            confirmButtonText: "Yes",
            denyButtonText: `No`
        })
            .then((result) => {
                if (result.isConfirmed) {
                    const specificUserURL = endPoint_User + '/' + user_id;

                    axiosInstance.delete(specificUserURL)
                        .then(res => {
                            if (res.status == 200) {
                                if (fetchLoggedUser(user_id)) {
                                    sessionStorage.removeItem('access-token');
                                    toast.success(member_type === 'admin' ? "Admin Deleted Successfully" : "User Deleted Successfully");
                                    navigator('/');
                                }
                                else {
                                    toast.success(member_type === 'admin' ? "Admin Deleted Successfully" : "User Deleted Successfully");
                                }
                            }
                            else {
                                toast.error("Something went wrong!");
                            }
                            getAllUser();
                        })
                        .catch(err => console.log('Error occured ', err));
                }
            });
    }

    if (users.length < 0) {
        return (
            <div className='text-center maintain_gap'>
                <h2 className='my-3'>Loading...</h2>
            </div>
        )
    }

    return (
        <div className='text-center maintain_gap'>
            <h2 className='my-3'>All {member_type === 'admin' ? 'Admins' : 'Users'}</h2>

            {member_type === 'admin' ?
                <Button variant='success' className='big-btn' as={Link} to='/signup/admin'><FaUserPlus className='icon' /> Add Admin</Button>
                : null}

            <Container className='mt-3'>

                <div className="searching-sorting d-flex flex-column flex-md-row justify-content-between">

                    {/* search bar  */}
                    <Form className='search-bar mb-2'>
                        <InputGroup className="mb-0">
                            <InputGroup.Text id="basic-addon1">Search</InputGroup.Text>
                            <Form.Control placeholder="Type here..." aria-label="search" aria-describedby="basic-addon1" onChange={(event) => setSearchText(event.target.value)} />
                        </InputGroup>
                    </Form>

                    {/* sorting bar  */}
                    <Form.Select aria-label="Default select example" className='sort-dropdown mb-2' onChange={showSortingData}>
                        <option>Sorted By</option>
                        <option value="assending">A-Z</option>
                        <option value="decending">Z-A</option>
                    </Form.Select>
                </div>

                <Table striped bordered hover variant="dark" className="table text-center align-middle">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>profile_pic</th>
                            <th>Email</th>
                            <th>User Type</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.filter(user => {
                            if (searchText === '') {
                                return users;
                            }
                            if ((user.f_name + ' ' + user.l_name).toLowerCase().includes(searchText.toLowerCase())) {
                                return user;
                            }
                            if (user.email.toLowerCase().includes(searchText.toLowerCase())) {
                                return user;
                            }
                        }).map(user => (
                            member_type === user.user_type ?
                                <tr className='user-row' key={user.id}>
                                    <td>{count++}.</td>
                                    <td>{user.f_name + ' ' + user.l_name}</td>
                                    <td><Image className='user-profile-pic' src={user.profile_pic === '' ? '/assets/user/demo-user.png' : user.profile_pic} alt='profile' /></td>
                                    <td>{user.email}</td>
                                    {user.user_type === 'admin' ?
                                        (<td className='text-danger'>{user.user_type}</td>) : (<td className='text-success'>{user.user_type}</td>)
                                    }
                                    <td>
                                        <Button variant='outline-danger' className='small-btn' onClick={() => deleteUser(user.id, member_type)}><FaTrashAlt className='icon' /> Delete</Button>
                                    </td>
                                </tr> : null
                        ))}
                    </tbody>
                </Table>
            </Container>
        </div>
    )
}

export default AllUser