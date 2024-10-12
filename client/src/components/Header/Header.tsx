import logo from '@/assets/logo.svg';
import { Menu } from '@/components/Header/components/Menu/Menu';
import { Search } from '@/components/Header/components/Search/Search';
import { Form } from '@/components/Header/components/Form/Form';
import style from './styles.module.scss';
import { FC } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BurgerMenu } from './components/BurgerMenu/BurgerMenu';
import { resetFilter } from '@/features/filter/filterSlice';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';

export const Header: FC = () => {
  const { pathname } = useLocation();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(resetFilter());
  }, [pathname]);

  return (
    <div className="container">
      <header className={style.header}>
        <Link to="/">
          <img src={logo} alt="logo" />
        </Link>
        <Menu />
        <Search />
        <Form />
        <div className={style.burger_menu}>
          <BurgerMenu />
        </div>
      </header>
    </div>
  );
};
