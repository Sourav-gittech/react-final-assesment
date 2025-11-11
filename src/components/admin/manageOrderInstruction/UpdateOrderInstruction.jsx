import React, { useEffect, useState } from 'react'
import { Button, Container, Form, InputGroup } from 'react-bootstrap'
import { useForm } from 'react-hook-form'
import axiosInstance from '../../../api/axiosInstance/axiosInstance';
import { endPoint_instruction } from '../../../api/api_url/apiUrl';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { GrUpdate } from 'react-icons/gr';

const UpdateOrderInstruction = () => {

  const { register, handleSubmit, formState, reset } = useForm();
  const { errors } = formState;
  const [instruction, setInstruction] = useState({}),
    navigator = useNavigate();

  const getInstructions = () => {
    axiosInstance.get(endPoint_instruction)
      .then(res => {
        const instructionObj = {
          id: res.data.id,
          min_order_amount: res.data.min_order_amount,
          free_delivery_min_order_amount: res.data.min_free_delivery_order_amount,
          delivery_fee: res.data.delivery_charge
        }
        setInstruction({ ...res.data });
        reset({ ...instructionObj });
      }
      )
      .catch(err => console.log(err));
  }

  const updateInstructions = (data) => {
    const instructionURL = endPoint_instruction + '/' + instruction.id;
    // console.log(instructionURL);
    
    const newInstructionObj = {
      min_order_amount: data.min_order_amount,
      min_free_delivery_order_amount: data.free_delivery_min_order_amount,
      delivery_charge: data.delivery_fee
    }
    // console.log(newInstructionObj);
    
    axiosInstance.put(endPoint_instruction, newInstructionObj)
      .then(res => {
        if (res.status === 200) {
          toast.success("Instruction Updated Successfully");
          navigator('/instructions');
        }
        else {
          toast.error("Something went wrong!");
        }
      })
      .catch(err => {
        console.log('Error occured ', err);
      });
  }

  useEffect(() => {
    getInstructions();
  }, []);

  return (
    <Container className='d-flex flex-column align-items-center my-3 maintain_gap'>
      <h2 className="text-center mt-5">Update Order Instruction</h2>

      <Form className='mt-4 form-50' onSubmit={handleSubmit(updateInstructions)}>

        {/* Minimum Order Amount  */}
        <Form.Group className="mb-3" controlId="formBasicMinOrderAmount">
          <Form.Label>Minimum Order Amount</Form.Label>
          <InputGroup>
            <InputGroup.Text id="basic-addon1">$</InputGroup.Text>
            <Form.Control type='text' aria-describedby="basic-addon1" {...register('min_order_amount', {
              required: {
                value: true,
                message: 'Required*'
              },
              pattern: {
                value: /^[0-9]+(\.[0-9]+)?$/,
                message: 'Invalid price'
              }
            })} placeholder="Enter minimum order amount" />
          </InputGroup>
          <p className="input-error">{errors.min_order_amount?.message}</p>
        </Form.Group>

        {/* Free Delivery Order Amount  */}
        <Form.Group className="mb-3" controlId="formBasicNewPwd">
          <Form.Label>For Free Delivery Minimum Order Amount</Form.Label>
          <InputGroup>
            <InputGroup.Text id="basic-addon2">$</InputGroup.Text>
            <Form.Control type='text' aria-describedby="basic-addon2" {...register('free_delivery_min_order_amount', {
              required: {
                value: true,
                message: 'Required*'
              },
              pattern: {
                value: /^[0-9]+(\.[0-9]+)?$/,
                message: 'Invalid price'
              }
            })} placeholder="Enter minimum order amount for free delivery" />
          </InputGroup>
          <p className="input-error">{errors.free_delivery_min_order_amount?.message}</p>
        </Form.Group>

        {/* Delivery Fee  */}
        <Form.Group className="mb-3" controlId="formBasicOldPwd">
          <Form.Label>Delivery Charge Amount</Form.Label>
          <InputGroup>
            <InputGroup.Text id="basic-addon3">$</InputGroup.Text>
            <Form.Control type='text' aria-describedby="basic-addon3" {...register('delivery_fee', {
              required: {
                value: true,
                message: 'Required*'
              },
              pattern: {
                value: /^[0-9]+(\.[0-9]+)?$/,
                message: 'Invalid price'
              }
            })} placeholder="Enter delivery fee" />
          </InputGroup>
          <p className="input-error">{errors.delivery_fee?.message}</p>
        </Form.Group>

        <div className="text-center">
          <Button variant="outline-success" type="submit" className='bg-btn'><GrUpdate className='icon' /> Update Instruction</Button>
        </div>
      </Form>
    </Container>
  )
}

export default UpdateOrderInstruction