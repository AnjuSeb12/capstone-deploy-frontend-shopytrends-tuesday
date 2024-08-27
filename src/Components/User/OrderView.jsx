

import React, { useEffect, useState } from 'react';

import { Button } from 'react-bootstrap';
import instance from '../../axios';


const OrderView = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await instance.get('/api/v1/orders/orderuser', {
          withCredentials: true,
        });

        const filteredOrders = response.data.orders.filter(order => order.paymentStatus !== 'Deleted');
        setOrders(filteredOrders);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };
    fetchOrders();
  }, []);

  const handleCancelOrder = async (orderId) => {
    try {
      const response = await instance.post(`/api/v1/orders/ordercancel/${orderId}`, {}, {
        withCredentials: true,
      });

      if (response.status === 200) {
        setOrders(orders.map(order => 
          order._id === orderId ? { ...order, paymentStatus: 'Canceled' } : order
        ));
      }
      window.location.reload();
    } catch (error) {
      console.error('Error canceling order:', error);
    }
  };

  const handleDeleteOrder = async (orderId) => {
    try {
      await instance.delete(`/api/v1/orders/order/${orderId}`, {
        withCredentials: true,
      });

      setOrders(orders.filter(order => order._id !== orderId));
    } catch (error) {
      console.error('Error deleting order:', error);
    }
  };

  return (
    <div className="container mt-4">
      <h2>Your Orders</h2>
      {orders.length > 0 ? (
        <div className="order-list">
          {orders.map(order => (
            <div key={order._id} className="order-item border p-3 mb-3">
              {order.orderItems.map((item, index) => (
                <div key={index} className="order-item-details">
                  <img src={item.image} alt={item.title} className="img-fluid" style={{ maxWidth: '100px' }} />
                  <h4>{item.title}</h4>
                  <p>Price: ₹{item.price}</p>
                  <p>Quantity: {item.quantity}</p>
                </div>
              ))}
              <p>Status: {order.paymentStatus}</p>
              <p>Shipping Address: {order.shippingAddress.address}, {order.shippingAddress.city}, {order.shippingAddress.postalCode}, {order.shippingAddress.country}</p>
              {order.paymentStatus !== 'Delivered' && order.paymentStatus !== 'Canceled' && (
                <Button variant="danger" onClick={() => handleCancelOrder(order._id)}>Cancel Order</Button>
              )}
              {order.paymentStatus === 'Canceled' && (
                <Button variant="secondary" onClick={() => handleDeleteOrder(order._id)} className="ml-2">Delete Order</Button>
              )}
              {order.paymentStatus === 'Delivered' && (
                <Button variant="secondary" onClick={() => handleDeleteOrder(order._id)} className="ml-2">Delete Order</Button>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p>You have no orders.</p>
      )}
    </div>
  );
};

export default OrderView;



