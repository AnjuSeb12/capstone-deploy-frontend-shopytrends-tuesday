import React, { useEffect, useState } from 'react';
import { Container, Nav, Navbar, Button, Form, InputGroup } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';

import { FiShoppingCart } from 'react-icons/fi';
import { toast } from 'react-toastify';
import ThemeToggle from '../theme/ThemeToggle';
import instance from '../../axios';

const HomeNavbar = () => {
  const navigate = useNavigate();
  const [cartCount, setCartCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    
    const userToken = localStorage.getItem('userToken');
    if (userToken) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }

  
    console.log(".....hometoken",userToken)

    const fetchCartCount = async () => {
      try {
        const response = await instance.get('/api/v1/cart/count', {
          withCredentials: true,
        });
        setCartCount(response.data.cartCount || 0);
      } catch (error) {
        console.error('Error fetching cart count:', error);
        setCartCount(0);
      }
    };
    fetchCartCount();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?query=${searchQuery}`);
    }
  };

  const handleLogout = async () => {
    try {
      const response = await instance.post('/api/v1/user/logout', {}, {
        withCredentials: true,
      });
      if (response.data.success) {
        localStorage.removeItem('userToken');
        localStorage.removeItem('user');
        setIsAuthenticated(false);
        setCartCount(0);
        navigate('/user/signin');
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error('Logout failed. Please try again.');
    }
  };

  return (
    <Navbar expand="lg" className="bg-dark navbar-dark">
      <Container>
        <Navbar.Brand as={Link} to="/">Shopytrends</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
            <Nav.Link as={Link} to="/">Home</Nav.Link>
            <Nav.Link as={Link} to="/sellerdashboard">Become a Seller</Nav.Link>
            {isAuthenticated && (
              <Nav.Link as={Link} to="/user/orders">Orders</Nav.Link>
            )}
          </Nav>
          <Form onSubmit={handleSearch} className="d-flex align-items-center mx-auto">
            <InputGroup>
              <Form.Control
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="mr-2"
              />
            </InputGroup>
          </Form>
          <Nav className="ml-auto align-items-center">
            <Nav.Link as={Link} to="/user/cart" className="position-relative mb-1 mt-2">
              <FiShoppingCart size={24} className="text-white" />
              {cartCount > 0 && (
                <span className="cart-count">{cartCount}</span>
              )}
            </Nav.Link>
            {isAuthenticated ? (
              <Button variant="outline-light" onClick={handleLogout} className='mb-1'>
                Logout
              </Button>
            ) : (
              <Nav.Link as={Link} to="/user/signin">
                <Button variant="outline-light">Sign In</Button>
              </Nav.Link>
            )}
            <ThemeToggle className="ml-3 mb-5" />
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default HomeNavbar;
