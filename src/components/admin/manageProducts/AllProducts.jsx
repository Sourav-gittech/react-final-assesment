import React, { useEffect, useState } from 'react'
import { Button, Container, Form, Image, InputGroup } from 'react-bootstrap';
import Table from 'react-bootstrap/Table';
import { FaEye, FaPencilAlt, FaTrashAlt } from 'react-icons/fa';
import { IoAddCircleSharp } from 'react-icons/io5';
import { Link } from 'react-router-dom';
import axiosInstance from '../../../api/axiosInstance/axiosInstance';
import { endPoint_Category, endPoint_Product, endPoint_Review } from '../../../api/api_url/apiUrl';
import Swal from 'sweetalert2';
import { TiStarFullOutline, TiStarHalfOutline, TiStarOutline } from 'react-icons/ti';
import { toast } from 'react-toastify';

const AllProducts = () => {

  const [products, setProducts] = useState([]),
    [category, setCategory] = useState([]),
    [searchText, setSearchText] = useState(''),
    [reviews, setReviews] = useState([]),
    [avgRating, setAvgRating] = useState(0);

  let count = 1;

  // To get all products 
  const showAllProducts = () => {
    axiosInstance.get(endPoint_Product)
      .then(res => setProducts([...res.data]))
      .catch(err => console.log('Error occured ', err));
  }

  // To get all category 
  const getAllCategory = () => {
    axiosInstance.get(endPoint_Category)
      .then(res => setCategory([...res.data]))
      .catch(err => console.log('Error occured', err));
  }

  // To get specific category name
  const getCategoryName = (cat_id) => {
    let specific_category = category.find(cat => cat.id == cat_id);
    return specific_category ? specific_category.title : undefined;
  }

  // To sort by product name
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

  // To get specific review
  const showSpecificReview = (product_id) => {
    return reviews?.filter(review => review.product_id == product_id) || [];
  }

  // calculate avg. rating 
  const findAvgRating = (review) => {
    let rating = 0;
    review?.forEach(rev => {
      rating += Number.parseInt(rev.rating);
    });
    return (rating / review?.length).toFixed(1);
  }


  // To delete a sepcific product 
  const deleteProduct = (product_id) => {
    // console.log(product_id);

    Swal.fire({
      title: "Are you sure to delete?",
      showDenyButton: true,
      confirmButtonText: "Yes",
      denyButtonText: `No`
    })
      .then((result) => {
        if (result.isConfirmed) {
          const specificProductURL = endPoint_Product + '/' + product_id;

          axiosInstance.delete(specificProductURL)
            .then(res => {
              if (res.status == 200) {
                 toast.success("Product Deleted Successfully");
              }
              else {
                 toast.error("Something went wrong!");
              }
              showAllProducts();
            })
            .catch(err => console.log('Error occured ', err));
        }
      });
  }

  useEffect(() => {
    showAllProducts();
    getAllCategory();
    showAllReviews();
  }, []);

  useEffect(() => {
    if (reviews.length > 0) {
      setAvgRating(findAvgRating());
    }
  }, [reviews]);

  if (products.length < 0) {
    <div className='text-center maintain_gap'>
      <h2 className='my-3'>Loading...</h2>
    </div>
  }

  return (
    <div className='text-center maintain_gap'>
      <h2 className='my-3'>All Products</h2>

      <Button variant='success' className='big-btn' as={Link} to='/add_product'><IoAddCircleSharp className='icon' /> Add Product</Button>

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
            <option value="brand">Brand</option>
            <option value="price">Price</option>
          </Form.Select>
        </div>


        <Table striped bordered hover variant="dark" className="table text-center align-middle">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Brand</th>
              <th>Product image</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Available quantity</th>
              <th>Rating</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>

            {products.filter(product => {
              if (searchText === '') {
                return products;
              }
              if (product.name.toLowerCase().includes(searchText.toLowerCase())) {
                return product;
              }
              if (product.brand.toLowerCase().includes(searchText.toLowerCase())) {
                return product;
              }
              if (getCategoryName(product.category_id).toLowerCase().includes(searchText.toLowerCase())) {
                return product;
              }
            })
              .map(product => {
                const categoryName = getCategoryName(product.category_id);
                const specificReview = showSpecificReview(product.id);
                const specificAvgRating = specificReview?.length ? findAvgRating(specificReview) : 0;

                // if (!categoryName) {
                //   return (<div className='mt-5' key={'na'}>
                //     <p className="text-center">Loading...</p>
                //   </div>)
                // }

                return (
                  <tr key={product.id}>
                    <td>{count++}.</td>
                    {product.name.length < 18 ?
                      (<td>{product.name || 'Not Available'}</td>) : <td>{product.name.slice(0, 18)}...</td>}
                    <td className='admin-product-brand'>{product.brand || 'Not Available'}</td>
                    <td><Image className='admin-product-pic' src={product.img[0] === '' ? '/assets/product/demo-product.png' : product.img[0]} alt='product' /></td>
                    <td>{!getCategoryName(product.category_id) ? 'Not Available' : getCategoryName(product.category_id)}</td>
                    <td className='admin-product-price'>${product.price || 'Not Available'}</td>
                    {product.stock === 'In stock' ? (
                      <td className='text-success admin-product-stock'>{product.stock || 'Not Available'}</td>) :
                      (<td className='text-danger admin-product-stock'>{product.stock || 'Not Available'}</td>)
                    }
                    <td>{product.stock_quantity || 'Not Available'}</td>
                    <td className='admin-product-rating'>{setRating(specificAvgRating)}</td>
                    <td className='d-flex justify-content-evenly'>
                      <div>
                        <Button variant='outline-info' className='small-btn m-1' as={Link} to={`/edit_product/${product.id}`}><FaPencilAlt className='icon' /> Edit</Button>
                        <Button variant='outline-primary' className='small-btn m-1' as={Link} to={`/category/${product.category_id}/product/${product.id}/product_details`}><FaEye className='icon' /> View</Button>
                        <Button variant='outline-danger m-1' className='small-btn' onClick={() => deleteProduct(product.id)}><FaTrashAlt className='icon' /> Delete</Button>
                      </div>
                    </td>
                  </tr>
                )
              })}
          </tbody>
        </Table>
      </Container>
    </div>
  )
}

export default AllProducts