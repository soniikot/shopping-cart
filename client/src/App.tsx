import './App.css';
import { Homepage } from './pages/HomePage/Homepage';
import { createBrowserRouter, RouterProvider, Route } from 'react-router-dom';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Homepage />,
  },
  {
    path: '/products/',
    element: <span>Category</span>,
  },
  {
    path: '/products/:id',
    element: <span>Product</span>,
  },
]);
const App = () => {
  return (
    <div>
      <RouterProvider router={router} />
    </div>
  );
};

export default App;
