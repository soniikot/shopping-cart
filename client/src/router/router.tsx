import { createBrowserRouter } from 'react-router-dom';
import { Homepage } from '../pages/HomePage/HomePage';
import { ProductPage } from '../pages/ProductPage/ProductPage';
import { ProductsPage } from '../pages/ProductsPage/ProductsPage';
import { Layout } from './Layout';
import { Cart } from '@/pages/Cart/Cart';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <Homepage />,
      },
      {
        path: '/products/',
        element: <ProductsPage />,
      },
      {
        path: '/product/:id',
        element: <ProductPage />,
      },
      {
        path: '/cart/',
        element: <Cart />,
      },
    ],
  },
]);
