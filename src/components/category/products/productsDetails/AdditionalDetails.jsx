import React from 'react'
import { Table } from 'react-bootstrap'

const AdditionalDetails = (props) => {

    let { category, shipping_details, stock, stock_quantity, min_order_quantity } = props;

    return (
        <Table>
            <tbody>
                <tr>
                    <td>Category</td>
                    <td>{category}</td>
                </tr>
                <tr>
                    <td>Shipping Details</td>
                    <td>{shipping_details}</td>
                </tr>
                <tr>
                    <td>stock</td>
                    {stock == 'In stock' ? (<td className='text-success'>{stock}</td>) : (<td className='text-danger'>{stock}</td>)}
                </tr>
                <tr>
                    <td>Stock Quantity</td>
                    <td>{stock_quantity}</td>
                </tr>
                <tr>
                    <td>Minimum Order Quantity</td>
                    <td>{min_order_quantity}</td>
                </tr>
            </tbody>
        </Table>
    )
}

export default AdditionalDetails