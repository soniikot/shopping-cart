import style from './styles.module.scss';
import { menuList } from '@/components/Header/components/Menu/constants';
import { Link } from 'react-router-dom';
import { FC } from 'react';

const Menu: FC = () => {
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
