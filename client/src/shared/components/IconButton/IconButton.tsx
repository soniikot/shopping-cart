import style from './styles.module.scss';
import { IconButtonProps } from '@/types/interfaces';

export const IconButton: React.FC<IconButtonProps> = ({ icon }) => {
  return (
    <button className={style.button}>
      <img src={icon} />
    </button>
  );
};
