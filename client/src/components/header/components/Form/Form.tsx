import style from './styles.module.scss';
import heart from '@/assets/heart.svg';
import user from '@/assets/user.svg';
import shoppingCart from '@/assets/shopping-cart.svg';
import shoppingCartWhite from '@/assets/shopping-cart-white.svg';
import { IconButton } from '@/shared/components/IconButton/IconButton';
import { FC } from 'react';
import { Link, useLocation } from 'react-router-dom';

export const Form: FC = () => {
  const location = useLocation();

  const isActive = location.pathname === '/cart';

  return (
    <div className={style.form}>
      <IconButton icon={heart} />
      <IconButton icon={user} />
      <Link to="/cart">
        <IconButton
          icon={isActive ? shoppingCartWhite : shoppingCart}
          isActive={isActive}
        />
      </Link>
    </div>
  );
};
