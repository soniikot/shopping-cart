import '../src/App.scss';

import { RouterProvider } from 'react-router-dom';

import { router } from './router/router';

const App = () => {
  return (
    <div>
      <RouterProvider router={router} />
    </div>
  );
};

export default App;
