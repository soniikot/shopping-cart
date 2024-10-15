import style from './styles.module.scss';
import clsx from 'clsx';
import { FC } from 'react';
import { useNavigate } from 'react-router-dom';

export interface TextButtonProps {
  text: string;
  buttonColor: 'purple' | 'white';
  link?: string;
}

export const TextButton: FC<TextButtonProps> = ({
  text,
  buttonColor,
  link,
}) => {
  const navigate = useNavigate();
  const handleClick = () => {
    if (link) {
      navigate(link);
    }
  };

  return (
    <button
      onClick={handleClick}
      className={clsx(style.button, {
        [style.purple]: buttonColor === 'purple',
        [style.white]: buttonColor === 'white',
      })}
    >
      {text}
    </button>
  );
};
