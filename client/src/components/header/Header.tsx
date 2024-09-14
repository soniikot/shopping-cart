import logo from '@/assets/logo.svg';
import Menu from '@/components/Header/components/Menu/Menu';
import Search from '@/components/Header/components/Search/Search';
import Form from '@/components/Header/components/Form/Form';
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
