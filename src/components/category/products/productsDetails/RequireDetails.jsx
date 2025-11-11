import React, { useEffect, useState } from 'react'
import { Button } from 'react-bootstrap';
import { FaCartPlus, FaStarHalfAlt } from 'react-icons/fa';
import addToCart from '../../../../common-function/addToCart';
import { endPoint_Review } from '../../../../api/api_url/apiUrl';
import axiosInstance from '../../../../api/axiosInstance/axiosInstance';
import { TiStarFullOutline, TiStarHalfOutline, TiStarOutline } from 'react-icons/ti';

const RequireDetails = (props) => {

    const { product_id, brand, name, description, discount, price, stock_quantity, min_quantity, max_quantity, isAdmin } = props,
        [reviews, setReviews] = useState([]),
        [avgRating, setAvgRating] = useState(0);

    // calculate price after discount 
    const makeDiscount = (price, discount) => {
        return (price - (price * discount) / 100).toFixed(2);
    }

    // Set rating in star 
    const setRating = (rating) => {
        let ratingArr = [];
        const fullStar = Math.floor(rating),
            halfStar = rating - fullStar;
        for (let i = 0; i < fullStar; i++) {
            ratingArr.push(<TiStarFullOutline className='star-icon' key={i} />);
        }
        if (halfStar !== 0) {
            ratingArr.push(<TiStarHalfOutline className='star-icon' key='half' />);
        }
        for (let j = halfStar !== 0 ? fullStar + 1 : fullStar; j < 5; j++) {
            ratingArr.push(<TiStarOutline className='star-icon' key={j} />);
        }
        return ratingArr;
    }

    // Fetch all reviews 
    const showAllReviews = () => {
        axiosInstance.get(endPoint_Review)
            .then(res => setReviews([...res.data]))
            .catch(err => console.log('Error occured ', err));
    }

    const showSpecificReview = reviews.filter(review => review.product_id == product_id);
    // console.log(showSpecificReview);

    // calculate avg. rating 
    const findAvgRating = () => {
        let rating = 0, noReview = showSpecificReview.length;
        showSpecificReview.forEach(rev => {
            rating += Number.parseInt(rev.rating);
        })
        return noReview===0?rating:(rating / noReview).toFixed(1);
    }

    useEffect(() => {
        showAllReviews();
    }, [setReviews]);

    useEffect(() => {
        if (reviews.length > 0) {
            setAvgRating(findAvgRating());
        }
    }, [reviews]);

    if (!name || !price) {
        return (
            <h4 className="text-center">Loading...</h4>
        )
    }

    return (
        <>
            <span className='d-flex justify-content-between'>
                <p className='text-warning'>{brand}</p>
                <p>{setRating(avgRating)}</p>
            </span>
            <h2>{name.toUpperCase()}</h2>
            <p className="small-text">{description}</p>
            <div className="product-price d-flex align-items-center">
                <span className='price-discount'>-{discount}%</span>
                <h3 className='text-danger original-price mx-2'>${makeDiscount(price, discount)}</h3>
            </div>
            <p className='mt-1'>M.R.P.: <del>${Number.parseInt(price).toFixed(2)}</del></p>
            <div>
                {isAdmin ? null :
                    (<Button variant="outline-danger product_btn m-1" onClick={() => addToCart(product_id, stock_quantity, min_quantity, max_quantity)}><FaCartPlus className='icon' /> Add to cart</Button>)}
            </div>
        </>
    )
}

export default RequireDetails