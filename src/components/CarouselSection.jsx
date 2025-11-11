import React from 'react'
import { Carousel } from 'react-bootstrap'

const CarouselSection = () => {

    const img_arr = [
        { id: 1, src: 'assets/banner/banner1.jpg', alt: 'First slide' },
        { id: 2, src: 'assets/banner/banner2.jpg', alt: 'Second slide' },
        { id: 3, src: 'assets/banner/banner3.jpg', alt: 'Third slide' },
        { id: 4, src: 'assets/banner/banner4.jpg', alt: 'Fourth slide' },
        { id: 5, src: 'assets/banner/banner5.jpg', alt: 'Fifth slide' },
        { id: 6, src: 'assets/banner/banner6.jpg', alt: 'Sixth slide' },
    ];

    return (
        <Carousel data-bs-theme="dark">
            {
                img_arr.map(details => (
                    <Carousel.Item key={details.id}>
                        <img className="d-block w-100" src={details.src} alt={details.alt} />
                    </Carousel.Item>
                ))
            }
        </Carousel>
    )
}

export default CarouselSection