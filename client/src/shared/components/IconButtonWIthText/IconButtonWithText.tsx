import style from './styles.module.scss';
import { FC } from 'react';
import { IconButtonWithTextProps } from '@/types/interfaces';
import clsx from 'clsx';

export const IconButtonWithText: FC<IconButtonWithTextProps> = ({
  icon,
  text,
  buttonColor,
}) => {
  return (
    <button
      className={clsx(style.button, {
        [style.purple]: buttonColor === 'purple',
        [style.white]: buttonColor === 'white',
      })}
    >
      <div className={style.inner}>
        <img src={icon} alt="" /> {text}
      </div>
    </button>
  );
};
