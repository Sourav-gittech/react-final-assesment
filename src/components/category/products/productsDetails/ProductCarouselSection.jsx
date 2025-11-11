import React from 'react'
import { Image } from 'react-bootstrap';
import Carousel from 'react-bootstrap/Carousel';

const ProductCarouselSection = (props) => {
  const { img_arr } = props;
  // console.log(img_arr);

  if (!img_arr) {
    return (
      <p className='text-center'>Loading...</p>
    )
  }
  return (
    <Carousel data-bs-theme="dark">
      {img_arr.map((img, index) => (
        <Carousel.Item key={index}>
          <Image className='product-carousel-img' src={img} alt="product slide" />
        </Carousel.Item>
      ))}
    </Carousel>
  )
}

export default ProductCarouselSection