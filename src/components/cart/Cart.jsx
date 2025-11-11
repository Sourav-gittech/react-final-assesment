import React, { useEffect, useState } from 'react'
import { Button, Card, Col, Container, Image, Row } from 'react-bootstrap'
import CartItem from './CartItem'
import { GiTakeMyMoney } from 'react-icons/gi'
import axiosInstance from '../../api/axiosInstance/axiosInstance'
import { endPoint_Cart, endPoint_instruction, endPoint_Product, endPoint_User } from '../../api/api_url/apiUrl'
import { Link } from 'react-router-dom'

const Cart = () => {

  const [cartItems, setCartItems] = useState([]),
    [specificCartItems, setSpecificCartItems] = useState([]),
    [products, setProducts] = useState([]),
    [users, setUsers] = useState([]),
    [instruction, setInstruction] = useState({}),
    [total, setTotal] = useState(0);

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

  // Fetch All Cart Items 
  const getAllCartItems = () => {
    axiosInstance.get(endPoint_Cart)
      .then(res => {
        // console.log(res);
        if (res.status === 200) {
          setCartItems([...res.data]);
        }
        else {
          Swal.fire("Oops...", "Something went wrong!", "error");
        }
      })
      .catch(err => console.log(err));
  }

  // Get all products 
  const getAllProducts = () => {
    axiosInstance.get(endPoint_Product)
      .then(res => setProducts(res.data))
      .catch(err => console.log('Error occurred', err));
  }

  //Get all instructions
  const getAllInstructions = () => {
    axiosInstance.get(endPoint_instruction)
      .then(res => setInstruction(res.data))
      .catch(err => console.log('Error occurred', err));
  }

  // Fetch logged user id
  const fetchLoggedUser = () => {
    try {
      const token = (sessionStorage.getItem('access-token') || '').trim();
      // console.log(token);

      const findLoggedUser = users.find(user => user.token == token);
      // console.log('Logged user ', findLoggedUser);

      return findLoggedUser.id;
    }
    catch (err) {
      console.log(err);
    }
  }

  // Get specific product details 
  const getSpecificProduct = (prd_id) => {
    return products.find(prd => prd.id === prd_id) || null;
  }

  // Fetch specific cart items for logged user 
  const fetchSpecificCartItems = () => {
    const findSpecificCartItems = cartItems.filter(cartItem => cartItem.user_id === fetchLoggedUser());
    setSpecificCartItems([...findSpecificCartItems]);
    // console.log(findSpecificCartItems);
    setTotalItemsOfCart();
  }

  // Total count of element in cart 
  const setTotalItemsOfCart = () => {
    let count = 0;
    if (specificCartItems.length > 0) {
      specificCartItems[0].product_details.forEach((item) => {
        count += item.quantity;
      })
    }
    return count;
  }

  // Product price after discount converter
  const makeDiscount = (price, discount) => {
    return (price - (price * discount) / 100).toFixed(2);
  }

  // Total amount of element in cart 
  const totalAmount = async () => {
    if (specificCartItems.length === 0) return 0;

    const amounts = await Promise.all(
      specificCartItems[0].product_details.map(async (item) => {
        const productDetails = await getSpecificProduct(item.product_id);
        if (!productDetails) return 0;
        return makeDiscount(productDetails.price, productDetails.discount) * item.quantity;
      })
    );

    return amounts.reduce((sum, val) => sum + val, 0);
  };

  useEffect(() => {
    getAllUser();
    getAllCartItems();
    getAllProducts();
    getAllInstructions();
  }, []);

  useEffect(() => {
    if (users.length > 0 && cartItems.length > 0) {
      fetchSpecificCartItems();
    }
  }, [users, cartItems]);

  // console.log('specificCartItems',specificCartItems);

  useEffect(() => {
    if (users.length > 0 && cartItems.length > 0 && products.length > 0) {
      fetchSpecificCartItems();
    }
  }, [users, cartItems, products]);

  useEffect(() => {
    (async () => {
      setTotal(await totalAmount());
    })();
  }, [specificCartItems]);


  if (specificCartItems.length < 0) {
    return (
      <div className='maintain_gap'>
        <h2 className="text-center mt-3">Your Cart</h2>
        <h6 className="text-center mt-5">Loading...</h6>
      </div>
    )
  }

  else if (specificCartItems.length === 0) {
    return (
      <div className='maintain_gap d-flex flex-column align-items-center text-center'>
        <h2 className="mt-3">Your Cart</h2>
        <h6 className="my-4">No Products Found!</h6>
        <Image className='d-block' style={{ height: '400px', width: '400px' }} src='/assets/cart/cart.png' alt='#cart' />
      </div>
    )
  }

  return (
    <div className='maintain_gap'>
      <h2 className="text-center mt-3">Your Cart</h2>
      <Container className='mt-3'>
        <Row className='d-flex justify-content-center mb-5'>
          <CartItem itemsArr={specificCartItems} refreshCart={fetchSpecificCartItems} />
        </Row>
        <Row className='d-flex justify-content-center align-items-center checkout-card mt-2'>
          <Col lg={6} md={8} sm={12}>
            <Card className='p-3'>
              <Card.Body className='text-center p-1'>
                <Card.Title className='text-decoration-none'>Order Summery</Card.Title>
                <Card.Text className='d-flex flex-column align-items-center justify-content-around order-card'>

                  {instruction.min_order_amount > 0 || instruction.delivery_charge > 0 ?
                    (<span className="order_condition">**{instruction.min_order_amount > 0 ? `Minimum order amount $${instruction.min_order_amount} ` : null}
                    {instruction.min_order_amount > 0 && instruction.delivery_charge > 0 ?'and d':null}
                    {instruction.min_order_amount == 0 && instruction.delivery_charge > 0 ?'D':null}
                      {instruction.delivery_charge > 0 ? `elivery charge $${instruction.delivery_charge} under $${instruction.min_free_delivery_order_amount} order` : null}**</span>
                    ) : null}

                  <span className='item_count'>Total number of items : {setTotalItemsOfCart()}</span>
                  <span className='price_count'>Total Amount : ${total.toFixed(2)}</span>
                  <Button className='buy-btn mt-2' variant="outline-success" as={Link} to={`/purchase/${specificCartItems[0].id}`} >Proceed to Pay <GiTakeMyMoney className='icon' /></Button>
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default Cart