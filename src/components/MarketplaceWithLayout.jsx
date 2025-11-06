import React from 'react';
import { useAuth } from '../context/AuthContext';
import AppLayout from './layout/AppLayout';
import Marketplace from '../pages/Marketplace';
import ErrorBoundary from './ErrorBoundary';

const MarketplaceWithLayout = () => {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return (
      <AppLayout>
        <ErrorBoundary>
          <Marketplace />
        </ErrorBoundary>
      </AppLayout>
    );
  }

  return (
    <ErrorBoundary>
      <Marketplace />
    </ErrorBoundary>
  );
};

export default MarketplaceWithLayout;