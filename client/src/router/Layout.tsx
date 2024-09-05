import { Outlet } from 'react-router-dom';
import Header from '../components/Header/Header';
import { Footer } from '../pages/Footer/Footer';

export const Layout = () => {
  return (
    <div>
      <Header />
      <Outlet />
      <Footer />
    </div>
  );
};
