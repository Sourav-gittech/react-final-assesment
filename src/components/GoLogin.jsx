import React from 'react'
import { Button, Card, Col, Container, Row } from 'react-bootstrap'
import { Link } from 'react-router-dom'

const GoLogin = () => {
    return (
        <div className='maintain_gap mt-5'>
            <Container>
                <Row className='d-flex align-items-center justify-content-center'>
                    <Col md={6} sm={12}>
                    <Card>
                            <Card.Img variant="top" src='/assets/gologin/gologin.gif' alt='#gologin' className='cart-product-img' />
                            <Card.Body>
                                <Card.Title className="fw-bold text-center fs-3">
                                    Oops...
                                </Card.Title>
                                <Card.Text className='my-1 text-center'>You have to login first</Card.Text>
                                <div className='text-center my-3'>
                                    <Button variant='outline-success' className='big-btn' as={Link} to='/login' >Go To Login</Button>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    )
}

export default GoLogin