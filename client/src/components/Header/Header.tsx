import logo from '@/assets/logo.svg';
import { Menu } from '@/components/Header/components/Menu/Menu';
import { Search } from '@/components/Header/components/Search/Search';
import { Form } from '@/components/Header/components/Form/Form';
import style from './styles.module.scss';
import { FC } from 'react';
import { Link } from 'react-router-dom';

export const Header: FC = () => {
  return (
    <div className="container">
      <header className={style.header}>
        <Link to="/">
          <img src={logo} alt="logo" />
        </Link>
        <Menu />
        <Search />
        <Form />
      </header>
    </div>
  );
};
