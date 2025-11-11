import React, { useEffect, useState } from 'react'
import { Col, Container, Row, Button, Card, Form, InputGroup } from 'react-bootstrap'
import { AiFillProduct } from 'react-icons/ai'
import { Link } from 'react-router-dom'
import axiosInstance from '../../api/axiosInstance/axiosInstance'
import { endPoint_Category } from '../../api/api_url/apiUrl'

const Category = () => {

  const [category, setCategory] = useState([]),
    [searchText, setSearchText] = useState('');

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
  }, [setCategory]);

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

  if (category.length < 0) {
    return (
      <div className='text-center maintain_gap'>
        <h2 className='my-3'>Category loading...</h2>
      </div>
    )
  }

  return (
    <div className='maintain_gap'>
      <h2 className="text-center mt-3">All Categories</h2>
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
          </Form.Select>
        </div>
        <Row className='d-flex align-items-center justify-content-center'>

          {category.filter(cat => {
            if (searchText === '') {
              return category;
            }
            if (cat.title.toLowerCase().includes(searchText.toLowerCase())) {
              return cat;
            }
          })
            .map(cat => (
              <Col lg={3} md={4} sm={12} key={cat.id}>
                <Card className='mt-3 text-center'>
                  <Card.Img variant="top" className='category-img' src={cat.img} />
                  <Card.Body>
                    {cat.title.length > 12 ?
                      (<Card.Title>{cat.title.slice(0, 12)}...</Card.Title>) : (<Card.Title>{cat.title}</Card.Title>)
                    }
                    {cat.description.length > 100 ?
                      (<Card.Text>{cat.description.slice(0, 100)}...</Card.Text>) : (<Card.Text>{cat.description}</Card.Text>)
                    }
                    <Button variant="outline-primary" as={Link} to={`${cat.id}/product`}><AiFillProduct className='icon' /> View Products</Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
        </Row>
      </Container>
    </div>
  )
}

export default Category