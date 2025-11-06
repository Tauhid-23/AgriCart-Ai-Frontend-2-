import React from 'react';
import { useAuth } from '../context/AuthContext';
import AppLayout from './layout/AppLayout';
import Marketplace from '../pages/Marketplace';

const MarketplaceWithLayout = () => {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return (
      <AppLayout>
        <Marketplace />
      </AppLayout>
    );
  }

  return <Marketplace />;
};

export default MarketplaceWithLayout;