import React, { useEffect, useState } from 'react'
import { Button, Container, Form, Image, InputGroup } from 'react-bootstrap';
import Table from 'react-bootstrap/Table';
import { FaEye, FaPencilAlt, FaTrashAlt } from 'react-icons/fa';
import { IoAddCircleSharp } from 'react-icons/io5';
import { Link } from 'react-router-dom';
import Modal from 'react-bootstrap/Modal';
import { RxCross1 } from 'react-icons/rx';
import axiosInstance from '../../../api/axiosInstance/axiosInstance';
import { endPoint_Category, endPoint_Product } from '../../../api/api_url/apiUrl';
import Swal from 'sweetalert2';
import { TfiLayoutListThumb } from 'react-icons/tfi';
import { toast } from 'react-toastify';

const AllCategory = () => {

  const [show, setShow] = useState(false),
    [category, setCategory] = useState([]),
    [specificCategory, setSpecificCategory] = useState({}),
    [searchText, setSearchText] = useState(''),
    [products, setProducts] = useState([]);

  let count = 1;

  const handleClose = () => setShow(false);

  // To get all products 
  const showAllProducts = () => {
    axiosInstance.get(endPoint_Product)
      .then(res => {
        // console.log(res.data);
        setProducts([...res.data]);
      })
      .catch(err => console.log('Error occured ', err));
  }

  // To get specific product id
  const getProductId = (cat_id) => {
    let categoryWiseProduct = products.filter(product => product.category_id == cat_id);
    return categoryWiseProduct;
  }

  // To show specific category details 
  const handleShow = (cat_id) => {
    const specificCategoryEndPoint = endPoint_Category + '/' + cat_id;

    axiosInstance.get(specificCategoryEndPoint)
      .then(res => {
        // console.log(res.data);
        let showData = {
          title: res.data.title,
          img: res.data.img != '' ? res.data.img : 'assets/category/category_demo.png',
          description: res.data.description
        }
        setSpecificCategory({ ...showData });
      })
      .catch(err => console.log(err));

    setShow(true);
  }

  // To get all category 
  const getAllCategory = () => {
    axiosInstance.get(endPoint_Category)
      .then(res => {
        // console.log(res.data);
        setCategory([...res.data]);
      })
      .catch(err => console.log('Error occured', err));
  }

  useEffect(() => {
    getAllCategory();
    showAllProducts();
  }, [setCategory, setCategory]);

  // To sort by category
  const showSortingData = (event) => {
    // console.log(event.target.value);
    if (event.target.value === 'assending') {
      let assendingOrderWiseCategory = category.sort((a, b) => a.title.localeCompare(b.title));
      setCategory([...assendingOrderWiseCategory]);
    }
    if (event.target.value === 'decending') {
      let decendingOrderWiseCategory = category.sort((a, b) => b.title.localeCompare(a.title));
      setCategory([...decendingOrderWiseCategory]);
    }
  }

  // To delete a sepcific category 
  const deleteCategory = (cat_id) => {
    // console.log(getProductId(cat_id));
    Swal.fire({
      title: "Are you sure to delete?",
      showDenyButton: true,
      confirmButtonText: "Yes",
      denyButtonText: `No`
    })
      .then((result) => {
        if (result.isConfirmed) {
          const specificCategoryEndPoint = endPoint_Category + '/' + cat_id;
          axiosInstance.delete(specificCategoryEndPoint)
            .then(res => {
              // console.log(res);    
              if (res.status === 200) {

                // delete related products of the category 
                getProductId(cat_id).forEach(product => {
                  const specificProductURL = endPoint_Product + '/' + product.id;
                  axiosInstance.delete(specificProductURL)
                    .catch(err => console.log('Error occured ', err));
                })
                toast.success("Category Deleted Successfully");
              }
              else {
                toast.error("Something went wrong!");
              }
              getAllCategory();
            })
            .catch(err => console.log(err));
        }
      });
  }


  if (category.length < 0) {
    return (
      <div className='text-center maintain_gap'>
        <h2 className='my-3'>Category loading...</h2>
      </div>
    )
  }

  return (
    <div className='text-center maintain_gap'>
      <h2 className='my-3'>All Categories</h2>

      <Button variant='success' className='big-btn' as={Link} to='/add_category'><IoAddCircleSharp className='icon' /> Add Category</Button>

      <Container className='mt-3'>

        <div className="searching-sorting d-flex flex-column flex-md-row justify-content-between">

          {/* search bar  */}
          <Form className='search-bar mb-2'>
            <InputGroup className="mb-0">
              <InputGroup.Text id="basic-addon1">Search</InputGroup.Text>
              <Form.Control placeholder="Type category here..." aria-label="search" aria-describedby="basic-addon1" onChange={(event) => setSearchText(event.target.value)} />
            </InputGroup>
          </Form>

          {/* sorting bar  */}
          <Form.Select aria-label="Default select example" className='sort-dropdown mb-2' onChange={showSortingData}>
            <option>Sorted By</option>
            <option value="assending">A-Z</option>
            <option value="decending">Z-A</option>
          </Form.Select>
        </div>

        <Table striped bordered hover variant="dark" className="table text-center align-middle">
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Description</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {category.filter(cat => {
              if (searchText === '') {
                return category;
              }
              if (cat.title.toLowerCase().includes(searchText.toLowerCase())) {
                return cat;
              }
            })
              .map(cat => (
                <tr key={cat.id}>
                  <td>{count++}.</td>
                  <td>{cat.title || 'Not Available'}</td>
                  <td className='category-desc'>{cat.description || 'Not Available'}</td>
                  <td className='d-flex justify-content-evenly'>
                    <div>
                      <Button variant='outline-info' className='small-btn m-1' as={Link} to={`/edit_category/${cat.id}`}><FaPencilAlt className='icon' /> Edit</Button>
                      <Button variant='outline-primary' className='small-btn m-1' onClick={() => handleShow(cat.id)}><FaEye className='icon' /> View</Button>
                      <Button variant='outline-secondary' className='small-btn m-1' as={Link} to={`${cat.id}`}><TfiLayoutListThumb className='icon' /> Product</Button>
                      <Button variant='outline-danger m-1' className='small-btn' onClick={() => deleteCategory(cat.id)}><FaTrashAlt className='icon' /> Delete</Button>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </Table>
      </Container>

      {/* view modal  */}
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{specificCategory.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="text-center">
            <Image className='object-fit-cover rounded-circle category-details-img' src={specificCategory.img} alt='cat-img' />
          </div>
          <h6 className='mt-3'>Description</h6>
          <p className='text-small'>{specificCategory.description}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}><RxCross1 className='icon' /> Close</Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}

export default AllCategory