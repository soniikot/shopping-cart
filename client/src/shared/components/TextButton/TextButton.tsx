import style from './styles.module.scss';
import { TextButtonProps } from '@/types/interfaces';
import clsx from 'clsx';
import { FC } from 'react';

export const TextButton: FC<TextButtonProps> = ({ text, buttonColor }) => {
  return (
    <button
      className={clsx(style.button, {
        [style.purple]: buttonColor === 'purple',
        [style.white]: buttonColor === 'white',
      })}
    >
      {text}
    </button>
  );
};
