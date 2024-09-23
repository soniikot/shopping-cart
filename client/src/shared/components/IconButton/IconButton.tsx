import style from './styles.module.scss';

import { FC } from 'react';

interface IconButtonProps {
  icon: string;
}

export const IconButton: FC<IconButtonProps> = ({ icon }) => {
  return (
    <button className={style.button}>
      <img src={icon} />
    </button>
  );
};
