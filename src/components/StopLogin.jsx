import React from 'react'
import { Card, Col, Container, Row } from 'react-bootstrap'

const StopLogin = () => {
    return (
        <div className='maintain_gap mt-3'>
            <Container>
                <Row className='d-flex align-items-center justify-content-center'>
                    <Col md={6} sm={12}>
                        <Card className='d-flex align-items-center'>
                            <Card.Img variant="top" src='/assets/stoplogin/stop-login.png' style={{ height: '430px',width:'430px' }} alt='#stoplogin' className='cart-product-img' />
                            <Card.Body>
                                <Card.Title className="fw-bold text-center fs-3">
                                    Oops...
                                </Card.Title>
                                <Card.Text className='my-1 text-center'>You can't access as you logged in</Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    )
}

export default StopLogin