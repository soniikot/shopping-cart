import { createBrowserRouter } from 'react-router-dom';
import { Homepage } from '../pages/HomePage/Homepage';
import { ProductPage } from '../pages/ProductPage/ProductPage';
import { ProductsPage } from '../pages/ProductsPage/ProductsPage';
import { Layout } from './Layout';
import { Cart } from '@/pages/Cart/Cart';
import ScrollToTop from '@/helpers/ScrollToTop';

export const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <ScrollToTop>
        <Layout />
      </ScrollToTop>
    ),
    children: [
      {
        path: '/',
        element: (
          <ScrollToTop>
            <Homepage />
          </ScrollToTop>
        ),
      },
      {
        path: '/products/',
        element: (
          <ScrollToTop>
            <ProductsPage />
          </ScrollToTop>
        ),
      },
      {
        path: '/product/:id',
        element: (
          <ScrollToTop>
            <ProductPage />
          </ScrollToTop>
        ),
      },
      {
        path: '/cart/',
        element: (
          <ScrollToTop>
            <Cart />
          </ScrollToTop>
        ),
      },
    ],
  },
]);
