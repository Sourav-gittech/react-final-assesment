import React, { useEffect, useState } from 'react'
import { Breadcrumb, Button, Col, Container, Image, Row, Table } from 'react-bootstrap'
import { Link, useParams } from 'react-router-dom'
import RequireDetails from './RequireDetails'
import AdditionalDetails from './AdditionalDetails'
import ReviewDetails from './ReviewDetails'
import { MdRateReview } from 'react-icons/md'
import axiosInstance from '../../../../api/axiosInstance/axiosInstance'
import { endPoint_Category, endPoint_Product, endPoint_Review, endPoint_User } from '../../../../api/api_url/apiUrl'
import ProductCarouselSection from './ProductCarouselSection'

const ProductsDetails = () => {

  const { category_id, product_id } = useParams();
  // console.log(category_id, product_id);

  const [product, setProduct] = useState({}),
    [users, setUsers] = useState([]),
    [category, setCategory] = useState({});

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

  // To get specific product 
  const showSpecificProduct = () => {
    const productURL = endPoint_Product + '/' + product_id;
    axiosInstance.get(productURL)
      .then(res => {
        // console.log(res.data);
        setProduct({ ...res.data });
      })
      .catch(err => console.log('Error occured ', err));
  }

  // To get specific category 
  const getSpecificCategory = () => {
    const categoryURL = endPoint_Category + '/' + category_id;
    axiosInstance.get(categoryURL)
      .then(res => {
        // console.log(res.data);
        setCategory({ ...res.data });
      })
      .catch(err => console.log('Error occured', err));
  }
    
  useEffect(() => {
    getAllUser();
    showSpecificProduct();
    getSpecificCategory();
  }, [setUsers, setProduct, setCategory]);

  if (Object.keys(product).length === 0) {
    return (
      <div className='maintain_gap'>
        <Container className='text-center mt-4'>
          <h3 className='my-3'>No Product Details Available...</h3>
          <Image src='/assets/product/product.png' alt='#product-details' />
        </Container>
      </div>
    )
  }

  return (
    <div className='maintain_gap'>
      <Container className='mt-4'>

        {/* breadcrumb  */}
        <Breadcrumb>
          <Breadcrumb.Item linkAs={Link} linkProps={{ to: '/' }}>Home</Breadcrumb.Item>
          {checkLoggedUser() ?
            (<Breadcrumb.Item linkAs={Link} linkProps={{ to: `/all_category/${category_id}` }}>Category</Breadcrumb.Item>) :
            (<Breadcrumb.Item linkAs={Link} linkProps={{ to: `/category/${category_id}/product` }}>Category</Breadcrumb.Item>)
          }
          <Breadcrumb.Item active>{product.name}</Breadcrumb.Item>
        </Breadcrumb>

        <Row className='d-flex align-items-center mt-4'>
          <Col lg={4} md={6} sm={12} className='text-center'>
            <ProductCarouselSection img_arr={product.img} />
          </Col>
          <Col lg={8} md={6} sm={12} className='mt-2'>
            <RequireDetails product_id={product_id} brand={product.brand} name={product.name} description={product.description} discount={product.discount} price={product.price} stock_quantity={product.stock_quantity} min_quantity={product.min_quantity} max_quantity={product.max_quantity} isAdmin={checkLoggedUser()} />
          </Col>
        </Row>

        <div className="additional-details mt-3">
          <h3>Additional Details:</h3>
          <Container>
            <AdditionalDetails category={category.title} shipping_details={product.shipping_details} stock={product.stock} stock_quantity={product.stock_quantity} min_order_quantity={product.min_quantity} />
          </Container>
        </div>

        <div className='product-review mt-3'>
          <h3>Reviews:</h3>
          {!checkLoggedUser() ?
            (<Button variant='outline-success' className='my-2' as={Link} to={`/review/${product_id}`}><MdRateReview className='icon' /> Add Review</Button>) : null}
          <Container>
            <ReviewDetails product_id={product.id} />
          </Container>
        </div>
      </Container>
    </div>
  )
}

export default ProductsDetails