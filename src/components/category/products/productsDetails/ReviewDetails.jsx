import React, { useEffect, useState } from 'react'
import { TiStarFullOutline, TiStarOutline } from 'react-icons/ti'
import { endPoint_Review, endPoint_User } from '../../../../api/api_url/apiUrl';
import axiosInstance from '../../../../api/axiosInstance/axiosInstance';
import Swal from 'sweetalert2';

const ReviewDetails = (props) => {

    let { product_id } = props;

    const [reviews, setReviews] = useState([]),
        [users, setUsers] = useState([]);

    // Set rating in star 
    const setRating = (rating) => {
        let ratingArr = [];
        for (let i = 0; i < rating; i++) {
            ratingArr.push(<TiStarFullOutline className='star-icon' key={i} />);
        }
        for (let j = rating; j < 5; j++) {
            ratingArr.push(<TiStarOutline className='star-icon' key={j} />);
        }
        return ratingArr;
    }

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
    }

    // Fetch logged user id
    const fetchUserName = (user_id) => {
        const specificUser = users.find(user => user.id === user_id);
        return specificUser ? (specificUser.f_name + ' ' + specificUser.l_name) : null;
    };

    // Fetch all reviews 
    const showAllReviews = () => {
        axiosInstance.get(endPoint_Review)
            .then(res => setReviews([...res.data]))
            .catch(err => console.log('Error occured ', err));
    }

    const showSpecificReview = reviews.filter(review => review.product_id == product_id);

    useEffect(() => {
        const loadData = async () => {
            const userData = await getAllUser();
            setUsers(userData);
            showAllReviews();
        };
        loadData();
    }, []);

    if (showSpecificReview.length < 0) {
        return (
            <h3 className='text-center mt-2'>Loading...</h3>
        )
    }

    else if (showSpecificReview.length == 0) {
        return (
            <h3 className='border-box text-center mt-2'>No review available</h3>
        )
    }

    return (
        <div className='mt-2'>
            {
                showSpecificReview.map(review => (
                    <div className="review-description" key={review.id}>
                        <span className='rev-details mb-2'>
                            <span>
                                <h5 className='d-inline'>{fetchUserName(review.user_id) || 'Unknown'}</h5>
                                <p className='d-inline fst-italic mx-2'>- {review.date || 'Unknown'}</p>
                            </span>
                            <span>
                                {setRating(review.rating)}
                            </span>
                        </span>
                        <p className="fw-bold m-0">{review.title}</p>
                        <p>{review.description}</p>
                        <hr />
                    </div>
                ))
            }
        </div>
    )
}

export default ReviewDetails