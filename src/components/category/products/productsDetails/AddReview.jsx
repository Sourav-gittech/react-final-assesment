import React, { useEffect, useState } from 'react'
import { Container } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useForm } from 'react-hook-form';
import { MdOutlinePreview } from 'react-icons/md';
import { TiStarFullOutline } from 'react-icons/ti';
import { useNavigate, useParams } from 'react-router-dom';
import axiosInstance from '../../../../api/axiosInstance/axiosInstance';
import { endPoint_Product, endPoint_Purchase, endPoint_Review, endPoint_User } from '../../../../api/api_url/apiUrl';
import Swal from 'sweetalert2';

const AddReview = () => {

    const { product_id } = useParams(),
        form = useForm(),
        { register, handleSubmit, formState } = form,
        { errors } = formState,
        [users, setUsers] = useState([]),
        [product, setProduct] = useState({}),
        [reviews, setReviews] = useState([]),
        [orders, setOrders] = useState([]),
        navigator = useNavigate();

    // Fetch All User 
    const getAllUser = async () => {
        try {
            const res = await axiosInstance.get(endPoint_User);
            if (res.status === 200) {
                return res.data;
            } else {
                Swal.fire("Oops...", "Something went wrong!", "error");
                return [];
            }
        }
        catch (err) {
            console.log(err);
            return [];
        }
    };

    // Fetch logged user id
    const fetchLoggedUser = async () => {
        try {
            const token = (sessionStorage.getItem("access-token") || "").trim();

            const findLoggedUser = users.find(user => user.token === token);
            // console.log("Logged user ", findLoggedUser);

            return findLoggedUser ? findLoggedUser.id : null;
        }
        catch (err) {
            console.log(err);
            return null;
        }
    };

    // To get specific product 
    const showSpecificProduct = () => {
        const productURL = endPoint_Product + '/' + product_id;
        axiosInstance.get(productURL)
            .then(res => {
                // console.log(res.data);
                setProduct({ ...res.data });
            })
            .catch(err => console.log('Error occured ', err));
    }

    // Get all ordered items
    const getAllOrders = () => {
        axiosInstance.get(endPoint_Purchase)
            .then(res => setOrders([...res.data]))
            .catch(err => console.log(err));
    }

    // Check product is purchased by specific user or not
    const getSpecificOrderID = (user_id, product_id) => {
        if (!orders) return null;
        let orderItemIdArr = [];
        orders.forEach(order => {
            if (order.user_id === user_id) {
                order.product_details.forEach(prdDetails => {
                    orderItemIdArr.includes(prdDetails.product_id) ? orderItemIdArr : orderItemIdArr.push(prdDetails.product_id)
                })
            }
        });
        return orderItemIdArr.includes(product_id);
    }

    // Fetch all reviews 
    const getAllReviews = async () => {
        try {
            const res = await axiosInstance.get(endPoint_Review);
            if (res.status === 200) {
                return res.data;
            } else {
                Swal.fire("Oops...", "Something went wrong!", "error");
                return [];
            }
        }
        catch (err) {
            console.log(err);
            return [];
        }
    }

    // Fetch specific review
    const fetchSpecificReview = (product_id, user_id) => {
        const specificReview = reviews.find(review => review.product_id === product_id && review.user_id === user_id);
        return specificReview ? true : false;
    };

    useEffect(() => {
        const loadReview = async () => {
            const allUsers = await getAllUser(),
                allReview = await getAllReviews();
            setUsers(allUsers);
            setReviews(allReview);
            showSpecificProduct();
            getAllOrders();
        };
        loadReview();
    }, []);

    const addReview = async (data) => {
        const loggedUserId = await fetchLoggedUser();

        if (!loggedUserId) {
            Swal.fire("Sorry", "You have to logged in first", "error");
            return;
        }

        else if (!getSpecificOrderID(loggedUserId, product_id)) {
            Swal.fire("Sorry", "You have to purchase first to submit review", "info");
            return;
        }


        else if (fetchSpecificReview(product_id, loggedUserId)) {
            Swal.fire("Oops...", "You have already submited review", "info");
            return;
        }

        else {
            // console.log(loggedUserId, product_id, data);

            let currentDateArr = ('' + new Date()).split(" ");
            let currentDate = currentDateArr[2] + ' ' + currentDateArr[1] + ' ' + currentDateArr[3] + ' ' + currentDateArr[4];

            const reviewObj = {
                product_id: product_id,
                user_id: loggedUserId,
                rating: data.rating,
                title: data.title,
                description: data.desc,
                date: currentDate
            }
            // console.log(reviewObj);

            axiosInstance.post(endPoint_Review, reviewObj)
                .then(res => {
                    if (res.status === 201) {
                        Swal.fire("Congrates", "Review Added Successfully", "success");
                        navigator('/category/' + product.category_id + '/product/' + product_id + '/product_details');
                    }
                    else {
                        Swal.fire("Oops...", "Something went wrong!", "error");
                    }
                })
                .catch(err => console.log(err));
        }

    }

    return (
        <div className='maintain_gap'>

            {(Object.keys(product).length === 0) ?
                (<h2 className="text-center mt-3">Loading...</h2>) :
                (<>
                    <h2 className="text-center mt-3">Add Review</h2>

                    <Container className='d-flex flex-column align-items-center mt-3'>
                        <h5>Product name : {product.name}</h5>
                        <h6>Brand : {product.brand}</h6>
                        <Form className='mt-3 form-50' onSubmit={handleSubmit(addReview)}>

                            {/* review title  */}
                            <Form.Group className="mb-3" controlId="formBasicTitle">
                                <Form.Label>Review Title</Form.Label>
                                <Form.Control type="text" {...register('title', {
                                    required: {
                                        value: true,
                                        message: 'Required*'
                                    }
                                })} placeholder="Enter title" />
                                <p className="input-error">{errors.title?.message}</p>
                            </Form.Group>

                            {/* rating  */}
                            <Form.Group className="mb-3" controlId="formBasicRating">
                                <Form.Label>Rating</Form.Label>
                                <div className="d-flex justify-content-evenly mb-3">
                                    <Form.Check type='radio' id='1' value='1' name='rating' {...register('rating', {
                                        required: {
                                            value: true,
                                            message: 'Required*'
                                        }
                                    })} label={<span>1 <TiStarFullOutline className='icon star-icon' />
                                    </span>} />
                                    <Form.Check type='radio' id='2' value='2' name='rating' {...register('rating', {
                                        required: {
                                            value: true,
                                            message: 'Required*'
                                        }
                                    })} label={<span>2 <TiStarFullOutline className='icon star-icon' />
                                    </span>} />
                                    <Form.Check type='radio' id='3' value='3' name='rating' {...register('rating', {
                                        required: {
                                            value: true,
                                            message: 'Required*'
                                        }
                                    })} label={<span>3 <TiStarFullOutline className='icon star-icon' />
                                    </span>} />
                                    <Form.Check type='radio' id='4' value='4' name='rating' {...register('rating', {
                                        required: {
                                            value: true,
                                            message: 'Required*'
                                        }
                                    })} label={<span>4 <TiStarFullOutline className='icon star-icon' />
                                    </span>} />
                                    <Form.Check type='radio' id='5' value='5' name='rating' {...register('rating', {
                                        required: {
                                            value: true,
                                            message: 'Required*'
                                        }
                                    })} label={<span>5 <TiStarFullOutline className='icon star-icon' />
                                    </span>} />
                                </div>
                                <p className="input-error">{errors.rating?.message}</p>
                            </Form.Group>

                            {/* review description  */}
                            <Form.Group className="mb-3" controlId="formBasicDescription">
                                <Form.Label>Description</Form.Label>
                                <Form.Control as="textarea" rows={3} {...register('desc', {
                                    required: {
                                        value: true,
                                        message: 'Required*'
                                    }
                                })} placeholder='Type here...' />
                                <p className="input-error">{errors.desc?.message}</p>
                            </Form.Group>

                            <div className="text-center">
                                <Button variant="outline-success" type="submit" className='big-btn'><MdOutlinePreview className='icon' /> Add Review</Button>
                            </div>
                        </Form>
                    </Container>
                </>)}
        </div>
    )
}

export default AddReview