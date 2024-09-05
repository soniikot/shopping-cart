import style from './menu.module.scss';

// ./constants.ts
// MENU_LIST
const menuList = ['Shop', 'Man', 'Woman', 'Combos', 'Joggers'];

// header-menu
// header__menu
//

const Menu = () => {
  return (
    <ul className={style['header-menu']}>
      {menuList.map((menuItem) => (
        <li key={menuItem}>
          <a>{menuItem}</a>
        </li>
      ))}
    </ul>
  );
};

export default Menu;
