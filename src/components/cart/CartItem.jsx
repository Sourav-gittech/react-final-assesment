import React, { useEffect, useState } from 'react'
import { Button, Card, Col } from 'react-bootstrap'
import { BiTrash } from 'react-icons/bi'
import { FaMinusCircle, FaPlusCircle } from 'react-icons/fa'
import { endPoint_Cart, endPoint_Category, endPoint_Product } from '../../api/api_url/apiUrl'
import axiosInstance from '../../api/axiosInstance/axiosInstance'
import Swal from 'sweetalert2'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'

const CartItem = (props) => {
    const [products, setProducts] = useState([]),
        [category, setCategory] = useState([]),
        [cartItem, setCartItem] = useState([]),
        { itemsArr, refreshCart } = props;

    // Get all cart items 
    const getAllCartItem = () => {
        axiosInstance.get(endPoint_Cart)
            .then(res => setCartItem([...res.data]))
            .catch(err => console.log(err));
    }

    // Get all products 
    const getAllProducts = () => {
        axiosInstance.get(endPoint_Product)
            .then(res => setProducts(res.data))
            .catch(err => console.log('Error occurred', err))
    }

    // Get all category 
    const getAllCategory = () => {
        axiosInstance.get(endPoint_Category)
            .then(res => setCategory(res.data))
            .catch(err => console.log('Error occurred', err))
    }

    // Get specific cart details 
    const specificCartDetails = (cart_id) => {
        return cartItem.find(cart => cart.id === cart_id) || null;
    }

    // Get specific cart product details 
    const specificCartProductDetails = (cart_id, product_id) => {
        let cartDetails = specificCartDetails(cart_id);
        // console.log(cartDetails);
        if (!cartDetails || !Array.isArray(cartDetails.product_details)) {
            return null;
        }
        return cartDetails.product_details.find(prd => prd.product_id === product_id) || null;
    }

    // Get specific product details 
    const getSpecificProduct = (prd_id) => {
        const product_details = products.find(prd => prd.id === prd_id) || null;

        const product_obj = {
            id: product_details.id,
            name: product_details.name,
            brand: product_details.brand,
            img: product_details.img[0] === '' ? '/assets/product/demo-product.png' : product_details.img[0],
            category_id: product_details.category_id,
            price: product_details.price,
            discount: product_details.discount,
            stock_quantity: product_details.stock_quantity,
            min_quantity: product_details.min_quantity,
            max_quantity: product_details.max_quantity
        }
        return product_obj;
    }

    // Get specific category name 
    const getCategoryName = (cat_id) => {
        const specific_category = category.find(cat => cat.id === cat_id);
        return specific_category ? specific_category.title : null;
    }

    // Product price after discount converter
    const makeDiscount = (price, discount) => {
        return (price - (price * discount) / 100).toFixed(2);
    }

    // set update cart property 
    const updateProductQuantity = (cart_id, product_id, stock_quantity, min_quantity, max_quantity, action) => {
        const specificProductUrl = endPoint_Cart + '/' + cart_id;
        // console.log(action,specificProductUrl);

        const cartDetails = specificCartDetails(cart_id);

        const specificCartProduct = specificCartProductDetails(cart_id, product_id);
        // console.log(specificCartProduct);

        if (specificCartProduct.quantity === Number.parseInt(max_quantity) && action === 'increment') {
            Swal.fire("Oops...", "You can purchase maximum " + max_quantity + " items", "info");
        }

        else if (specificCartProduct.quantity === Number.parseInt(min_quantity) && action === 'decrement') {
            deleteItem(cart_id, product_id);
        }

        else {
            const updatedCartDetails = {
                ...cartDetails,
                product_details: cartDetails.product_details.map(p =>
                    p.product_id === product_id
                        ? { ...p, quantity: action === 'increment' ? specificCartProduct.quantity + 1 : specificCartProduct.quantity - 1 }
                        : p
                )
            }

            const checkStock = updatedCartDetails.product_details.find(cartEle => cartEle.product_id === product_id);

            if (checkStock.quantity > Number.parseInt(stock_quantity)) {
                Swal.fire("Oops...", "No more items available in stock", "info");
                return;
            }

            axiosInstance.put(specificProductUrl, updatedCartDetails)
                .then(res => {
                    if (res.status === 200) {
                        toast.success("Product quantity updated successfully");
                        refreshCart;
                    }
                }).catch(err => console.log(err));
        }
    }

    useEffect(() => {
        getAllCartItem();
        getAllCategory();
        getAllProducts();
    }, []);

    // Delete specific item from cart 
    const deleteItem = (cart_id, product_id) => {
        Swal.fire({
            title: "Are you sure to delete from cart?",
            showDenyButton: true,
            confirmButtonText: "Yes",
            denyButtonText: `No`
        })
            .then((result) => {
                if (result.isConfirmed) {
                    const specificCartEndPoint = endPoint_Cart + '/' + cart_id;
                    axiosInstance.get(specificCartEndPoint)
                        .then(res => {
                            // console.log(res);   
                            const cart = res.data;
                            const updatedCart = {
                                ...cart,
                                product_details: cart.product_details.filter(
                                    (p) => p.product_id !== product_id
                                )
                            }

                            const request = updatedCart.product_details.length === 0 ?
                                axiosInstance.delete(specificCartEndPoint) :
                                axiosInstance.put(specificCartEndPoint, updatedCart);

                            request.then(res => {
                                // console.log(res.status);

                                if (res.status === 200) {
                                    // window.location.reload();
                                    // refreshCart();
                                    toast.success("Product Deleted Successfully");

                                }
                                else {
                                    toast.error("Something went wrong!");
                                }
                            })
                                .catch(err => {
                                    console.log(err);
                                    Swal.fire("Oops...", "Something went wrong", "error");
                                })
                        })
                        .catch(err => console.log(err));
                }
            })
    }


    if (products.length === 0 || category.length === 0) {
        return (
            <h4 className='text-center'>Loading...</h4>
        )
    }

    return (
        <>
            {itemsArr[0].product_details.map((item, index) => {
                const productDetails = getSpecificProduct(item.product_id);
                const categoryName = productDetails ? getCategoryName(productDetails.category_id) : null;

                if (!productDetails || !categoryName) {
                    return (
                        <div key={item.id}>
                            <p className="text-center">Loading...</p>
                        </div>
                    )
                }

                return (
                    <Col lg={3} md={4} sm={6} xs={12} key={index}>
                        <Card>
                            <Card.Img variant="top" src={productDetails.img} className='cart-product-img' />
                            <Card.Body>
                                <Card.Title className="fw-bold text-center card-title">
                                    {productDetails.name}
                                </Card.Title>
                                <Card.Text className='m-0'>
                                    <span className="fw-bold">Brand: </span>{productDetails.brand}
                                </Card.Text>
                                <Card.Text className='m-0'>
                                    <span className="fw-bold">Category: </span>{categoryName}
                                </Card.Text>
                                <Card.Text className='m-0 fs-5'>
                                    <span className="fw-bold">Price: </span> <del className='text-danger fs-6'>${productDetails.price}</del> ${makeDiscount(productDetails.price, productDetails.discount)}
                                </Card.Text>

                                <span className='d-flex flex-xl-row flex-column justify-content-between mt-2'>
                                    <span className="quantity-btn d-flex justify-content-between align-items-center bg-secondary mb-2">
                                        <Button className='quantity-btn-1' variant="danger"
                                            onClick={() => updateProductQuantity(itemsArr[0].id, item.product_id, productDetails.stock_quantity, productDetails.min_quantity, productDetails.max_quantity, 'decrement')}>
                                            <FaMinusCircle className='icon quantity-icon' />
                                        </Button>
                                        <span className='quantity'>{item.quantity}</span>
                                        <Button className='quantity-btn-3' variant="success"
                                            onClick={() => updateProductQuantity(itemsArr[0].id, item.product_id, productDetails.stock_quantity, productDetails.min_quantity, productDetails.max_quantity, 'increment')}>
                                            <FaPlusCircle className='icon quantity-icon' />
                                        </Button>
                                    </span>
                                    <span className="text-center">
                                        <Button variant='danger' className='cart-delete-btn px-1' onClick={() => deleteItem(itemsArr[0].id, item.product_id)}>
                                            <BiTrash className='icon' /> Delete
                                        </Button>
                                    </span>
                                </span>
                            </Card.Body>
                        </Card>
                    </Col>
                )
            })}
        </>
    )
}

export default CartItem
