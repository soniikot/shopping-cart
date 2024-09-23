import style from './styles.module.scss';
import { IconButtonProps } from '@/types/interfaces';
import { FC } from 'react';

export const IconButton: FC<IconButtonProps> = ({ icon }) => {
  return (
    <button className={style.button}>
      <img src={icon} />
    </button>
  );
};
