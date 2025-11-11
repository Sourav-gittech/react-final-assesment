import React, { useEffect, useState } from 'react'
import { Button, Col, Container, Image, Row } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import axiosInstance from '../../../api/axiosInstance/axiosInstance'
import { endPoint_instruction } from '../../../api/api_url/apiUrl'
import { BiEdit } from 'react-icons/bi'
import { IoArrowBackSharp } from 'react-icons/io5'

const OrderInstruction = () => {

  const [instruction,setInstruction] = useState({});

  const getAllInstruction = ()=>{
    axiosInstance.get(endPoint_instruction)
    .then(res=>setInstruction(res.data))
    .catch(err=>console.log(err));
  }

  useEffect(()=>{
    getAllInstruction();
  },[]);

  return (
    <div className='maintain_gap'>
      <h3 className="text-center mt-5">Order Instruction</h3>

      <Container className='d-flex align-items-center justify-content-center mt-5'>
        <div className="instruction-box px-2">

          <Row className='d-flex align-items-center'>
            <Col md={5} sm={12} className='p-5 bg-primary ins-img'>
              <Image className='object-fit-cover' src='/assets/instruction/instruction.gif' alt='#instruction' />
            </Col>

            <Col md={7} sm={12} className='d-flex flex-column p-5'>
              <p><span className='p-title'>Minimum Order Amount : $</span>{instruction.min_order_amount ||`Not available`}</p>
              <p><span className='p-title'>Delivery Charge : $</span>{instruction.delivery_charge ||`Not available`}</p>
              <p><span className='p-title'>Free Delivery from : $</span>{instruction.min_free_delivery_order_amount ||`Not available`}</p>

              <div className="text-center">
                <Button variant='outline-success' className='bg-btn m-1' as={Link} to='/profile'><IoArrowBackSharp className='icon' /> Back To Profile</Button>
                <Button variant='outline-warning' className='bg-btn m-1' as={Link} to='/instructions/update'><BiEdit className='icon' /> Edit Instruction</Button>
              </div>
            </Col>

          </Row>
        </div>
      </Container>
    </div >
  )
}

export default OrderInstruction