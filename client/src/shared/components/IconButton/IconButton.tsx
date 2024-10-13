import { clsx } from 'clsx';
import style from './styles.module.scss';
import { FC } from 'react';

interface IconButtonProps {
  icon: string;
  className?: string;
  onClick?: () => void;
  isActive?: boolean;
}

export const IconButton: FC<IconButtonProps> = ({
  icon,
  className,
  onClick,
  isActive,
}) => {
  return (
    <button
      className={clsx(style.button, className, {
        [style.active]: isActive,
      })}
      onClick={onClick}
    >
      <img src={icon} alt="icon" />
    </button>
  );
};
