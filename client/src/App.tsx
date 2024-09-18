import '../src/App.scss';
import { RouterProvider } from 'react-router-dom';
import { router } from './router/router';
import { FC } from 'react';

export const App: FC = () => {
  return (
    <div>
      <RouterProvider router={router} />
    </div>
  );
};
