import React, { useState } from 'react';
import { Container, Nav, Navbar, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import './Navbar.css';


import ThemeToggle from '../theme/ThemeToggle';
import instance from '../../axios';




const AdminNavbar = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

 
  const handleLogout = async () => {
    try {
    
      const response = await instance.post('/api/v1/seller/logout', {}, { withCredentials: true });

      if (response.data.success) {
      
        localStorage.removeItem('sellerToken');
        localStorage.removeItem('seller');
       
        Cookies.remove('token');
        
        setIsAuthenticated(false);
        
        navigate('/');
      } else {
        console.error('Logout failed:', response.data.message);
      }
    } catch (error) {
      console.error('Logout request failed:', error);
    }
  };



  return (
    <Navbar expand="lg" className="bg-dark navbar-dark">
      <Container>
        <Navbar.Brand as={Link} to="/">Shopytrends</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ml-auto">
            <Nav.Link as={Link} to="/admin/userview" className="text-white">User</Nav.Link>
            <Nav.Link as={Link} to="/admin/sellerview" className="text-white">Seller</Nav.Link>
            <Nav.Link as={Link} to="/admin/selleritemview" className="text-white">Seller Product</Nav.Link>
            <Nav.Link as={Link} to="/admin/orderview" className="text-white">User Order View</Nav.Link>
            <div className='flex justify-center items-center lg:space-x-4 space-x-0 h-full'>
            <Button
              onClick={handleLogout}
              className="ml-3 text-white bg-green-600 hover:bg-green-700 font-semibold py-2 px-4 rounded"
            >
              Logout
            </Button>
            <ThemeToggle className="ml-3 " />

            </div>
           
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default AdminNavbar;
