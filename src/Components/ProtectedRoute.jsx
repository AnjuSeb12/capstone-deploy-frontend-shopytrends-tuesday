import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ element, ...rest }) => {
    const token = localStorage.getItem('userToken'); // Replace with your authentication logic

    return token ? element : <Navigate to="/user/signin" replace />;
};

export default ProtectedRoute;
