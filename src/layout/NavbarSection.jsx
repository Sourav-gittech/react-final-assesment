import React from 'react'
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { NavLink } from 'react-router-dom';
import { AiFillProduct, AiOutlineProduct } from 'react-icons/ai';
import { BiSolidCategory } from 'react-icons/bi';
import { FaHome, FaUserAlt, FaUserCheck, FaUserPlus, FaUsersCog, FaUserShield } from 'react-icons/fa';
import { GiShoppingCart } from 'react-icons/gi';
import { IoIosBasket } from 'react-icons/io';
import { MdOutlineCategory } from 'react-icons/md';
import { FaChalkboardUser } from 'react-icons/fa6';

const NavbarSection = () => {
    return (
        <Navbar collapseOnSelect fixed='top' expand="lg" className="bg-body-tertiary py-3">
            <Container>
                <Navbar.Brand><GiShoppingCart /> E-commerce</Navbar.Brand>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className="mx-auto">
                        <Nav.Link as={NavLink} to="/"><FaHome className='icon' /> Home</Nav.Link>
                        <Nav.Link as={NavLink} to="/products"><AiFillProduct className='icon' /> Products</Nav.Link>
                    </Nav>
                    <Nav>
                        <NavDropdown title={<>
                            <FaUserAlt className="icon" /> User
                        </>} id="collapsible-nav-dropdown" className='user-dropdown'>
                            <NavDropdown.Item as={NavLink} to="/signup/user"><FaUserPlus className='icon' /> Register</NavDropdown.Item>
                            <NavDropdown.Item as={NavLink} to="/login"><FaUserCheck className='icon' /> Login</NavDropdown.Item>
                            <NavDropdown.Divider />
                            <NavDropdown.Item as={NavLink} to="/profile"><FaChalkboardUser className='icon' /> Profile</NavDropdown.Item>
                            <NavDropdown.Item as={NavLink} to="/cart"><IoIosBasket className='icon' /> Cart</NavDropdown.Item>
                        </NavDropdown>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}

export default NavbarSection