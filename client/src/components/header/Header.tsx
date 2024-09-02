import logo from '../../assets/logo.svg';
import Menu from './components/Menu/Menu';
import Search from './components/Search/Search';
import HeaderForm from './components/Header_form/HeaderForm';
import style from './header.module.css';

// PascalCase camelCase

const Header = () => {
  return (
    <header className={style.header}>
      <img className="header__logo" src={logo} alt="logo" />
      <Menu />
      <Search />
      <HeaderForm />
    </header>
  );
};

export default Header;
