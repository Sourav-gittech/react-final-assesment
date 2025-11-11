import React from 'react'
import { Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'

const Error_404 = () => {
  return (
    <div className='text-center maintain_gap'>
      <h2 className='mt-3'>Oops...</h2>
      <h5 className="my-4">Page Not Found!</h5>
      <Button variant='success' className='big-btn' as={Link} to='/'>Go To Home Page</Button>
    </div>
  )
}

export default Error_404