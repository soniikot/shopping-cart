import style from './styles.module.scss';
import { menuList } from '../../../../constants/menuList';
import { Link } from 'react-router-dom';
import { FC } from 'react';

export const Menu: FC = () => {
  return (
    <ul className={style.header_menu}>
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
