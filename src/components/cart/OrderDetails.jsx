import React, { useEffect, useState } from 'react'
import { Container, Image, Row } from 'react-bootstrap'
import { Link, useParams } from 'react-router-dom'
import axiosInstance from '../../api/axiosInstance/axiosInstance';
import { endPoint_Category, endPoint_Purchase } from '../../api/api_url/apiUrl';

const OrderDetails = () => {

    const { user_id } = useParams(),
        [orders, setOrders] = useState([]),
        [category, setCategory] = useState([]),
        [specificOrder, setSpecificOrder] = useState([]);

    // Get all ordered items
    const getAllOrders = () => {
        axiosInstance.get(endPoint_Purchase)
            .then(res => setOrders([...res.data]))
            .catch(err => console.log(err));
    }

    // Get all ordered items of specific user 
    const getSpecificOrder = (user_id) => {
        if (!orders) return null;
        return orders.filter(order => order.user_id === user_id);
    }

    // Get all category 
    const getAllCategory = () => {
        axiosInstance.get(endPoint_Category)
            .then(res => setCategory(res.data))
            .catch(err => console.log('Error occurred', err))
    }

    // Get specific category name 
    const getCategoryName = (cat_id) => {
        const specific_category = category.find(cat => cat.id === cat_id);
        return specific_category ? specific_category.title : null;
    }

    useEffect(() => {
        getAllCategory();
        getAllOrders();
    }, []);

    useEffect(() => {
        if (orders.length > 0) {
            const fetchSpecificOrder = getSpecificOrder(user_id);
            setSpecificOrder([...fetchSpecificOrder]);
        }
    }, [orders]);

    // console.log(specificOrder);

    if (!orders || specificOrder.length < 0) {
        return (
            <div className='maintain_gap'>
                <h2 className="text-center mt-3">Loading...</h2>
            </div>
        )
    }
    else if (specificOrder.length === 0) {
        return (
            <div className='text-center maintain_gap'>
                <h2 className="my-3">No Order Found</h2>
                <Image src='/assets/category/category.gif' alt='no-order-found' />
            </div>
        )
    }

    return (
        <div className='maintain_gap'>
            <h2 className="text-center mt-3">Your Orders</h2>

            <Container className='mt-3'>
                {specificOrder.map(order => (
                    <Row className='order-details mb-2' key={order.id}>
                        <div className='d-flex justify-content-between pt-3'>
                            <p>Order ID : <span className='text-info'>ordr{order.id}</span></p>
                            <p>Payment Mode : <span className='text-secondary'>{order.payment_mode}</span></p>
                            <p>Order Amount : <span className='text-success'>${order.total_amount}</span> (Delivery : <span className='text-warning'>${order.delivery_charge}</span>)</p>
                            <p className='text-primary'>{order.purchase_date}</p>
                        </div>
                        <hr className='order-hr' />

                        {order.product_details.map((productOrder, index) => (
                            <div className='d-flex align-items-center' key={index}>
                                <Image className='orderImg' src={productOrder.img} alt='#product-img' />
                                <div className='d-flex flex-column'>
                                    <p className='fs-3 order-product-title' ><Link to={`/category/${productOrder.category}/product/${productOrder.product_id}/product_details`}>{productOrder.name}</Link></p>
                                    <div className='d-flex gap-4'>
                                        <p className='fs-5'>Brand : {productOrder.brand}</p>
                                        <p className='fs-5'>Category : {getCategoryName(productOrder.category)}</p>
                                        <p className='fs-5'>Price : <del className='fs-6 text-danger'>${productOrder.actual_price}</del> ${productOrder.purchase_price}</p>
                                    </div>
                                    <p>Order quantity : {productOrder.quantity}</p>
                                </div>
                            </div>
                        ))}
                    </Row>
                ))}
            </Container>
        </div>
    )
}

export default OrderDetails