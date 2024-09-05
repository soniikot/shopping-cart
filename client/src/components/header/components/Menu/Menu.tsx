import style from './menu.module.scss';
import { menuList } from '../..//../../constants/menuList';

const Menu = () => {
  return (
    <ul className={style['header-menu']}>
      {menuList.map((menuItem) => (
        <li key={menuItem}>
          h <a className={style.link}>{menuItem}</a>
        </li>
      ))}
    </ul>
  );
};

export default Menu;
