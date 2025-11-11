import React from 'react'
import CarouselSection from './CarouselSection'
import { Col, Container, Image, Row } from 'react-bootstrap'

const Home = () => {

  const brand_img = [
    { id: 1, src: '/assets/brand/brand1.jpg' },
    { id: 2, src: '/assets/brand/brand2.png' },
    { id: 3, src: '/assets/brand/brand3.png' },
    { id: 4, src: '/assets/brand/brand4.png' },
    { id: 5, src: '/assets/brand/brand5.png' },
    { id: 6, src: '/assets/brand/brand6.jpg' },
    { id: 7, src: '/assets/brand/brand7.png' },
    // { id: 8, src: '/assets/brand/brand8.png' }
  ]
  return (
    <div className='maintain_gap'>
      <CarouselSection />
      <h2 className='my-3 text-center'>Top Brands</h2>
      <Container>
        <Row className='text-center d-flex align-item-center justify-content-center'>
          {
            brand_img.map(img => (
              <Col lg={3} md={4} sm={6} key={img.id} className='mb-3'>
                <Image className='brand_img' src={img.src} alt='#brand-img' />
              </Col>
            ))
          }
        </Row>
      </Container>
    </div>
  )
}

export default Home