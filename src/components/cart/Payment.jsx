import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { endPoint_Cart, endPoint_instruction, endPoint_Product, endPoint_Purchase, endPoint_User } from '../../api/api_url/apiUrl';
import axiosInstance from '../../api/axiosInstance/axiosInstance';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { Col, Image, Row } from 'react-bootstrap';
import { MdOutlinePayment } from 'react-icons/md';
import { useForm } from 'react-hook-form';
import { radioUpi, radioCard, radioNetBanking, radioEmi, radioCod, handleUpi, handleCard, handleNetBanking, handleEmi, paymentDetails } from '../../common-function/paymentMode';
import Swal from 'sweetalert2';

const Payment = () => {

    const { cart_id } = useParams();
    // console.log(cart_id);

    const form = useForm(),
        { register, handleSubmit, formState } = form,
        { errors } = formState;

    const [cartItems, setCartItems] = useState([]),
        [specificCart, setSpecificCart] = useState({}),
        [users, setUsers] = useState([]),
        [specificUser, setSpecificUser] = useState({}),
        [products, setProducts] = useState([]),
        [instruction, setInstruction] = useState({}),
        [total, setTotal] = useState(0),
        [discount, setDiscount] = useState(0),
        navigate = useNavigate();

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

    //   Get specific user details 
    const getSpecificUser = (user_id) => {
        // console.log('user id',user_id);

        if (users.length === 0) return null;
        return users.find(user => user.id === user_id);
    }

    // Get all products 
    const getAllProducts = () => {
        axiosInstance.get(endPoint_Product)
            .then(res => setProducts(res.data))
            .catch(err => console.log('Error occurred', err))
    }

    // Get All Cart Items 
    const getAllCartItems = () => {
        axiosInstance.get(endPoint_Cart)
            .then(res => setCartItems([...res.data]))
            .catch(err => console.log(err));
    }

    //Get all instructions
    const getAllInstructions = () => {
        axiosInstance.get(endPoint_instruction)
            .then(res => setInstruction(res.data))
            .catch(err => console.log('Error occurred', err));
    }

    // Get specific cart details 
    const getSpecificCartDetails = (cart_id) => {
        const specificCartDetails = cartItems.find(cart => cart.id === cart_id);
        // console.log(specificCartDetails);

        setSpecificCart({ ...specificCartDetails });
    }

    // Get specific product details 
    const getSpecificProduct = (prd_id) => {
        return products.find(prd => prd.id === prd_id) || null;
    }

    // Total count of element in cart 
    const setTotalItemsOfCart = () => {
        // console.log(specificCart);

        let count = 0,
            CartProductList = specificCart.product_details;

        if (CartProductList) {
            CartProductList.forEach((item) => {
                count += item.quantity;
            })
        }
        return count;
    }

    // Product price after discount converter
    const makeDiscount = (price, discount) => {
        return (price - (price * discount) / 100).toFixed(2);
    }

    // Total amount of elements in cart
    const totalAmount = () => {
        let amount;
        if (!specificCart || !specificCart.product_details) return 0;

        const amounts = specificCart.product_details.map(item => {
            const productDetails = getSpecificProduct(item.product_id);
            if (!productDetails) return 0;
            amount = (makeDiscount(productDetails.price, productDetails.discount) * item.quantity).toFixed(2);
            return amount;
        });

        amount = amounts.reduce((sum, val) => sum + Number(val), 0);
        if (amount < Number.parseInt(instruction.min_free_delivery_order_amount)) setDiscount(instruction.delivery_charge)
        return amount < Number.parseInt(instruction.min_free_delivery_order_amount) ? amount + Number.parseInt(instruction.delivery_charge) : amount;
    };

    useEffect(() => {
        getAllUser();
        getAllProducts();
        getAllCartItems();
        getAllInstructions();
    }, []);

    useEffect(() => {
        if (cartItems.length > 0) {
            getSpecificCartDetails(cart_id);
        }
    }, [cartItems, cart_id]);

    useEffect(() => {
        setTotal(totalAmount());
    }, [specificCart, products]);

    useEffect(() => {
        if (Object.keys(specificCart).length > 0) {
            setSpecificUser({ ...getSpecificUser(specificCart.user_id) });
        }
    }, [specificCart]);

    const handlePayment = (data) => {
        // console.log(data);

        let currentDateArr = ('' + new Date()).split(" ");
        let currentDate = currentDateArr[2] + ' ' + currentDateArr[1] + ' ' + currentDateArr[3];

        const product = []
        specificCart.product_details.forEach(prd => product.push(getSpecificProduct(prd.product_id)));
        if (!product) {
            console.error("Product not found", specificCart.product_id, products);
            return;
        }

        else if (total < instruction.min_order_amount) {
            Swal.fire("Oops...", "Minimum order value is $" + instruction.min_order_amount, "info");
            return;
        }

        else {
            const paymentObj = {
                user_id: specificUser.id,
                product_details: specificCart.product_details.map(item => {
                    const product = getSpecificProduct(item.product_id);
                    return {
                        product_id: item.product_id,
                        name: product?.name || '',
                        brand: product?.brand || '',
                        category: product?.category_id || '',
                        actual_price: product?.price || 0,
                        purchase_price: makeDiscount(product?.price, product?.discount) || 0,
                        img: product?.img[0] || '',
                        quantity: item.quantity
                    };
                }),
                total_amount: total,
                delivery_charge: discount,
                payment_mode: data.paymentMode,
                paymentDetails: paymentDetails,
                purchase_date: currentDate
            }

            let productID = paymentObj.product_details.map(product => product.product_id);
            let productQuantity = paymentObj.product_details.map(product => product.quantity);
            let availableProduct = productID.map((prd, index) => getSpecificProduct(prd).stock_quantity >= productQuantity[index]);

            if (!products.length) {
                console.warn("Products not loaded yet");
                return;
            }
            else if (availableProduct.includes(false)) {
                Swal.fire("Oops...", "Please check available product quantity", "info");
            }
            else {
                // console.log(paymentObj);

                axiosInstance.post(endPoint_Purchase, paymentObj)
                    .then(res => {
                        if (res.status === 201) {
                            let cartUrl = endPoint_Cart + '/' + cart_id;
                            axiosInstance.delete(cartUrl)
                                .then(res => {
                                    if (res.status === 200) {
                                        paymentObj.product_details.forEach(prd => {
                                            const productStock = getSpecificProduct(prd.product_id);
                                            const updateProductStock = {
                                                ...productStock,
                                                stock: Number.parseInt(productStock.stock_quantity) - Number.parseInt(prd.quantity) > 0 ? "In stock" : "Out of stock",
                                                stock_quantity: Number.parseInt(productStock.stock_quantity) - Number.parseInt(prd.quantity)
                                            }
                                            // console.log(updateProductStock);

                                            const updateProduct = endPoint_Product + '/' + prd.product_id;
                                            axiosInstance.put(updateProduct, updateProductStock)
                                                .then(res => console.log('Product details updated successfully'))
                                                .catch(err => {
                                                    console.log(err);
                                                    Swal.fire("Oops...", "Something went wrong!", "error");
                                                })
                                        })

                                        Swal.fire("Congrates!", "Your order successfully placed", "success");
                                        navigate('/order_details/' + specificUser.id);
                                    }
                                    else {
                                        Swal.fire("Oops...", "Something went wrong!", "error");
                                    }
                                })
                                .catch(err => {
                                    console.log(err);
                                    Swal.fire("Oops...", "Something went wrong!", "error");
                                })
                        }
                        else {
                            Swal.fire("Oops...", "Something went wrong!", "error");
                        }
                    })
                    .catch(err => {
                        console.log(err);
                        Swal.fire("Oops...", "Something went wrong!", "error");
                    })
            }
        }
    }


    if (Object.keys(specificUser).length === 0 || total === 0 || setTotalItemsOfCart() === 0) {
        <div className='d-flex flex-column align-items-center mt-5 maintain_gap'>
            <h3>Loading...</h3>
        </div>
    }

    return (
        <div className='d-flex flex-column align-items-center mt-3 maintain_gap'>
            <div className="w-60 d-flex justify-content-between">
                <span>
                    <h3 className='fw-bold fs-1'>Delivered to</h3>
                    <h4>{specificUser.f_name} {specificUser.l_name}</h4>
                    <h6>Contact no : {specificUser.contact_no}</h6>
                    <p>{specificUser.address}</p>
                </span>
                <Image className='payment_img' src='/assets/payment/gif_45.gif' alt='#address' />
            </div>

            <Form className='form-50 my-2' onSubmit={handleSubmit(handlePayment)}>
                <h4>Payment Method</h4>
                <hr />

                {/* upi  */}
                <Form.Group className="mb-3">
                    <Form.Check type='radio' label='UPI' value='UPI' {...register('paymentMode', {
                        required: {
                            value: true,
                            message: 'Please choose one payment mode*'
                        }
                    })} id='upiCheck' onChange={() => radioUpi()} />
                    <div id="upi" className="hidden">
                        <Row className='ms-5'>
                            <Col xs="auto">
                                <Form.Control type="text" id='upiPlaceholder' placeholder="@upi id" />
                            </Col>
                            <Col xs="auto">
                                <Button variant='outline-primary' type='button' onClick={() => handleUpi()}>Verify</Button>
                            </Col>
                        </Row>
                    </div>
                </Form.Group>

                {/* credit/debit card  */}
                <Form.Group className="mb-3">
                    <Form.Check type='radio' label='Credit or debit card' value='Credit or Debit card' {...register('paymentMode', {
                        required: {
                            value: true,
                            message: 'Please choose one payment mode*'
                        }
                    })} id='cardCheck' onChange={() => radioCard()} />
                    <div id="card" className="hidden">
                        <Row className='ms-5'>
                            <Col>
                                <Form.Control type="number" id='cardNumberPlaceholder' placeholder="Card number" />
                            </Col>
                            <Col>
                                <Form.Control type="number" id='cardCVVPlaceholder' placeholder="CVV number" />
                            </Col>
                            <Col>
                                <Button variant='outline-primary' type="button" onClick={() => handleCard()}>Verify <MdOutlinePayment className='icon' /></Button>
                            </Col>
                        </Row>
                    </div>
                </Form.Group>

                {/* Net banking  */}
                <Form.Group className="mb-3">
                    <Form.Check type='radio' label='Net Banking' value='Net Banking' {...register('paymentMode', {
                        required: {
                            value: true,
                            message: 'Please choose one payment mode*'
                        }
                    })} id='netBankingCheck' onChange={() => radioNetBanking()} />
                    <div id="netBanking" className="hidden">
                        <Row className='ms-5'>
                            <Col>
                                <Form.Control type="text" id='bankingIdPlaceholder' placeholder="Banking ID" />
                            </Col>
                            <Col>
                                <Form.Group>
                                    <Form.Select id='bankingNameHolder'>
                                        <option value="">Bank</option>
                                        <option value="SBI">SBI</option>
                                        <option value="PNB">PNB</option>
                                        <option value="HDFC">HDFC</option>
                                        <option value="Axis">Axis Bank</option>
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                            <Col>
                                <Button variant='outline-primary' type="button" onClick={() => handleNetBanking()}>Check</Button>
                            </Col>
                        </Row>
                    </div>
                </Form.Group>

                {/* EMI  */}
                <Form.Group className="mb-3">
                    <Form.Check type='radio' label='EMI' value='EMI' {...register('paymentMode', {
                        required: {
                            value: true,
                            message: 'Please choose one payment mode*'
                        }
                    })} id='emiCheck' onChange={() => radioEmi()} />
                    <div id="emi" className="hidden">
                        <Row className='ms-5'>
                            <Col>
                                <Form.Control type="number" id='bankAccountEMIPlaceholder' placeholder="Account number" />
                            </Col>
                            <Col>
                                <Form.Group>
                                    <Form.Select id='bankAccountEMIName'>
                                        <option value="">Bank</option>
                                        <option value="SBI">SBI</option>
                                        <option value="PNB">PNB</option>
                                        <option value="HDFC">HDFC</option>
                                        <option value="Axis">Axis Bank</option>
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                            <Col>
                                <Button variant='outline-primary' type="button" onClick={() => handleEmi()}>Check</Button>
                            </Col>
                        </Row>
                    </div>
                </Form.Group>

                {/* COD  */}
                <Form.Group className="mb-3">
                    <Form.Check type='radio' label='Cash on Delivery/Pay on Delivery' value='COD' {...register('paymentMode', {
                        required: {
                            value: true,
                            message: 'Please choose one payment mode*'
                        }
                    })} id='codCheck' onChange={() => radioCod()} />
                    <Form.Text className="text-muted ms-4">
                        Cash,UPI and Cards accepted.
                    </Form.Text>
                </Form.Group>

                <p className="input-error">{errors.paymentMode?.message}</p>

                <div className="text-center">
                    <Button variant="outline-success" type="submit" id='paymentButton' disabled>
                        Pay ${total} ({setTotalItemsOfCart() > 1 ? setTotalItemsOfCart() + ' items' : setTotalItemsOfCart() + ' item'})
                    </Button>
                </div>
            </Form>
        </div>
    )
}

export default Payment