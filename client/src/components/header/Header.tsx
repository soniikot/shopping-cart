import logo from '@/assets/logo.svg';
import Menu from './components/Menu/Menu';
import Search from './components/Search/Search';
import Form from './components/Form/Form';
import style from './styles.module.scss';

const Header = () => {
  return (
    <div className="container">
      <header className={style.header}>
        <img src={logo} alt="logo" />
        <Menu />
        <Search />
        <Form />
      </header>
    </div>
  );
};

export default Header;
