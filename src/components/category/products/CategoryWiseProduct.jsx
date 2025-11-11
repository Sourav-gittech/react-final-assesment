import React, { useEffect, useState } from 'react'
import { Col, Container, Row, Button, Card, Form, InputGroup } from 'react-bootstrap'
import { FaCartPlus } from 'react-icons/fa'
import { IoListCircleSharp } from 'react-icons/io5'
import { Link, useParams } from 'react-router-dom'
import axiosInstance from '../../../api/axiosInstance/axiosInstance'
import { endPoint_Category, endPoint_Product, endPoint_User } from '../../../api/api_url/apiUrl'
import addToCart from '../../../common-function/addToCart'

const CategoryWiseProduct = () => {

  const { category_id } = useParams(),
    [category, setCategory] = useState(''),
    [products, setProducts] = useState([]),
    [users, setUsers] = useState([]),
    [searchText, setSearchText] = useState('');

  // To get all category 
  const getCategoryName = (cat_id) => {
    const specificCategoryEndPoint = endPoint_Category + '/' + cat_id;
    axiosInstance.get(specificCategoryEndPoint)
      .then(res => {
        // console.log(res.data.title);
        setCategory(res.data);
      })
      .catch(err => console.log('Error occured ', err));
  }

  // To get all products 
  const showAllProducts = () => {
    axiosInstance.get(endPoint_Product)
      .then(res => {
        // console.log(res.data);
        setProducts([...res.data]);
      })
      .catch(err => console.log('Error occured ', err));
  }

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

  // Check logged user
  const checkLoggedUser = () => {
    try {
      const token = (sessionStorage.getItem('access-token') || '').trim();
      // console.log(token);

      const findLoggedUser = users.find(user => user.token == token);
      // console.log(findLoggedUser);

      if (!findLoggedUser) {
        return false;
      }
      else {
        return findLoggedUser.user_type === 'admin' ? true : false;
      }
    }
    catch (err) {
      console.log(err);
    }
  }

  // To get category wise product 
  const showCategoryWiseProduct = (cat_id) => {
    let categoryWiseProduct = products.filter(product => product.category_id == cat_id);
    return categoryWiseProduct;
  }

  // Product price after discount converter
  const makeDiscount = (price, discount) => {
    return (price - (price * discount) / 100).toFixed(2);
  }

  useEffect(() => {
    getAllUser();
    getCategoryName(category_id);
    showAllProducts();
  }, [setProducts, setCategory]);

  const showSortingData = (event) => {
    // console.log(event.target.value);
    if (event.target.value === 'assending') {
      let assendingProducts = products.sort((a, b) => a.name.localeCompare(b.name));
      setProducts([...assendingProducts]);
    }
    if (event.target.value === 'decending') {
      let decendingProducts = products.sort((a, b) => b.name.localeCompare(a.name));
      setProducts([...decendingProducts]);
    }
    if (event.target.value === 'brand') {
      let brandProducts = products.sort((a, b) => a.brand.localeCompare(b.brand));
      setProducts([...brandProducts]);
    }
    if (event.target.value === 'price') {
      let priceProducts = products.sort((a, b) => a.price - b.price);
      setProducts([...priceProducts]);
    }
  }

  // console.log(showCategoryWiseProduct(category_id));

  if (showCategoryWiseProduct(category_id).length === 0) {
    return (
      <div className='d-flex flex-column align-items-center justify-content-center maintain_gap'>
        <h2 className="text-center mt-3">Category : {category.title}</h2>
        <p className="mt-3 text-center category-description">{category.description}</p>
        <h3 className="text-center mt-3">No Product Found</h3>
      </div>
    )
  }

  else if (!category && !products) {
    return (
      <div className='maintain_gap'>
        <h3 className="text-center mt-3">Loading...</h3>
      </div>
    )
  }

  return (
    <div className='d-flex flex-column align-items-center justify-content-center maintain_gap'>
      <h2 className="text-center mt-3">Category : {category.title}</h2>
      <p className="mt-3 text-center category-description">{category.description}</p>

      <Container className='my-3'>
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
            <option value="brand">Brand</option>
            <option value="price">Price</option>
          </Form.Select>
        </div>

        <Row className='d-flex align-items-center justify-content-center'>

          {showCategoryWiseProduct(category_id).filter(product => {
            if (searchText === '') {
              return products;
            }
            if (product.name.toLowerCase().includes(searchText.toLowerCase())) {
              return product;
            }
          }).map(product => (
            <Col lg={3} md={4} sm={12} key={product.id}>
              <Card className='mt-3'>
                <Card.Img variant="top" className='product-img' src={product.img[0]} />
                <Card.Body>
                  {product.name.length > 12 ?
                    (<Card.Title className='text-center'>{product.name.slice(0, 12)}...</Card.Title>) : (<Card.Title className='text-center'>{product.name}</Card.Title>)
                  }
                  <Card.Text>
                    {product.brand.length > 15 ?
                      (<span className='d-block'>Brand : {product.brand.slice(0, 15)}...</span>) : (<span className='d-block'>Brand : {product.brand}</span>)
                    }
                    <span className='d-flex justify-content-between'>
                      <span>Price : ${makeDiscount(product.price, product.discount)}</span>
                      {product.stock == 'In stock' ? (<span className='text-success'>{product.stock}</span>) : (<span className='text-danger'>{product.stock}</span>)}
                    </span>
                  </Card.Text>
                  <div className="product-control text-center">
                    <Button variant="outline-info product_btn m-1" as={Link} to={`${product.id}/product_details`}><IoListCircleSharp className='icon' /> View Details</Button>
                    {!checkLoggedUser() ?
                      (<Button variant="outline-danger product_btn m-1" onClick={() => addToCart(product.id, product.stock_quantity, product.min_quantity, product.max_quantity)} ><FaCartPlus className='icon' /> Add to cart</Button>) : null}
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  )
}

export default CategoryWiseProduct