import style from './styles.module.scss';
import clsx from 'clsx';
import { FC } from 'react';

export interface TextButtonProps {
  text: string;
  buttonColor: 'purple' | 'white';
}

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
