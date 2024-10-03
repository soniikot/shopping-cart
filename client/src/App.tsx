import '../src/App.scss';
import { RouterProvider } from 'react-router-dom';
import { router } from './router/router';
import { FC, useEffect } from 'react';
import { useAppDispatch } from './app/hooks';
import { fetchProducts } from './features/products/productsSlice';
import { fetchCategories } from './features/categories/categoriesSlice';

export const App: FC = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  return (
    <div>
      <RouterProvider router={router} />
    </div>
  );
};
