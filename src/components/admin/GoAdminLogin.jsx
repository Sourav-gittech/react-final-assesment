import React from 'react'
import { Card, Col, Container, Row } from 'react-bootstrap'

const GoAdminLogin = () => {
    return (
        <div className='maintain_gap mt-5'>
            <Container>
                <Row className='d-flex align-items-center justify-content-center'>
                    <Col md={6} sm={12}>
                        <Card className='d-flex align-items-center'>
                            <Card.Img variant="top" src='/assets/gologin/goadminlogin.png' style={{ width: '300px' }} alt='#gologin' className='cart-product-img' />
                            <Card.Body>
                                <Card.Title className="fw-bold text-center fs-3">
                                    Alert
                                </Card.Title>
                                <Card.Text className='my-1 text-center'>Used by admin purpose only</Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    )
}

export default GoAdminLogin