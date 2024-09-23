import { createBrowserRouter } from 'react-router-dom';
import { Homepage } from '../pages/HomePage/Homepage';
import { ProductPage } from '../pages/ProductPage/ProductPage';
import { ProductsPage } from '../pages/ProductsPage/ProductsPage';
import { Layout } from './Layout';

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
        path: '/product/',
        element: <ProductPage />,
      },
    ],
  },
]);
