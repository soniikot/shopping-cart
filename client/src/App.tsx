import '../src/App.scss';

import { RouterProvider } from 'react-router-dom';

import { router } from './router/router';

export const App = () => {
  return (
    <div>
      <RouterProvider router={router} />
    </div>
  );
};
