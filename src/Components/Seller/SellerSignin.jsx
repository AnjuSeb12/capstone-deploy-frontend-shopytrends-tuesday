


import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import instance from '../../axios';

// Validation schema for the form
const schema = yup.object({
  email: yup.string().email('Invalid email address').required('Email is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
}).required();

const SellerSignin = () => {
  const navigate = useNavigate();

  // Check if a token is already in localStorage
  useEffect(() => {
    const checkToken = () => {
      const sellerToken = localStorage.getItem('sellerToken');
      const seller = JSON.parse(localStorage.getItem('seller'));

      if (sellerToken && seller) {
        const role = seller.role;
        if (role === 'seller') {
          navigate('/sellerdashboard');
        } else if (role === 'admin') {
          navigate('/admin/admindashboard');
        }
      }
    };

    checkToken();
  }, [navigate]);

  // Form handling with react-hook-form and yup
  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: yupResolver(schema) });

  const onSubmit = async (data) => {
    try {
      const response = await instance.post(
        '/api/v1/seller/sellerlogin',
        data,
        { withCredentials: true }
      );

      if (response.data.success) {
       
        localStorage.setItem('sellerToken', response.data.token);
        localStorage.setItem('seller', JSON.stringify(response.data.seller));

        toast.success('Login successful!', { autoClose: 3000 });

        const role = response.data.seller.role;
        if (role === 'seller') {
          navigate('/sellerdashboard');
        } else if (role === 'admin') {
          navigate('/admin/admindashboard');
        }
        window.location.reload();
        
      } else {
        toast.error(response.data.message, { autoClose: 2000 });
      }
    } catch (error) {
      toast.error('Login failed. Please try again.', { autoClose: 2000 });
    }
  };

  return (
    <div>
      <ToastContainer />
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-y-2 rounded-md border p-6 border-success">
        <input
          {...register('email')}
          type='email'
          placeholder="Email"
          className="block w-full rounded-lg border border-gray-300 bg-gray-50 px-2 py-1.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
        />
        {errors.email && <p>{errors.email.message}</p>}
        <input
          {...register('password')}
          type="password"
          placeholder="Password"
          className="block w-full rounded-lg border border-gray-300 bg-gray-50 px-2 py-1.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
        />
        {errors.password && <p>{errors.password.message}</p>}
        <input type="submit" value="Sign In" className="rounded-md bg-green-500 py-1 text-white" />
        <p>
          Not registered yet?{' '}
          <Link to="/seller/signup" className="text-green-500 underline">
            Signup
          </Link>
        </p>
      </form>
    </div>
  );
};

export default SellerSignin;



