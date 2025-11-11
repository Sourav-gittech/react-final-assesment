import React, { useEffect, useState } from 'react'
import { Col, Container, Image, InputGroup, Row } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useForm } from 'react-hook-form';
import { TbCategoryPlus } from 'react-icons/tb';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axiosInstance from '../../../api/axiosInstance/axiosInstance';
import { endPoint_Category, endPoint_Product } from '../../../api/api_url/apiUrl';
import getBase64Promise from '../../../common-function/ConvertBase64';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';

const ProductForm = (props) => {

  let { action } = props;
  // console.log(action);

  let { product_id } = useParams();

  const [category, setCategory] = useState([]),
    [product, setProduct] = useState([]),
    [productDetails, setProductDetails] = useState({}),
    navigate = useNavigate();

  const form = useForm();
  const { register, handleSubmit, formState, reset } = form;
  const { errors } = formState;

  // To get all category 
  const getAllCategory = async () => {
    try {
      await axiosInstance.get(endPoint_Category)
        .then(res => setCategory([...res.data]))
        .catch(err => console.log('Error occured', err));
    }
    catch (err) {
      console.log('Error occured', err);
    }
  }

  // Return endpoint URL for product 
  const specificProductEndPoint = (prd_id) => {
    return endPoint_Product + '/' + prd_id;
  }

  // Fetch specific product 
  const getSpecificProduct = () => {

    axiosInstance.get(specificProductEndPoint(product_id))
      .then(res => {
        let defaultValue = {
          p_name: res.data.name,
          brand: res.data.brand,
          category: res.data.category_id,
          p_price: res.data.price,
          quantity: res.data.stock_quantity,
          discount: res.data.discount,
          min_ship_quantity: res.data.min_quantity,
          max_ship_quantity:res.data.max_quantity,
          ship_days: res.data.shipping_details.split(' ')[2],
          p_des: res.data.description,
        }
        setProductDetails({ ...res.data });
        reset({ ...defaultValue });
      })
      .catch(err => console.log('Error occured', err));
  }

  // To get all products 
  const getAllProduct = () => {
    axiosInstance.get(endPoint_Product)
      .then(res => {
        // console.log(res.data);
        setProduct([...res.data]);
      })
      .catch(err => console.log('Error occured', err));
  }

  useEffect(() => {
    getAllCategory();
    getAllProduct();
    action === 'edit' ? getSpecificProduct() : null;
  }, []);

  // Set multiple Product Img 
  const productImg = async (imgArr) => {
    try {
      // console.log(Object.keys(imgArr).length);
      let product_img_arr = [];

      for (let i = 0; i < Object.keys(imgArr).length; i++) {
        product_img_arr.push(await getBase64Promise(imgArr[i]));
      }
      return product_img_arr;
    }
    catch (err) {
      console.log('Error occured ', err);
    }
  }

  const handleProduct = async (data) => {
    try {
      // console.log(data);

      let shipping_days = "Shipping within " + data.ship_days + (data.ship_days > 1 ? ' days' : ' day');
      let productDiscount = data.discount == '' ? 0 : data.discount;

      let product_data = {
        name: action === 'edit' ? productDetails.name : data.p_name,
        brand: data.brand,
        price: data.p_price,
        discount: productDiscount,
        category_id: data.category,
        img: data.p_image.length > 0 ? await productImg(data.p_image) : productDetails.img,
        description: data.p_des,
        shipping_details: shipping_days,
        stock: "In stock",
        stock_quantity: data.quantity,
        min_quantity: data.min_ship_quantity,
        max_quantity:data.max_ship_quantity
      }
      // console.log(product_data);

      let checkProduct = action === 'edit' ? [] : product.filter(prd => prd.name.toLowerCase() === product_data.name.toLowerCase());

      if (checkProduct.length > 0) {
        Swal.fire("Oops...", "Product already exist", "info");
      }

      else if (Number.parseInt(product_data.stock_quantity) < Number.parseInt(product_data.min_quantity)) {
        Swal.fire("Oops...", "Total product quantity should be greater than minimum order quantity", "info");
      }

      else if (Number.parseInt(product_data.min_quantity) > Number.parseInt(product_data.max_quantity)) {
        Swal.fire("Oops...", "Minimum order quantity should be less than maximum order quantity", "info");
      }

      else {
        (action === 'add' ?
          axiosInstance.post(endPoint_Product, product_data) :
          axiosInstance.put(specificProductEndPoint(product_id), product_data))
          .then(res => {
            // console.log(res.status);

            if ((action === 'add' && res.status === 201) || (action === 'edit' && res.status === 200)) {
              toast.success(action === 'add' ? "Product Added Successfully" : "Product Updated Successfully");

              document.getElementById('product-form').reset();
              navigate('/all_products');
            }
            else {
              toast.error("Something went wrong!");
            }
          })
          .catch(err => {
            console.log('Error occured ', err);
          });
      }
    }
    catch (err) {
      console.log('Error occured ', err);
    }
  }

  // console.log(category.length)

  if (category.length < 0) {
    return (
      <Container className='mt-5'>
        <h3 className="text-center">Loading...</h3>
      </Container>
    )
  }

  else if (category.length == 0) {
    return (
      <Container className='d-flex flex-column align-items-center form-50 mt-5'>
        <h2>Oops...</h2>
        <h5 className='my-3'>No Category Found</h5>
        <Image className='no-cat-img' src='/assets/category/category.gif' alt='#cat' />
        <Button variant='outline-success' className='my-3' as={Link} to='/add_category'>Add Category</Button>
      </Container>
    )
  }

  return (
    <Container className='d-flex flex-column align-items-center mt-5'>
      <h2>{action === 'edit' ? 'Update' : 'Add'} Product</h2>

      <Form className='mt-3 form-50' id='product-form' onSubmit={handleSubmit(handleProduct)}>

        {/* Product name  */}
        <Form.Group className="mb-3" controlId="formBasicName">
          <Form.Label>Product name</Form.Label>
          <Form.Control type="text" {...register('p_name', {
            required: {
              value: true,
              message: 'Required*'
            }
          })} placeholder="Enter name" readOnly={action === 'edit'} />
          <p className="input-error">{errors.p_name?.message}</p>
        </Form.Group>

        {/* Product brand  */}
        <Form.Group className="mb-3" controlId="formGridBrand">
          <Form.Label>Brand</Form.Label>
          <Form.Control type="text" {...register('brand', {
            required: {
              value: true,
              message: 'Required*'
            }
          })} placeholder="Enter brand name" />
          <p className="input-error">{errors.brand?.message}</p>
        </Form.Group>

        <Row className="mb-3">
          {/* Product category  */}
          <Form.Group as={Col} controlId="formGridCategory">
            <Form.Label>Category</Form.Label>
            <Form.Select {...register('category', {
              required: {
                value: true,
                message: 'Required*'
              }
            })} defaultValue="Choose...">
              <option value=''>Choose...</option>
              {category.map(cat => (
                <option key={cat.id} value={cat.id}>
                  {cat.title}
                </option>
              ))}
            </Form.Select>
            <p className="input-error">{errors.category?.message}</p>
          </Form.Group>

          {/* Product price  */}
          <Form.Group as={Col} controlId="formGridPrice">
            <Form.Label>Price</Form.Label>
            <InputGroup>
              <InputGroup.Text id="basic-addon1">$</InputGroup.Text>
              <Form.Control type='text' aria-describedby="basic-addon1" {...register('p_price', {
                required: {
                  value: true,
                  message: 'Required*'
                },
                pattern: {
                  value: /^[0-9]+(\.[0-9]+)?$/,
                  message: 'Invalid price'
                }
              })} placeholder="Enter Price" />
            </InputGroup>
            <p className="input-error">{errors.p_price?.message}</p>
          </Form.Group>
        </Row>

        <Row className="mb-3">
          {/* Product quantity  */}
          <Form.Group as={Col} controlId="formGridQuantity">
            <Form.Label>Quantity</Form.Label>
            <Form.Control type='number' {...register('quantity', {
              required: {
                value: true,
                message: 'Required*'
              },
              pattern: {
                value: /^[1-9][0-9]*$/,
                message: 'Invalid quantity'
              }
            })} placeholder='Enter quantity' />
            <p className="input-error">{errors.quantity?.message}</p>
          </Form.Group>

          {/* Product discount  */}
          <Form.Group as={Col} controlId="formGridDiscount">
            <Form.Label>Available Discount</Form.Label>
            <InputGroup>
              <Form.Control type="text" aria-describedby="basic-addon2" {...register('discount', {
                pattern: {
                  value: /^[0-9]+(\.[0-9]+)?$/,
                  message: 'Invalid quantity'
                }
              })} placeholder="Enter discount (if available)" />
              <InputGroup.Text id="basic-addon2">%</InputGroup.Text>
            </InputGroup>
            <p className="input-error">{errors.discount?.message}</p>
          </Form.Group>
        </Row>

        <Row className="mb-3">
          {/* Product min-quantity  */}
          <Form.Group as={Col} controlId="formGridMinQuantity">
            <Form.Label>Minimum shipping quantity</Form.Label>
            <Form.Control type="number" {...register('min_ship_quantity', {
              required: {
                value: true,
                message: 'Required*'
              },
              pattern: {
                value: /^[1-9][0-9]*$/,
                message: 'Invalid quantity'
              }
            })} placeholder="Min quantity" />
            <p className="input-error">{errors.min_ship_quantity?.message}</p>
          </Form.Group>

          {/* Product max-quantity  */}
          <Form.Group as={Col} controlId="formGridMaxQuantity">
            <Form.Label>Maximum shipping quantity</Form.Label>
            <Form.Control type="number" {...register('max_ship_quantity', {
              required: {
                value: true,
                message: 'Required*'
              },
              pattern: {
                value: /^[1-9][0-9]*$/,
                message: 'Invalid quantity'
              }
            })} placeholder="Max quantity" />
            <p className="input-error">{errors.max_ship_quantity?.message}</p>
          </Form.Group>
        </Row>

        {/* Product shopping  */}
        <Form.Group className='mb-3' controlId="formGridShipping">
          <Form.Label>Shipping Details</Form.Label>
          <InputGroup>
            <InputGroup.Text>Shipping within</InputGroup.Text>
            <Form.Control type='number' {...register('ship_days', {
              required: {
                value: true,
                message: 'Required*'
              },
              pattern: {
                value: /^[1-9][0-9]*$/,
                message: 'Invalid quantity'
              }
            })} placeholder='Enter no of days...' />
            <InputGroup.Text>days</InputGroup.Text>
          </InputGroup>
          <p className="input-error">{errors.ship_days?.message}</p>
        </Form.Group>

        {/* Product image  */}
        <Form.Group className="mb-3" controlId="formBasicImage">
          <Form.Label>Product Image</Form.Label>
          <Form.Control type="file" {...register('p_image', {
            required: (action !== 'edit') ? {
              value: true,
              message: 'Required*'
            } : false
          })} placeholder="Select Image" accept='Image/*' multiple />
          <p className="input-error">{errors.p_image?.message}</p>
        </Form.Group>

        {/* category description  */}
        <Form.Group className="mb-3" controlId="formBasicDescription">
          <Form.Label>Description</Form.Label>
          <Form.Control as="textarea" rows={3} {...register('p_des', {
            required: {
              value: true,
              message: 'Required*'
            },
            pattern: {
              value: /^.{350,400}$/,
              message: 'Description should be between 350 and 400 characters'
            }
          })} placeholder='Type here...' />
          <p className="input-error">{errors.p_des?.message}</p>
        </Form.Group>

        <div className="text-center">
          <Button variant="outline-success" type="submit" className='small-btn'><TbCategoryPlus className='icon' /> {action === 'edit' ? 'Update' : 'Submit'}</Button>
        </div>
      </Form>
    </Container>
  )
}

export default ProductForm