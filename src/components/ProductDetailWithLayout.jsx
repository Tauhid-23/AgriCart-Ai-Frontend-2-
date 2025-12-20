import React from 'react';
import { useAuth } from '../context/AuthContext';
import AppLayout from './layout/AppLayout';
import ProductDetail from '../pages/ProductDetail';

const ProductDetailWithLayout = () => {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return (
      <AppLayout>
        <ProductDetail />
      </AppLayout>
    );
  }

  return <ProductDetail />;
};

export default ProductDetailWithLayout;