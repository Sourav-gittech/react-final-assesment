import React, { useEffect, useState } from 'react'
import { Button, Container, Form, Image, InputGroup } from 'react-bootstrap';
import Table from 'react-bootstrap/Table';
import { FaEye, FaPencilAlt, FaTrashAlt } from 'react-icons/fa';
import { IoAddCircleSharp } from 'react-icons/io5';
import { Link, useParams } from 'react-router-dom';
import axiosInstance from '../../../api/axiosInstance/axiosInstance';
import { endPoint_Category, endPoint_Product } from '../../../api/api_url/apiUrl';
import Swal from 'sweetalert2';
import { TiStarFullOutline, TiStarOutline } from 'react-icons/ti';

const CategoryWiseProducts = () => {

    const { category_id } = useParams(),
        [products, setProducts] = useState([]),
        [category, setCategory] = useState({}),
        [searchText, setSearchText] = useState('');

    let count = 1;

    // To get all products 
    const showAllProducts = () => {
        axiosInstance.get(endPoint_Product)
            .then(res => setProducts([...res.data]))
            .catch(err => console.log('Error occured ', err));
    }

    // To get specific category 
    const getSpecificCategory = (cat_id) => {
        const specificCategoryEndPoint = endPoint_Category + '/' + cat_id;
        axiosInstance.get(specificCategoryEndPoint)
            .then(res => setCategory({ ...res.data }))
            .catch(err => console.log('Error occured', err));
    }

    // To get category wise product 
    const showCategoryWiseProduct = (cat_id) => {
        let categoryWiseProduct = products.filter(product => product.category_id == cat_id);
        return categoryWiseProduct;
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
        // <TiStarFullOutline className='star-icon' />
        // <TiStarHalfOutline className='star-icon' />
        // <TiStarOutline className='star-icon' />

        let ratingArr = [];
        for (let i = 0; i < rating; i++) {
            ratingArr.push(<TiStarFullOutline className='star-icon' key={i} />);
        }
        for (let j = rating; j < 5; j++) {
            ratingArr.push(<TiStarOutline className='star-icon' key={j} />);
        }
        return ratingArr;
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
                                Swal.fire("Success!", "Product Deleted Successfully", "success");
                            }
                            else {
                                Swal.fire("Oops...", "Something went wrong", "error");
                            }
                            showAllProducts();
                        })
                        .catch(err => console.log('Error occured ', err));
                }
            });
    }

    useEffect(() => {
        showAllProducts();
        getSpecificCategory(category_id);
    }, []);


    if (showCategoryWiseProduct(category_id).length < 0) {
        return (
            <div className='text-center maintain_gap'>
                <h2 className='my-3'>Loading...</h2>
            </div>
        )
    }

    else if (showCategoryWiseProduct(category_id).length === 0) {
        return (
            <div className='d-flex flex-column align-items-center justify-content-center maintain_gap'>
                <h2 className="text-center mt-3">Category : {category.title}</h2>
                <p className="mt-3 text-center category-description">{category.description}</p>
                <h2 className='my-2'>No Product Found</h2>
                <Image src='/assets/category/category.gif' />
            </div>
        )
    }

    return (
        <div className='d-flex flex-column align-items-center justify-content-center maintain_gap'>
            <h2 className="text-center mt-3">Category : {category.title}</h2>
            <p className="mt-3 text-center category-description">{category.description}</p>

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
                            <th>Price</th>
                            <th>Stock</th>
                            <th>Available quantity</th>
                            <th>Rating</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>

                        {showCategoryWiseProduct(category_id).filter(product => {
                            if (searchText === '') {
                                return products;
                            }
                            if (product.name.toLowerCase().includes(searchText.toLowerCase())) {
                                return product;
                            }
                            if (product.brand.toLowerCase().includes(searchText.toLowerCase())) {
                                return product;
                            }
                            if (category.title.toLowerCase().includes(searchText.toLowerCase())) {
                                return product;
                            }
                        })
                            .map(product => {
                                return (
                                    <tr key={product.id}>
                                        <td>{count++}.</td>
                                        {product.name.length < 18 ?
                                            (<td>{product.name || 'Not Available'}</td>) : <td>{product.name.slice(0, 18)}...</td>}
                                        <td className='admin-product-brand'>{product.brand || 'Not Available'}</td>
                                        <td><Image className='admin-product-pic' src={product.img[0] === '' ? '/assets/product/demo-product.png' : product.img[0]} alt='product' /></td>
                                        <td className='admin-product-price'>${product.price || 'Not Available'}</td>
                                        {product.stock === 'In stock' ? (
                                            <td className='text-success admin-product-stock'>{product.stock || 'Not Available'}</td>) :
                                            (<td className='text-danger admin-product-stock'>{product.stock || 'Not Available'}</td>)
                                        }
                                        <td>{product.stock_quantity || 'Not Available'}</td>
                                        <td className='admin-product-rating'>{setRating(4)}</td>
                                        <td className='d-flex justify-content-evenly'>
                                            <div className='my-2'>
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

export default CategoryWiseProducts