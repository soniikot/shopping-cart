import style from './styles.module.scss';
import { menuList } from '../../../../constants/menuList';
import { Link } from 'react-router-dom';

const Menu = () => {
  return (
    <ul className={style['header-menu']}>
      {menuList.map((menuItem) => (
        <li key={menuItem}>
          <Link to={'/products'} className={style.link}>
            {menuItem}
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default Menu;
