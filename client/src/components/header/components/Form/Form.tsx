import style from './styles.module.scss';
import heart from '@/assets/heart.svg';
import user from '@/assets/user.svg';
import shoppingCart from '@/assets/user.svg';
import { IconButton } from '@/shared/components/IconButton/IconButton';
import { FC } from 'react';

export const Form: FC = () => {
  return (
    <div className={style.form}>
      <IconButton icon={heart} />
      <IconButton icon={user} />
      <IconButton icon={shoppingCart} />
    </div>
  );
};
