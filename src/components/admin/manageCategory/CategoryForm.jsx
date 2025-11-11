import React, { useEffect, useState } from 'react'
import { Container } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useForm } from 'react-hook-form';
import { TbCategoryPlus } from 'react-icons/tb';
import axiosInstance from '../../../api/axiosInstance/axiosInstance';
import { endPoint_Category } from '../../../api/api_url/apiUrl';
import Swal from 'sweetalert2';
import getBase64Promise from '../../../common-function/ConvertBase64';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

const CategoryForm = (props) => {
  const { action } = props,
    { category_id } = useParams();
  // console.log(action,category_id);

  const [category, setCategory] = useState([]),
    [specificCategory, setSpecificCategory] = useState({}),
    navigate = useNavigate();

  const form = useForm();
  const { register, handleSubmit, formState, reset } = form;
  const { errors } = formState;

  // Fetch all category 
  const getAllCategory = () => {
    axiosInstance.get(endPoint_Category)
      .then(res => setCategory([...res.data]))
      .catch(err => console.log('Error occured', err));
  }

  // Return endpoint URL for category 
  const specificCategoryEndPoint = (cat_id) => {
    return endPoint_Category + '/' + cat_id;
  }

  // Fetch specific category 
  const getSpecificCategory = () => {

    axiosInstance.get(specificCategoryEndPoint(category_id))
      .then(res => {
        let defaultValue = {
          cat_title: res.data.title,
          cat_description: res.data.description
        }
        setSpecificCategory({ ...res.data });
        reset({ ...defaultValue });
      })
      .catch(err => console.log('Error occured', err));
  }

  useEffect(() => {
    getAllCategory();
    action === 'edit' ? getSpecificCategory() : null;
  }, []);

  const handleCategory = async (data) => {

    try {
      const img = data.cat_img.length > 0 ? await getBase64Promise(data.cat_img[0]) : specificCategory.img;

      const category_data = {
        title: action === 'edit' ? specificCategory.title : data.cat_title,
        description: data.cat_description,
        img: img
      }

      let checkCategory = action === 'edit' ? [] : category.filter(cat => cat.title === data.cat_title);
      // console.log(checkCategory);

      if (checkCategory.length > 0) {
        Swal.fire("Oops...", "Category already exist", "info");
      }
      else {
        (action === 'add' ?
          axiosInstance.post(endPoint_Category, category_data) :
          axiosInstance.put(specificCategoryEndPoint(category_id), category_data))
          .then(res => {
            // console.log(res.status);
            
            if ((action === 'add' && res.status === 201) || (action === 'edit' && res.status === 200)) {
              toast.success(action === 'add' ? "Category Created Successfully" : "Category Updated Successfully");
              navigate('/all_category');
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

  return (
    <Container className='d-flex flex-column align-items-center mt-5'>
      <h2>{action === 'edit' ? 'Update' : 'Add'} Category</h2>

      <Form className='mt-3 form-50' id='cat-form' onSubmit={handleSubmit(handleCategory)}>
        {/* category title  */}
        <Form.Group className="mb-3" controlId="formBasicTitle">
          <Form.Label>Category Title</Form.Label>
          <Form.Control type="text" {...register('cat_title', {
            required: {
              value: true,
              message: 'Required*'
            }
          })} placeholder="Enter title" readOnly={action === 'edit'} />
          <p className="input-error">{errors.cat_title?.message}</p>
        </Form.Group>

        {/* category image  */}
        <Form.Group className="mb-3" controlId="formBasicImage">
          <Form.Label>Category Image</Form.Label>
          <Form.Control type="file" placeholder="Select Image" {...register('cat_img', {
            required: (action !== 'edit') ? {
              value: true,
              message: 'Required*'
            } : false
          })} accept='Image/*' />
          <p className="input-error">{errors.cat_img?.message}</p>
        </Form.Group>

        {/* category description  */}
        <Form.Group className="mb-3" controlId="formBasicDescription">
          <Form.Label>Description</Form.Label>
          <Form.Control as="textarea" rows={3} {...register('cat_description', {
            required: {
              value: true,
              message: 'Required*'
            },
            pattern: {
              value: /^.{250,300}$/,
              message: 'Description should between 250 and 300 characters'
            }
          })} placeholder='Type here...' />
          <p className="input-error">{errors.cat_description?.message}</p>
        </Form.Group>

        <div className="text-center">
          <Button variant="outline-success" type="submit" className='small-btn'><TbCategoryPlus className='icon' /> {action === 'edit' ? 'Update' : 'Submit'}</Button>
        </div>
      </Form>
    </Container>
  )
}

export default CategoryForm