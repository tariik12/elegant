import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from 'react-query'; // Import QueryClient and QueryClientProvider

import { RouterProvider } from 'react-router-dom';
import './index.css';

import { router } from './Provider/Router';
import { AuthProvider } from './Provider/AuthProvier';

const queryClient = new QueryClient(); // Create a QueryClient instance

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </QueryClientProvider>
  </React.StrictMode>,
);
